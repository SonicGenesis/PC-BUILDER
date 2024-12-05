import asyncio
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.tests.test_data import create_test_data
from app.tests.test_crawler import test_crawler

async def main():
    print("\n=== PC Builder Price Crawler Test Suite ===\n")
    
    # Step 1: Create test data
    print("Step 1: Setting up test data...")
    success = create_test_data()
    if not success:
        print("Failed to create test data. Exiting.")
        return

    # Step 2: Run crawler tests
    print("\nStep 2: Testing price crawler...")
    print("Note: This will make real requests to e-commerce sites.")
    print("Press Ctrl+C to cancel or ENTER to continue...")
    input()
    
    await test_crawler()

if __name__ == "__main__":
    asyncio.run(main()) 