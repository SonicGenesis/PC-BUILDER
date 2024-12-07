from sqlalchemy.orm import Session
from ...models.models import Component, Price
from datetime import datetime
import logging
import aiohttp
from bs4 import BeautifulSoup
import re
import asyncio
import random

logger = logging.getLogger(__name__)

class CrawlerService:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0'
        }
        self.base_delay = 2  # Base delay between requests in seconds
        self.max_retries = 3
        
        # Update supported sites with search configuration
        self.supported_sites = {
            "amazon_in": {
                "base_url": "https://www.amazon.in/s?k=",
                "price_selector": ".a-price .a-offscreen",
                "product_selector": "div.s-result-item[data-component-type='s-search-result']",
                "title_selector": "span.a-text-normal",
                "link_selector": "a.a-link-normal.s-no-outline",
                "currency": "₹"
            }
        }

    def _extract_component_details(self, name: str, category: str) -> dict:
        """
        Extract component details using LLM-like pattern matching.
        Returns a dictionary with extracted details.
        """
        name = name.lower()
        details = {
            "manufacturer": None,
            "model": None,
            "series": None,
            "specs": []
        }

        # Common manufacturers and their identifiers
        manufacturers = {
            "nvidia": ["nvidia", "geforce"],
            "amd": ["amd", "radeon", "ryzen"],
            "intel": ["intel", "core"],
            "corsair": ["corsair"],
            "crucial": ["crucial"],
            "gskill": ["g.skill", "gskill", "trident"],
            "asus": ["asus", "rog"],
            "msi": ["msi"],
            "gigabyte": ["gigabyte", "aorus"],
            "asrock": ["asrock"],
            "evga": ["evga"],
            "zotac": ["zotac"]
        }

        # Find manufacturer
        for mfg, keywords in manufacturers.items():
            if any(keyword in name for keyword in keywords):
                details["manufacturer"] = mfg
                break

        # Extract model details based on category
        if category == "Graphics Cards":
            # NVIDIA GPUs
            if "rtx" in name:
                rtx_match = re.search(r'rtx\s*(\d{4}(?:\s*ti)?)', name)
                if rtx_match:
                    details["series"] = "RTX"
                    details["model"] = rtx_match.group(1).upper()
            elif "gtx" in name:
                gtx_match = re.search(r'gtx\s*(\d{4}(?:\s*ti)?)', name)
                if gtx_match:
                    details["series"] = "GTX"
                    details["model"] = gtx_match.group(1).upper()
            # AMD GPUs
            elif "rx" in name:
                rx_match = re.search(r'rx\s*(\d{4}\s*xt?)', name)
                if rx_match:
                    details["series"] = "RX"
                    details["model"] = rx_match.group(1).upper()

        elif category == "Processors":
            # AMD CPUs
            if "ryzen" in name:
                ryzen_match = re.search(r'ryzen\s*(\d)\s*(\d{4}(?:x\d+)?)', name)
                if ryzen_match:
                    details["series"] = f"Ryzen {ryzen_match.group(1)}"
                    details["model"] = ryzen_match.group(2).upper()
            # Intel CPUs
            elif "core" in name:
                core_match = re.search(r'i([3579])[- ](\d{4,5}[k-zK-Z]*)', name)
                if core_match:
                    details["series"] = f"Core i{core_match.group(1)}"
                    details["model"] = core_match.group(2).upper()

        elif category == "Memory":
            # RAM capacity
            capacity_match = re.search(r'(\d+)\s*gb', name)
            if capacity_match:
                details["specs"].append(f"{capacity_match.group(1)}GB")
            # RAM type
            ddr_match = re.search(r'ddr(\d+)', name)
            if ddr_match:
                details["specs"].append(f"DDR{ddr_match.group(1)}")
            # RAM speed
            speed_match = re.search(r'(\d{4,5})\s*(?:mhz|mt/s)', name)
            if speed_match:
                details["specs"].append(f"{speed_match.group(1)}MHz")

        return details

    def _prepare_search_term(self, component: Component) -> str:
        """
        Prepare search term using LLM-extracted component details.
        """
        if not component.name or not component.category:
            return ""

        # Extract component details
        details = self._extract_component_details(component.name, component.category.name)
        search_parts = []

        # Add manufacturer if found
        if details["manufacturer"]:
            search_parts.append(details["manufacturer"].upper())

        # Add series and model for GPUs and CPUs
        if details["series"]:
            search_parts.append(details["series"])
        if details["model"]:
            search_parts.append(details["model"])

        # Add specs for RAM
        if details["specs"]:
            search_parts.extend(details["specs"])

        # If no specific details found, use cleaned component name
        if not search_parts:
            clean_name = re.sub(r'\b(gaming|rgb|series|edition)\b', '', component.name.lower())
            search_parts = [part for part in clean_name.split() if len(part) > 2]

        # Join parts and clean up
        search_term = ' '.join(search_parts)
        search_term = ' '.join(search_term.split())  # Remove extra spaces
        
        logger.info(f"Generated search term for {component.name}: {search_term}")
        return search_term.replace(' ', '+')

    async def search_product(self, session: aiohttp.ClientSession, search_term: str, site_info: dict) -> list:
        """Search for a product and return results."""
        try:
            url = f"{site_info['base_url']}{search_term}"
            logger.info(f"Searching: {url}")

            async with session.get(url, headers=self.headers) as response:
                if response.status != 200:
                    logger.error(f"Search failed with status {response.status}")
                    return []

                html = await response.text()
                soup = BeautifulSoup(html, 'lxml')
                
                results = []
                products = soup.select(site_info['product_selector'])
                
                for product in products[:3]:  # Look at first 3 results only
                    try:
                        title_elem = product.select_one(site_info['title_selector'])
                        price_elem = product.select_one(site_info['price_selector'])
                        link_elem = product.select_one(site_info['link_selector'])
                        
                        if not all([title_elem, price_elem, link_elem]):
                            continue
                            
                        title = title_elem.text.strip()
                        price_text = price_elem.text.strip()
                        url = link_elem.get('href', '')
                        if not url.startswith('http'):
                            url = f"https://www.amazon.in{url}"
                        
                        # Extract price
                        price_text = re.sub(r'[^\d.]', '', price_text)
                        if price_text:
                            price = float(price_text)
                            if 1000 <= price <= 500000:  # Basic validation
                                results.append({
                                    'title': title,
                                    'price': price,
                                    'url': url
                                })
                    except Exception as e:
                        logger.error(f"Error parsing product: {str(e)}")
                        continue
                
                return results
                
        except Exception as e:
            logger.error(f"Error searching products: {str(e)}")
            return []

    async def crawl_prices(self, db: Session, component_id: int = None, debug: bool = False) -> list:
        """Crawl prices using search functionality."""
        results = []
        
        # Get components to crawl
        query = db.query(Component)
        if component_id:
            query = query.filter(Component.id == component_id)
        components = query.all()
        
        if not components:
            logger.warning("No components found to crawl")
            return results

        timeout = aiohttp.ClientTimeout(total=60)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            for component in components:
                try:
                    # Generate search term
                    search_term = self._prepare_search_term(component)
                    if debug:
                        logger.info(f"Search term for {component.name}: {search_term}")
                    
                    # Search on each supported site
                    for site_name, site_info in self.supported_sites.items():
                        try:
                            # Add delay between requests
                            await asyncio.sleep(self.base_delay)
                            
                            # Search for products
                            search_results = await self.search_product(session, search_term, site_info)
                            
                            if search_results:
                                # Use the first valid result
                                first_result = search_results[0]
                                
                                # Record the price
                                price_entry = Price(
                                    component_id=component.id,
                                    price=first_result['price'],
                                    timestamp=datetime.utcnow()
                                )
                                db.add(price_entry)
                                
                                results.append({
                                    "component_id": component.id,
                                    "component_name": component.name,
                                    "site": site_name,
                                    "price": first_result['price'],
                                    "matched_product": first_result['title'],
                                    "url": first_result['url'],
                                    "timestamp": price_entry.timestamp,
                                    "currency": site_info['currency']
                                })
                                
                            else:
                                logger.warning(f"No results found for {component.name} on {site_name}")
                                results.append({
                                    "component_id": component.id,
                                    "component_name": component.name,
                                    "site": site_name,
                                    "error": "No results found"
                                })
                                
                        except Exception as e:
                            logger.error(f"Error crawling {site_name} for {component.name}: {str(e)}")
                            results.append({
                                "component_id": component.id,
                                "component_name": component.name,
                                "site": site_name,
                                "error": str(e)
                            })
                
                except Exception as e:
                    logger.error(f"Error processing component {component.name}: {str(e)}")
                    results.append({
                        "component_id": component.id,
                        "component_name": component.name,
                        "error": str(e)
                    })
        
        if results:
            db.commit()
        
        return results

    async def get_best_price(self, db: Session, component_id: int) -> dict:
        """Get the best current price for a component from Amazon.in."""
        try:
            component = db.query(Component).filter(Component.id == component_id).first()
            if not component:
                raise ValueError("Component not found")

            async with aiohttp.ClientSession() as session:
                html = await self.fetch_amazon_page(session, component.url)
                if html:
                    price = self.extract_amazon_price(html)
                    if price:
                        return {
                            "component_id": component_id,
                            "name": component.name,
                            "price": price,
                            "currency": "₹",
                            "url": component.url,
                            "timestamp": datetime.utcnow().isoformat()
                        }

            return {
                "component_id": component_id,
                "name": component.name,
                "error": "Price not available",
                "timestamp": datetime.utcnow().isoformat()
            }

        except Exception as e:
            logger.error(f"Error getting best price: {str(e)}")
            raise