import os

from appwrite.client import Client
from appwrite.enums.relation_mutate import RelationMutate
from appwrite.enums.relationship_type import RelationshipType
from appwrite.services.tables_db import TablesDB
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("KEY")

client = (Client()
          .set_endpoint('https://appwrite.wintersunset95.in/v1')
          .set_project("6a25699200297850cf39")
          .set_key(api_key))

tablesDb = TablesDB(client)

tablesDb.list_tables('6a256ab3002cc4f2403e')


tablesDb.create_relationship_column(
    database_id='6a256ab3002cc4f2403e',
    table_id='interactions',
    related_table_id='movies',
    type=RelationshipType.MANYTOONE,
    two_way=True,
    key='movie',
    two_way_key='interactions',
    on_delete=RelationMutate.CASCADE
)

db_id = '6a256ab3002cc4f2403e'
table_interactions = 'interactions'

# 1. userId (String, 255 chars, Required)
tablesDb.create_text_column(
    database_id=db_id,
    table_id=table_interactions,
    key='userId',
    required=True
)

# 2. type (String, 50 chars, Required - for 'like', 'wishlist', 'watch_progress')
tablesDb.create_text_column(
    database_id=db_id,
    table_id=table_interactions,
    key='type',
    required=True
)

# 3. timestamp (Datetime, Required)
tablesDb.create_text_column(
    database_id=db_id,
    table_id=table_interactions,
    key='timestamp',
    required=True
)

# 4. progressSeconds (Integer, Optional - only used for watch_progress tracking)
tablesDb.create_integer_column(
    database_id=db_id,
    table_id=table_interactions,
    key='progressSeconds',
    required=False
)

# Create columns for the 'rentals' table
table_rentals = 'rentals'

# 1. userId (String, 255 chars, Required)
tablesDb.create_text_column(
    database_id=db_id,
    table_id=table_rentals,
    key='userId',
    required=True
)

# 2. rentedAt (Datetime, Required)
tablesDb.create_datetime_column(
    database_id=db_id,
    table_id=table_rentals,
    key='rentedAt',
    required=True
)

# 3. expiresAt (Datetime, Required)
tablesDb.create_datetime_column(
    database_id=db_id,
    table_id=table_rentals,
    key='expiresAt',
    required=True
)

# 4. paymentReference (String, 255 chars, Optional - references gateway transaction IDs)
tablesDb.create_text_column(
    database_id=db_id,
    table_id=table_rentals,
    key='paymentReference',
    required=False
)

# 5. movie (Relationship, Many-to-One, Restrict Delete)
tablesDb.create_relationship_column(
    database_id=db_id,
    table_id=table_rentals,
    related_table_id='movies',
    type=RelationshipType.MANYTOONE,
    two_way=True,
    key='movie',
    two_way_key='rentals',
    on_delete=RelationMutate.RESTRICT# Prevents accidental movie deletion if users have paid rentals
)
