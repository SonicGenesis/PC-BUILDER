import asyncio
import sys
import os
from getpass import getpass

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.config import SessionLocal, Base, engine
from app.services.auth import AuthService
from app.schemas.auth import UserCreate
from app.models import auth, models  # Import models to ensure they are registered with Base
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_admin_user():
    """
    Create the initial admin user and roles.
    """
    # Create all database tables
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully!")

    db = SessionLocal()
    try:
        # Check if admin user already exists
        existing_admin = AuthService.get_user(db, username="admin")
        if existing_admin:
            logger.warning("Admin user already exists!")
            return False

        # Get admin user details
        print("\n=== Create Admin User ===")
        username = input("Enter admin username: ")
        email = input("Enter admin email: ")
        password = getpass("Enter admin password: ")
        confirm_password = getpass("Confirm admin password: ")

        if password != confirm_password:
            logger.error("Passwords do not match!")
            return False

        # Create admin user
        try:
            user = UserCreate(
                username=username,
                email=email,
                password=password,
                full_name="System Administrator"
            )
            admin_user = AuthService.create_user(db, user, is_superuser=True)
            logger.info(f"Admin user '{username}' created successfully!")

            # Create default roles
            roles = [
                ("admin", "Full system access", ["admin"]),
                ("editor", "Can edit components and prices", ["edit_components", "view_analytics"]),
                ("viewer", "Can view components and prices", ["view_components"])
            ]

            for role_name, description, permissions in roles:
                role = AuthService.create_role(db, role_name, description, permissions)
                if role_name == "admin":
                    AuthService.assign_role_to_user(db, admin_user, role)
                logger.info(f"Role '{role_name}' created successfully!")

            return True

        except Exception as e:
            logger.error(f"Error creating admin user: {str(e)}")
            return False

    finally:
        db.close()

if __name__ == "__main__":
    print("This script will create an admin user and default roles.")
    print("Warning: This should only be run once on initial setup!")
    
    proceed = input("\nDo you want to continue? (y/N): ")
    if proceed.lower() != 'y':
        print("Aborted.")
        sys.exit(0)
    
    if create_admin_user():
        print("\nSetup completed successfully!")
        print("You can now log in using the admin credentials.")
    else:
        print("\nSetup failed. Please check the error messages above.") 