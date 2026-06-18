import os
import json
import requests
from dotenv import load_dotenv
import datetime
from appwrite.client import Client
from appwrite.services.tables_db import TablesDB
from appwrite.id import ID

load_dotenv()

api_key = os.getenv("JELLYFIN_KEY")
appwrite_api = os.getenv("KEY")

URL_BASE = "http://blackarch:8096"
API = f"api_key={api_key}"

users = requests.get(f"{URL_BASE}/Users?{API}")

user_id = None

if users.status_code == 200:
    users_arr = users.json()
    for user in users_arr:
        if user["Name"] == "wally":
            user_id = user["Id"]
else:
    print("Users not available")

if user_id is None:
    exit()

items = requests.get(f"{URL_BASE}/Users/{user_id}/Items?{API}")
item_id = None
if items.status_code == 200:
    items_arr = items.json()["Items"]
    for item in items_arr:
        if item["Name"] == "Movies":
            item_id = item["Id"]
else:
    print("Failure while getting items")

movies = requests.get(f"{URL_BASE}/Items?{API}&parentId={item_id}")
# test_movie = movies.json()['Items'][0]
# test = requests.get(f"{URL_BASE}/Users/{user_id}/Items/{test_movie['Id']}?{API}")
# images_res = requests.get(f"{URL_BASE}/Items/{test_movie['Id']}/Images/Primary?{API}")
# images_res.status_code
# images_res.json()
# test.json()
movies_list = []
path = f"{URL_BASE}/config/metadata/library/13/13e1aa32d7da7f4511f16f56554ca595/poster.jpg"
for movie in movies.json()['Items']:
    movie_data = requests.get(f"{URL_BASE}/Users/{user_id}/Items/{movie['Id']}?{API}")
    movie_info = movie_data.json()
    stream_res = requests.get(f"{URL_BASE}/Items/{movie['Id']}/PlaybackInfo?{API}")
    print(json.dumps(stream_res.json(), indent=1))
    movie_item = {
        "title": movie_info['Name'] if movie_info['Name'] else "Unavailable",
        "description": movie_info['Overview'] if movie_info['Overview'] else "Unavailable",
        "releaseDate": movie_info['DateCreated'] if movie_info['Overview'] else "Unavailable",
        "rentPrice": 15000, # ₹150.00
        "posterId": movie_info['Id'] if movie_info['Id'] else "Unavailable", # Fallback triggers premium placeholder if file ID doesn't exist yet
        "streamId": movie_info['Id'] if movie_info['Id'] else "Unavailable",
        "searchKeywords": movie_info['Tags'] if movie_info['Tags'] else [],
    }
    movies_list.append(movie_item)

def seed_database():
    # 1. Initialize the Appwrite Client (Run this on your dev machine with an API Key)
    client = (Client()
              .set_endpoint('https://appwrite.wintersunset95.in/v1')
              .set_project("6a25699200297850cf39")
              .set_key(appwrite_api))

    databases = TablesDB(client)
    db_id = '6a256ab3002cc4f2403e'
    table_id = 'movies'

    print("🚀 Initiating Hmar Media Database Seeding...")

    for movie in movies_list:
        try:
            # We use modern Appwrite 1.9.0+ Table-SDK parameters
            # result = databases.create_document(
            #     database_id=db_id,
            #     table_id=table_id,
            #     document_id=ID.unique(),
            #     data=movie
            # )
            result = databases.create_row(
                database_id=db_id,
                table_id=table_id,
                data=movie,
                row_id=ID.unique()
            )
            print(f"✅ Successfully seeded: '{movie['title']}' (Document ID: {result['$id']})")
        except Exception as e:
            print(f"❌ Failed to seed '{movie['title']}': {str(e)}")

    print("\n🎉 Seeding operations completed!")

seed_database()
