from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from sqlalchemy.orm import Session
from .crawler import CrawlerService
from ..database.config import SessionLocal
import asyncio
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CrawlerScheduler:
    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        self.crawler_service = CrawlerService()

    def start(self):
        """
        Start the scheduler with predefined jobs.
        """
        # Schedule price updates every 15 minutes
        self.scheduler.add_job(
            self._update_all_prices,
            IntervalTrigger(minutes=15),
            id="price_update_15min",
            name="Update all component prices every 15 minutes",
            replace_existing=True
        )

        logger.info("Starting price update scheduler (15-minute intervals)")
        self.scheduler.start()

    async def _update_all_prices(self):
        """
        Update prices for all components.
        """
        try:
            logger.info("Starting scheduled price update...")
            db = SessionLocal()
            
            try:
                # Get current time for logging
                from datetime import datetime
                current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                logger.info(f"Price update started at: {current_time}")

                # Crawl prices for all components
                results = await self.crawler_service.crawl_prices(db, debug=True)
                
                # Log results
                successful_updates = len([r for r in results if "price" in r])
                failed_updates = len([r for r in results if "error" in r])
                
                logger.info(f"Price update completed:")
                logger.info(f"✅ Successful updates: {successful_updates}")
                logger.info(f"❌ Failed updates: {failed_updates}")
                
                # Log individual results
                for result in results:
                    if "error" in result:
                        logger.warning(f"Failed to update {result['component_name']}: {result['error']}")
                    else:
                        logger.info(f"Updated {result['component_name']}: ₹{result['price']} from {result['site']}")

            except Exception as e:
                logger.error(f"Error during price update: {str(e)}")
                raise
            finally:
                db.close()

        except Exception as e:
            logger.error(f"Critical error in price update job: {str(e)}")

    def add_custom_job(self, func, trigger):
        """
        Add a custom scheduled job.
        """
        self.scheduler.add_job(func, trigger)

    def remove_job(self, job_id):
        """
        Remove a scheduled job by ID.
        """
        self.scheduler.remove_job(job_id)

    def get_jobs(self):
        """
        Get all scheduled jobs.
        """
        return self.scheduler.get_jobs()

    def shutdown(self):
        """
        Shutdown the scheduler.
        """
        logger.info("Shutting down price update scheduler...")
        self.scheduler.shutdown() 