import asyncio
from app.database.config import SessionLocal
from app.services.crawler import CrawlerService
from app.services.services import ComponentService

async def test_crawler():
    """
    Test the crawler functionality with sample components.
    """
    db = SessionLocal()
    crawler_service = CrawlerService()
    component_service = ComponentService()

    try:
        print("\n=== Testing Crawler Functionality ===\n")

        # 1. Show supported sites
        print("Supported E-commerce Sites:")
        for site in crawler_service.supported_sites:
            print(f"- {site}")
        print()

        # 2. Test crawling for a specific component (AMD Ryzen 7 5800X)
        print("Testing Single Component Crawl:")
        components = component_service.get_all(db)
        if components:
            component = components[0]  # Get first component (AMD Ryzen 7 5800X)
            print(f"\nCrawling prices for: {component.name}")
            results = await crawler_service.crawl_prices(db, component.id)
            
            print("\nResults:")
            for result in results:
                if "error" in result:
                    print(f"❌ {result['site']}: {result['error']}")
                else:
                    print(f"✅ {result['site']}: ${result['price']}")
        
        # 3. Get best price for a component
        print("\nTesting Best Price Search:")
        if components:
            best_price = await crawler_service.get_best_price(db, components[0].id)
            if "error" in best_price:
                print(f"Error: {best_price['error']}")
            else:
                print(f"Best price for {best_price['component_name']}:")
                print(f"💰 ${best_price['best_price']} at {best_price['site']}")

        # 4. Test batch crawling (all components)
        print("\nTesting Batch Crawl (first 2 components):")
        all_results = await crawler_service.crawl_prices(db)
        
        # Group results by component
        results_by_component = {}
        for result in all_results[:6]:  # Show first 6 results
            component_id = result['component_id']
            if component_id not in results_by_component:
                results_by_component[component_id] = {
                    'name': result['component_name'],
                    'prices': []
                }
            if 'error' in result:
                results_by_component[component_id]['prices'].append(
                    f"❌ {result['site']}: {result['error']}"
                )
            else:
                results_by_component[component_id]['prices'].append(
                    f"✅ {result['site']}: ${result['price']}"
                )

        # Print grouped results
        for component_data in results_by_component.values():
            print(f"\n{component_data['name']}:")
            for price_info in component_data['prices']:
                print(price_info)

    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test_crawler()) 