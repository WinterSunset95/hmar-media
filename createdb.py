from appwrite.client import Client
from appwrite.enums.relation_mutate import RelationMutate
from appwrite.enums.relationship_type import RelationshipType
from appwrite.services.tables_db import TablesDB

client = (Client()
          .set_endpoint('https://appwrite.wintersunset95.in/v1')
          .set_project("6a25699200297850cf39")
          .set_key("standard_f1755e70e14ae6502aa5d19d3bb28c4f9ab7c9f10bab7b94c2b6aac06bf4d2f7fa71078604fbbc9a3bf8af3bf2c7f959cbbfedc4403cd3bde2fe84ae35e0d79b84af804d1994569b9f67e9951a658978ca6abb438e4711f621273b28200f052ad5140a2d217c26c32e50e35ef8c96e856ba2facdc22d321c2b48f767953ce783"))

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
