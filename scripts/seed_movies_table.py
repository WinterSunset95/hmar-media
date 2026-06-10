import datetime
from appwrite.client import Client
from appwrite.services.tables_db import TablesDB
from appwrite.id import ID

def seed_database():
    # 1. Initialize the Appwrite Client (Run this on your dev machine with an API Key)
    client = (Client()
              .set_endpoint('https://appwrite.wintersunset95.in/v1')
              .set_project("6a25699200297850cf39")
              .set_key("standard_f1755e70e14ae6502aa5d19d3bb28c4f9ab7c9f10bab7b94c2b6aac06bf4d2f7fa71078604fbbc9a3bf8af3bf2c7f959cbbfedc4403cd3bde2fe84ae35e0d79b84af804d1994569b9f67e9951a658978ca6abb438e4711f621273b28200f052ad5140a2d217c26c32e50e35ef8c96e856ba2facdc22d321c2b48f767953ce783"))

    databases = TablesDB(client)
    db_id = '6a256ab3002cc4f2403e'
    table_id = 'movies'

    # Realistic mock catalog for Hmar Media (Local cinema focus)
    mock_movies = [
        {
            "title": "Inril",
            "description": "An intense emotional drama exploring the depth of unspoken love, family sacrifice, and cultural expectations set against the beautiful mist-shrouded hills of Northeast India.",
            "releaseDate": (datetime.datetime.now() - datetime.timedelta(days=5)).isoformat(),
            "rentPrice": 15000, # ₹150.00
            "posterId": "poster_inril", # Fallback triggers premium placeholder if file ID doesn't exist yet
            "streamId": "stream_inril_101",
            "searchKeywords": ["drama", "romance", "family", "emotional", "inril"]
        },
        {
            "title": "Zozam: The Warrior",
            "description": "An epic historical action blockbuster chronicling the legendary story of a tribal protector defending his people's ancestral valleys from external forces.",
            "releaseDate": (datetime.datetime.now() - datetime.timedelta(days=12)).isoformat(),
            "rentPrice": 20000, # ₹200.00
            "posterId": "poster_zozam",
            "streamId": "stream_zozam_202",
            "searchKeywords": ["action", "epic", "historical", "warrior", "zozam"]
        },
        {
            "title": "Lungrun",
            "description": "A heart-warming coming-of-age story of three childhood friends chasing their musical dreams through local festivals and personal trials in modern-day Churachandpur.",
            "releaseDate": (datetime.datetime.now() - datetime.timedelta(days=20)).isoformat(),
            "rentPrice": 12000, # ₹120.00
            "posterId": "poster_lungrun",
            "streamId": "stream_lungrun_303",
            "searchKeywords": ["music", "friends", "comedy", "drama", "lungrun"]
        },
        {
            "title": "Sikni Nights",
            "description": "During the cold winter festival of Sikni, a mysterious traveler arrives in the village, unraveling a decades-old suspenseful conspiracy.",
            "releaseDate": (datetime.datetime.now() - datetime.timedelta(days=45)).isoformat(),
            "rentPrice": 18000, # ₹180.00
            "posterId": "poster_sikni",
            "streamId": "stream_sikni_404",
            "searchKeywords": ["thriller", "mystery", "conspiracy", "sikni"]
        },
        {
            "title": "Ka Pa",
            "description": "A deeply moving cinematic tribute detailing the unbreakable bond between a hardworking father and his ambitious daughter fighting societal odds.",
            "releaseDate": (datetime.datetime.now() - datetime.timedelta(days=60)).isoformat(),
            "rentPrice": 9900, # ₹99.00
            "posterId": "poster_kapa",
            "streamId": "stream_kapa_505",
            "searchKeywords": ["family", "father", "drama", "tribute", "kapa"]
        },
        {
            "title": "Mizo Hills Thriller",
            "description": "An edge-of-your-seat survival thriller where a weekend camping expedition turns into a frantic race against nature and an unknown forest pursuer.",
            "releaseDate": (datetime.datetime.now() - datetime.timedelta(days=90)).isoformat(),
            "rentPrice": 15000, # ₹150.00
            "posterId": "poster_mizo",
            "streamId": "stream_mizo_606",
            "searchKeywords": ["survival", "thriller", "forest", "horror"]
        }
    ]

    print("🚀 Initiating Hmar Media Database Seeding...")

    for movie in mock_movies:
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

if __name__ == "__main__":
    seed_database()
