from sqlalchemy.orm import Session
from app.database.config import SessionLocal, Base, engine
from app.models.models import Category, Component
from app.services.services import CategoryService, ComponentService

def create_test_data():
    # Create all tables first
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if data already exists
        existing_categories = db.query(Category).all()
        if existing_categories:
            print("Test data already exists!")
            return True

        print("Creating categories...")
        categories = [
            Category(name="CPU", description="Processors"),
            Category(name="GPU", description="Graphics Cards"),
            Category(name="RAM", description="Memory"),
            Category(name="Storage", description="Storage Devices")
        ]
        db.add_all(categories)
        db.commit()

        print("Creating components...")
        components = [
            # CPUs
            Component(
                name="AMD Ryzen 7 5800X",
                category_id=1,
                specifications={
                    "cores": 8,
                    "threads": 16,
                    "base_clock": "3.8GHz",
                    "boost_clock": "4.7GHz"
                },
                price=299.99,
                manufacturer="AMD"
            ),
            Component(
                name="Intel Core i9-12900K",
                category_id=1,
                specifications={
                    "cores": 16,
                    "threads": 24,
                    "base_clock": "3.2GHz",
                    "boost_clock": "5.2GHz"
                },
                price=589.99,
                manufacturer="Intel"
            ),
            # GPUs
            Component(
                name="NVIDIA RTX 4080",
                category_id=2,
                specifications={
                    "memory": "16GB GDDR6X",
                    "cuda_cores": 9728,
                    "boost_clock": "2.51GHz"
                },
                price=1199.99,
                manufacturer="NVIDIA"
            ),
            Component(
                name="AMD Radeon RX 6800 XT",
                category_id=2,
                specifications={
                    "memory": "16GB GDDR6",
                    "stream_processors": 4608,
                    "boost_clock": "2.25GHz"
                },
                price=649.99,
                manufacturer="AMD"
            ),
            # RAM
            Component(
                name="Corsair Vengeance RGB Pro 32GB",
                category_id=3,
                specifications={
                    "capacity": "32GB",
                    "speed": "3600MHz",
                    "latency": "CL18"
                },
                price=129.99,
                manufacturer="Corsair"
            ),
            # Storage
            Component(
                name="Samsung 970 EVO Plus 1TB",
                category_id=4,
                specifications={
                    "capacity": "1TB",
                    "interface": "NVMe PCIe 3.0",
                    "read_speed": "3500MB/s",
                    "write_speed": "3300MB/s"
                },
                price=99.99,
                manufacturer="Samsung"
            )
        ]
        db.add_all(components)
        db.commit()
        
        print("Test data created successfully!")
        return True
    except Exception as e:
        print(f"Error creating test data: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    create_test_data() 