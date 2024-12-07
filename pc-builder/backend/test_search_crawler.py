import asyncio
import sys
import os
from datetime import datetime

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.config import SessionLocal
from app.services.crawler import CrawlerService
from app.models.models import Component, Category

async def test_search_crawler():
    """Test the updated search-based crawler with some real components."""
    db = SessionLocal()
    crawler = CrawlerService()
    
    try:
        # Test components with different search patterns
        test_components = [
            {
                "name": "NVIDIA GeForce RTX 4070 Ti",
                "category": "Graphics Cards",
                "description": "NVIDIA RTX 4070 Ti graphics card",
                "url": "https://www.amazon.in/s?k=rtx+4070+ti"
            },
            {
                "name": "AMD Ryzen 7 7800X3D",
                "category": "Processors",
                "description": "AMD Ryzen 7 7800X3D processor",
                "url": "https://www.amazon.in/s?k=ryzen+7+7800x3d"
            },
            {
                "name": "Corsair Vengeance 32GB DDR5 6000MHz",
                "category": "Memory",
                "description": "Corsair Vengeance DDR5 RAM",
                "url": "https://www.amazon.in/s?k=corsair+vengeance+ddr5+32gb"
            },
            {
                "name": "Intel Core i7-13700K",
                "category": "Processors",
                "description": "Intel Core i7 13th Gen processor",
                "url": "https://www.amazon.in/s?k=intel+i7+13700k"
            },
            {
                "name": "AMD Radeon RX 7800 XT",
                "category": "Graphics Cards",
                "description": "AMD Radeon RX 7800 XT graphics card",
                "url": "https://www.amazon.in/s?k=rx+7800+xt"
            }
        ]

        # Create categories if they don't exist
        for component in test_components:
            category = db.query(Category).filter(Category.name == component["category"]).first()
            if not category:
                category = Category(
                    name=component["category"],
                    description=f"Category for {component['category']}"
                )
                db.add(category)
                db.flush()

            # Create test component
            db_component = Component(
                name=component["name"],
                description=component["description"],
                category_id=category.id,
                url=component["url"]
            )
            db.add(db_component)
        
        db.commit()

        print("\n=== Testing Search-Based Crawler ===\n")
        
        # Test crawling for each component
        for component in db.query(Component).all():
            print(f"\n{'='*80}")
            print(f"Testing: {component.name}")
            print(f"Category: {component.category.name}")
            print(f"{'='*80}")

            try:
                # Get search term
                search_term = crawler._prepare_search_term(component)
                print(f"\nGenerated search term: {search_term}")

                # Crawl prices with debug mode
                results = await crawler.crawl_prices(db, component.id, debug=True)
                
                if results:
                    successful_results = [r for r in results if "price" in r]
                    if successful_results:
                        print("\nSuccessful matches:")
                        for result in successful_results:
                            print(f"\nSite: {result['site']}")
                            print(f"Price: {result['currency']}{result['price']}")
                            print(f"Product: {result['matched_product']}")
                            print(f"URL: {result.get('url', 'N/A')}")
                    else:
                        print("\nNo successful matches found")
                else:
                    print("\nNo results returned")

            except Exception as e:
                print(f"\nError processing {component.name}: {str(e)}")

            # Add delay between components
            await asyncio.sleep(3)

    except Exception as e:
        print(f"\nTest error: {str(e)}")
        import traceback
        print(traceback.format_exc())
    finally:
        db.close()

if __name__ == "__main__":
    print("Starting search-based crawler test...")
    print("This will make real requests to e-commerce sites.")
    print("Press Ctrl+C to cancel or ENTER to continue...")
    input()
    
    asyncio.run(test_search_crawler()) 