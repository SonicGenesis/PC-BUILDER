import asyncio
import logging
from app.services.crawler.crawler_service import CrawlerService
from app.database.config import SessionLocal
from app.models.models import Component, Category
import sys
import aiohttp
from bs4 import BeautifulSoup
import re

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

async def scrape_amazon_category(session: aiohttp.ClientSession, category_url: str):
    """Scrape products from an Amazon.in category page."""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
    }

    try:
        async with session.get(category_url, headers=headers) as response:
            if response.status == 200:
                html = await response.text()
                soup = BeautifulSoup(html, 'lxml')
                
                products = []
                # Find product cards
                for product in soup.select('.s-result-item[data-asin]'):
                    try:
                        asin = product.get('data-asin')
                        if not asin:
                            continue
                            
                        name_elem = product.select_one('h2 .a-link-normal')
                        if not name_elem:
                            continue
                            
                        name = name_elem.text.strip()
                        url = f"https://www.amazon.in/dp/{asin}"
                        
                        if any(keyword.lower() in name.lower() for keyword in ['gpu', 'graphics card', 'processor', 'cpu', 'ram', 'memory']):
                            products.append({
                                'name': name,
                                'url': url
                            })
                            
                    except Exception as e:
                        logger.error(f"Error parsing product: {str(e)}")
                        continue
                        
                return products
    except Exception as e:
        logger.error(f"Error scraping category: {str(e)}")
        return []

async def test_crawler():
    """Test the crawler service by scraping real products from Amazon.in."""
    try:
        crawler_service = CrawlerService()
        db = SessionLocal()
        
        try:
            # Define categories and their Amazon.in search URLs
            categories = {
                "Graphics Cards": {
                    "description": "High-performance GPUs for gaming and graphics work",
                    "url": "https://www.amazon.in/s?k=graphics+card+nvidia+rtx&rh=n%3A976392031"
                },
                "Processors": {
                    "description": "CPUs for desktop computers",
                    "url": "https://www.amazon.in/s?k=processor+ryzen+intel&rh=n%3A976392031"
                },
                "Memory": {
                    "description": "RAM modules for system memory",
                    "url": "https://www.amazon.in/s?k=ddr5+ram+desktop&rh=n%3A976392031"
                }
            }
            
            # Create categories in database
            db_categories = {}
            for name, info in categories.items():
                category = db.query(Category).filter(Category.name == name).first()
                if not category:
                    category = Category(name=name, description=info["description"])
                    db.add(category)
                db_categories[name] = category
            
            db.commit()
            
            print("\nScraping products from Amazon.in...")
            async with aiohttp.ClientSession() as session:
                for category_name, info in categories.items():
                    print(f"\nScraping {category_name}...")
                    products = await scrape_amazon_category(session, info["url"])
                    
                    for product in products:
                        # Check if product already exists
                        existing = db.query(Component).filter(Component.url == product["url"]).first()
                        if not existing:
                            component = Component(
                                name=product["name"],
                                url=product["url"],
                                category_id=db_categories[category_name].id
                            )
                            db.add(component)
                    
                    print(f"Found {len(products)} products in {category_name}")
            
            db.commit()
            
            # Run the crawler on scraped products
            print("\nFetching prices for all products...")
            success = await crawler_service.crawl_prices(db)
            
            if success:
                print("\n✅ Successfully updated prices")
                
                # Print updated prices by category
                components = db.query(Component).all()
                for category_name in categories.keys():
                    category_components = [c for c in components if c.category.name == category_name]
                    if category_components:
                        print(f"\n{category_name}:")
                        print("-" * 90)
                        print(f"{'Product Name':<70} {'Price':>15}")
                        print("-" * 90)
                        for component in category_components:
                            price_str = f"₹{component.current_price:,.2f}" if component.current_price is not None else "Not available"
                            name = component.name[:67] + "..." if len(component.name) > 67 else component.name
                            print(f"{name:<70} {price_str:>15}")
            else:
                print("\n❌ Failed to update prices")
                
        finally:
            db.close()
            
    except Exception as e:
        print(f"\n❌ Error during testing: {str(e)}")
        raise

if __name__ == "__main__":
    print("Starting Amazon.in Product Scraper and Price Crawler\n" + "="*50 + "\n")
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_crawler()) 