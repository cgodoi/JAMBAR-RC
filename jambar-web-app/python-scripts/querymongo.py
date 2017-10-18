#!/usr/bin/env python
import time
import serial
import sys
import pymongo
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:3001/')
db = client.meteor
collection = db.sectores
cursor = collection.find()
for document in cursor:
    print(document)
	
result = db.dispositivos.update_one(
    {"_id": "xCBKqdtrmi4HuqJE7"},
		{"$set": {"inDashboard": True}}
)
	