from typing import List, Dict, Optional
from datetime import datetime
import aiohttp
import asyncio
from bs4 import BeautifulSoup
import time
import re
from sqlalchemy.orm import Session
from .services import ComponentService, PriceService
from ..models.models import Component

class RateLimiter:
    def __init__(self, calls_per_second=1):
        self.calls_per_second = calls_per_second
        self.last_call_time = {}
        self._lock = asyncio.Lock()

    async def acquire(self, site: str):
        async with self._lock:
            current_time = time.time()
            if site in self.last_call_time:
                time_since_last_call = current_time - self.last_call_time[site]
                if time_since_last_call < (1.0 / self.calls_per_second):
                    delay = (1.0 / self.calls_per_second) - time_since_last_call
                    print(f"Rate limiting: Waiting {delay:.1f} seconds for {site}")
                    await asyncio.sleep(delay)
            self.last_call_time[site] = time.time()

class CrawlerService:
    def __init__(self):
        self.component_service = ComponentService()
        self.price_service = PriceService()
        self.rate_limiter = RateLimiter(calls_per_second=1/10)  # 10 seconds delay
        self.similarity_threshold = 0.2
        
        self.supported_sites = {
            "amazon_in": {
                "base_url": "https://www.amazon.in/s?k=",
                "price_selector": "span.a-price span.a-offscreen",
                "product_selector": "div.s-result-item[data-component-type='s-search-result']",
                "title_selector": "span.a-text-normal",
                "link_selector": "a.a-link-normal.s-no-outline",
                "currency": "₹",
                "url_formatter": lambda term: f"https://www.amazon.in/s?k={term}"
            }
        }
        
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Upgrade-Insecure-Requests": "1"
        }

    def _prepare_search_term(self, component: Component) -> str:
        """
        Prepare search term based on component details.
        Removes unnecessary words and formats for better search results.
        """
        # Get base search term
        search_term = f"{component.manufacturer} {component.name}"
        
        # Extract key identifiers (model numbers, etc.)
        model_pattern = r'([A-Z0-9]+-[A-Z0-9]+|[A-Z]{2,}[0-9]{3,}|[0-9]{4,}[A-Z]*)'
        models = re.findall(model_pattern, search_term, re.IGNORECASE)
        
        if models:
            # If we have model numbers, use them for more precise search
            search_term = ' '.join(models)
        else:
            # Remove common words that might affect search
            search_term = search_term.lower()
            search_term = re.sub(r'\b(gaming|rgb|series|edition)\b', '', search_term)
            search_term = ' '.join(search_term.split())
        
        return search_term.replace(' ', '+')

    def _clean_string(self, text: str) -> str:
        """Clean and normalize text for comparison"""
        if not text:
            return ""
        # Remove common suffixes and prefixes that might affect matching
        text = text.lower()
        text = re.sub(r'\(.*?\)', '', text)  # Remove parentheses and their contents
        text = text.replace('gaming', '').replace('rgb', '')  # Remove common marketing terms
        return ' '.join(text.split())

    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two strings with improved matching"""
        text1 = self._clean_string(text1)
        text2 = self._clean_string(text2)
        
        # Extract model numbers if present
        model_pattern = r'[a-z0-9]+-?[a-z0-9]+'
        models1 = set(re.findall(model_pattern, text1))
        models2 = set(re.findall(model_pattern, text2))
        
        # If we have model numbers in both strings, give them higher weight
        if models1 and models2:
            model_similarity = len(models1.intersection(models2)) / max(len(models1), len(models2))
            if model_similarity > 0:
                return max(model_similarity, 0.4)  # Boost similarity if model numbers match
        
        # Word-based similarity
        words1 = set(text1.split())
        words2 = set(text2.split())
        
        if not words1 or not words2:
            return 0.0
            
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        # Give higher weight to manufacturer and key component words
        key_words = intersection & {'amd', 'intel', 'nvidia', 'rtx', 'rx', 'radeon', 'geforce', 'ryzen', 'core'}
        if key_words:
            return max(len(intersection) / len(union), 0.3)  # Boost similarity if key words match
            
        return len(intersection) / len(union)

    def _extract_price(self, price_text: str, site_name: str = None, price_elem = None) -> Optional[float]:
        """
        Extract numerical price from text.
        """
        try:
            if not price_text:
                return None
            
            # Remove currency symbols and commas
            price_text = (price_text.replace('₹', '')
                         .replace(',', '')
                         .replace('/-', '')
                         .replace('INR', '')
                         .strip())
            
            # Find all numbers in the string (including decimals)
            numbers = re.findall(r'\d+\.?\d*', price_text)
            if numbers:
                # Convert to float and round to 2 decimal places
                return round(float(numbers[0]), 2)
            
            return None
        except (ValueError, IndexError) as e:
            print(f"Error extracting price: {str(e)}")
            return None

    async def crawl_prices(self, db: Session, component_id: Optional[int] = None, debug: bool = False) -> List[Dict]:
        """
        Crawl real prices for components from Amazon India.
        """
        results = []
        components = (
            [self.component_service.get(db, component_id)]
            if component_id
            else self.component_service.get_all(db)
        )

        timeout = aiohttp.ClientTimeout(total=30)
        async with aiohttp.ClientSession(headers=self.headers, timeout=timeout) as session:
            for component in components:
                if not component:
                    continue

                search_term = self._prepare_search_term(component)
                print(f"\nProcessing: {component.manufacturer} {component.name}")
                print(f"Search term: {search_term}")

                for site_name, site_info in self.supported_sites.items():
                    try:
                        print(f"\nCrawling {site_name}...")
                        result = await self._fetch_price(
                            session,
                            site_name,
                            site_info,
                            search_term,
                            component,
                            db,
                            debug
                        )
                        if result:
                            results.append(result)
                            if "error" in result:
                                print(f"❌ {site_name}: {result['error']}")
                            else:
                                print(f"✅ {site_name}: ₹{result['price']} - {result.get('url', 'N/A')}")
                        
                        await asyncio.sleep(2)
                    
                    except asyncio.TimeoutError:
                        print(f"⚠️ Timeout while crawling {site_name}")
                        results.append({
                            "component_id": component.id,
                            "component_name": component.name,
                            "site": site_name,
                            "error": "Request timed out"
                        })
                    except Exception as e:
                        print(f"⚠️ Error crawling {site_name}: {str(e)}")
                        results.append({
                            "component_id": component.id,
                            "component_name": component.name,
                            "site": site_name,
                            "error": str(e)
                        })

        return results

    async def _fetch_price(
        self,
        session: aiohttp.ClientSession,
        site_name: str,
        site_info: Dict,
        search_term: str,
        component: Component,
        db: Session,
        debug: bool = False
    ) -> Optional[Dict]:
        """
        Fetch price for a component from Amazon India.
        """
        try:
            await self.rate_limiter.acquire(site_name)
            
            url = site_info['url_formatter'](search_term)
            print(f"Fetching: {url}")

            async with session.get(url, ssl=False) as response:
                if response.status != 200:
                    raise Exception(f"HTTP {response.status}")

                html = await response.text()
                if debug:
                    print(f"Response length: {len(html)} characters")
                
                soup = BeautifulSoup(html, 'lxml')
                
                products = soup.select(site_info['product_selector'])
                if not products:
                    raise Exception(f"No products found (selector: {site_info['product_selector']})")

                if debug:
                    print(f"Found {len(products)} products")

                best_match = None
                best_similarity = 0
                best_price = None
                best_url = None

                # Get the original search term for comparison
                original_term = f"{component.manufacturer} {component.name}"

                for idx, product in enumerate(products[:8]):
                    title_elem = product.select_one(site_info['title_selector'])
                    if not title_elem:
                        continue
                        
                    title = title_elem.text.strip()
                    similarity = self._calculate_similarity(title, original_term)
                    
                    if debug:
                        print(f"\nProduct {idx + 1}: {title}")
                        print(f"Similarity: {similarity:.2f}")
                    
                    if similarity > best_similarity:
                        price_elem = product.select_one(site_info['price_selector'])
                        link_elem = product.select_one(site_info['link_selector'])
                        
                        if price_elem and link_elem:
                            price = self._extract_price(price_elem.text, site_name, price_elem)
                            
                            if price and price > 0:
                                best_match = title
                                best_similarity = similarity
                                best_price = price
                                best_url = link_elem.get('href', '')
                                if not best_url.startswith('http'):
                                    best_url = f"https://www.amazon.in{best_url}"
                                
                                if debug:
                                    print(f"New best match! Price: ₹{price:.2f}")
                                    print(f"URL: {best_url}")

                if best_price and best_similarity >= self.similarity_threshold:
                    price_record = self.price_service.record_price(
                        db=db,
                        component_id=component.id,
                        price=best_price
                    )

                    return {
                        "component_id": component.id,
                        "component_name": component.name,
                        "site": site_name,
                        "price": best_price,
                        "matched_product": best_match,
                        "similarity": best_similarity,
                        "url": best_url,
                        "timestamp": price_record.date_retrieved,
                        "currency": site_info['currency']
                    }
                else:
                    raise Exception(
                        f"No matching product found (best similarity: {best_similarity:.2f}, "
                        f"threshold: {self.similarity_threshold}, best match: {best_match or 'None'})"
                    )

        except Exception as e:
            if debug:
                import traceback
                print(f"Error details for {site_name}:")
                print(traceback.format_exc())
            raise e

    async def get_best_price(self, db: Session, component_id: int, debug: bool = False) -> Dict:
        """
        Get the best (lowest) current price for a component from Amazon India.
        """
        prices = await self.crawl_prices(db, component_id, debug)
        valid_prices = [p for p in prices if "price" in p]
        
        if not valid_prices:
            return {"error": "No valid prices found"}
        
        best_price = min(valid_prices, key=lambda x: x["price"])
        return {
            "component_id": best_price["component_id"],
            "component_name": best_price["component_name"],
            "best_price": best_price["price"],
            "matched_product": best_price.get("matched_product", "Unknown"),
            "similarity": best_price.get("similarity", 0),
            "site": best_price["site"],
            "url": best_price.get("url", ""),
            "timestamp": best_price["timestamp"],
            "currency": best_price.get("currency", "₹")
        } 