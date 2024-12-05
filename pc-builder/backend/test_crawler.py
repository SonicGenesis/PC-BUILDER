import asyncio
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.tests.test_data import create_test_data
from app.tests.test_crawler import test_crawler

async def main():
    # Create test data
    print("Creating test data...")
    success = create_test_data()
    if not success:
        print("Failed to create test data. Exiting.")
        return

    # Run crawler tests
    await test_crawler()

if __name__ == "__main__":
    asyncio.run(main()) 