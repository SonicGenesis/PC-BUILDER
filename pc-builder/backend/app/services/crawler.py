from typing import List, Dict, Optional
from datetime import datetime
import aiohttp
import asyncio
from bs4 import BeautifulSoup
import time
import re
from sqlalchemy.orm import Session
from .services import ComponentService, PriceService
from ..models.models import Component, Price, Category
import logging

logger = logging.getLogger(__name__)

class RateLimiter:
    def __init__(self, calls_per_second: float):
        self.calls_per_second = calls_per_second
        self.last_call_time = 0

    async def wait(self):
        """Wait if needed to respect rate limits."""
        current_time = time.time()
        time_since_last_call = current_time - self.last_call_time
        time_to_wait = max(0, (1 / self.calls_per_second) - time_since_last_call)
        
        if time_to_wait > 0:
            await asyncio.sleep(time_to_wait)
        
        self.last_call_time = time.time()

class CrawlerService:
    def __init__(self):
        self.component_service = ComponentService()
        self.price_service = PriceService()
        self.rate_limiter = RateLimiter(calls_per_second=1/2)  # One request every 2 seconds
        self.similarity_threshold = 0.2  # Lower threshold for more lenient matching
        
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
        Creates a simple search term focusing on key identifiers.
        """
        # Start with basic component info
        search_parts = []
        
        # Add manufacturer if it exists and isn't generic
        if component.manufacturer and component.manufacturer.lower() not in ['generic', 'various']:
            search_parts.append(component.manufacturer)
        
        # Add the main component name
        if component.name:
            # Extract key model identifiers
            model_pattern = r'([A-Z0-9]+-[A-Z0-9]+|[A-Z]{2,}[0-9]{3,}|[0-9]{4,}[A-Z]*)'
            models = re.findall(model_pattern, component.name, re.IGNORECASE)
            
            if models:
                # If we have model numbers, use them
                search_parts.extend(models)
            else:
                # Otherwise use key words from the name
                name_parts = component.name.split()
                search_parts.extend([p for p in name_parts if len(p) > 2])
        
        # Add category for context if available
        if hasattr(component, 'category') and component.category and component.category.name:
            search_parts.append(component.category.name)
        
        # Join parts and clean up
        search_term = ' '.join(search_parts)
        search_term = re.sub(r'\b(gaming|rgb|series|edition)\b', '', search_term, flags=re.IGNORECASE)
        search_term = ' '.join(search_term.split())
        
        return search_term.replace(' ', '+')

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
        Fetch price for a component using search results.
        """
        try:
            await self.rate_limiter.wait()
            
            url = site_info['url_formatter'](search_term)
            if debug:
                print(f"Searching: {url}")

            async with session.get(url, ssl=False) as response:
                if response.status != 200:
                    raise Exception(f"HTTP {response.status}")

                html = await response.text()
                soup = BeautifulSoup(html, 'lxml')
                
                # Find all products in search results
                products = soup.select(site_info['product_selector'])
                if not products:
                    raise Exception("No products found in search results")

                if debug:
                    print(f"Found {len(products)} products in search")

                # Look at first few products only
                for product in products[:3]:  # Only check first 3 results
                    try:
                        title_elem = product.select_one(site_info['title_selector'])
                        price_elem = product.select_one(site_info['price_selector'])
                        link_elem = product.select_one(site_info['link_selector'])
                        
                        if not all([title_elem, price_elem, link_elem]):
                            continue
                            
                        title = title_elem.text.strip()
                        price = self._extract_price(price_elem.text)
                        url = link_elem.get('href', '')
                        if not url.startswith('http'):
                            url = f"https://www.amazon.in{url}"
                        
                        if price and price > 0:
                            # Record the price
                            price_record = self.price_service.record_price(
                                db=db,
                                component_id=component.id,
                                price=price
                            )

                            return {
                                "component_id": component.id,
                                "component_name": component.name,
                                "site": site_name,
                                "price": price,
                                "matched_product": title,
                                "url": url,
                                "timestamp": price_record.date_retrieved,
                                "currency": site_info['currency']
                            }
                            
                    except Exception as e:
                        if debug:
                            print(f"Error processing product: {str(e)}")
                        continue

                raise Exception("No valid products found with prices")

        except Exception as e:
            if debug:
                import traceback
                print(f"Error details for {site_name}:")
                print(traceback.format_exc())
            raise e

    def _extract_price(self, price_text: str) -> Optional[float]:
        """Extract numerical price from text."""
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

    async def update_prices(self, db: Session):
        """Update component prices and sync with Google Sheets."""
        try:
            # Get all components
            components = db.query(Component).all()
            updated_components = []
            
            async with aiohttp.ClientSession() as session:
                for component in components:
                    try:
                        # Store previous price
                        previous_price = component.current_price or 0
                        
                        # Get new price
                        new_price = await self.get_current_price(session, component.url)
                        
                        if new_price is not None:
                            component.current_price = new_price
                            
                            # Create price history entry
                            price_entry = Price(
                                component_id=component.id,
                                price=new_price,
                                timestamp=datetime.utcnow()
                            )
                            db.add(price_entry)
                            
                            # Prepare component data for sheets
                            component_data = {
                                'name': component.name,
                                'category': {'name': component.category.name},
                                'current_price': new_price,
                                'previous_price': previous_price,
                                'url': component.url
                            }
                            updated_components.append(component_data)
                            logger.info(f"Updated price for {component.name}: ${new_price:.2f}")
                        else:
                            logger.warning(f"Could not fetch price for {component.name}")
                            
                    except Exception as e:
                        logger.error(f"Error updating price for {component.name}: {str(e)}")
                        continue

            # Commit database changes
            db.commit()
            
            # Update Google Sheets
            if updated_components:
                success = self.sheets_service.update_component_prices(updated_components)
                if success:
                    logger.info(f"Successfully synced {len(updated_components)} prices to Google Sheets")
                else:
                    logger.error("Failed to sync prices to Google Sheets")
            
            return True
            
        except Exception as e:
            logger.error(f"Error in price update process: {str(e)}")
            db.rollback()
            return False 