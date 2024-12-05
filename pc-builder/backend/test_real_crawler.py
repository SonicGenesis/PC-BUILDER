import asyncio
import sys
import os
from datetime import datetime

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.config import SessionLocal
from app.services.crawler import CrawlerService
from app.services.services import ComponentService

async def test_real_crawler():
    db = SessionLocal()
    crawler_service = CrawlerService()
    component_service = ComponentService()

    try:
        print("\n=== PC Component Price Crawler Test ===\n")

        # 1. Show supported sites and their configurations
        print("Supported E-commerce Sites:")
        for site, config in crawler_service.supported_sites.items():
            print(f"\n{site.upper()}:")
            print(f"  Base URL: {config['base_url']}")
            print(f"  Selectors:")
            print(f"    - Price: {config['price_selector']}")
            print(f"    - Product: {config['product_selector']}")
            print(f"    - Title: {config['title_selector']}")

        # 2. Get all components
        components = component_service.get_all(db)
        if not components:
            print("\nNo components found in database. Please add some components first.")
            return

        print(f"\nFound {len(components)} components in database.")
        
        # 3. Test crawling for each component
        for component in components:
            print(f"\n{'='*80}")
            print(f"Testing: {component.manufacturer} {component.name}")
            print(f"Category ID: {component.category_id}")
            print(f"Current Base Price: ${component.price}")
            print(f"{'='*80}")

            # Crawl prices with debug mode
            results = await crawler_service.crawl_prices(db, component.id, debug=True)
            
            # Summarize results
            successful_crawls = [r for r in results if "price" in r]
            failed_crawls = [r for r in results if "error" in r]
            
            print(f"\nSummary for {component.name}:")
            print(f"✅ Successful crawls: {len(successful_crawls)}")
            print(f"❌ Failed crawls: {len(failed_crawls)}")
            
            if successful_crawls:
                print("\nPrice Comparison:")
                print(f"Base Price: ${component.price}")
                for result in successful_crawls:
                    diff = ((result['price'] - component.price) / component.price) * 100
                    print(f"{result['site']}: ${result['price']} ({diff:+.1f}%)")
                    print(f"  Matched: {result.get('matched_product', 'N/A')}")
                    print(f"  Similarity: {result.get('similarity', 0):.2f}")
                    print(f"  URL: {result.get('url', 'N/A')}")

            # Get best price
            best_price = await crawler_service.get_best_price(db, component.id)
            if "error" not in best_price:
                print(f"\nBest Price Found:")
                print(f"💰 ${best_price['best_price']} at {best_price['site']}")
                print(f"Product: {best_price['matched_product']}")
                print(f"Similarity: {best_price['similarity']:.2f}")
                print(f"URL: {best_price['url']}")
            
            # Add a delay between components to respect rate limits
            await asyncio.sleep(5)

    except Exception as e:
        import traceback
        print(f"\nError during testing: {str(e)}")
        print(traceback.format_exc())
    finally:
        db.close()

if __name__ == "__main__":
    print("Starting crawler test...")
    print("Note: This will make real requests to e-commerce sites.")
    print("Press Ctrl+C to cancel or ENTER to continue...")
    input()
    
    asyncio.run(test_real_crawler()) 