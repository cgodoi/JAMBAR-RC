#!/usr/bin/env python
import time
import serial
import sys
import pymongo
from bson.objectid import ObjectId   
from datetime import datetime
from pymongo import MongoClient

miClienteMongo = MongoClient('mongodb://localhost:3001/')
miDbMeteor = miClienteMongo.meteor
misModulos = miDbMeteor.modulos

try:
    miPuertoSerial = serial.Serial("/dev/ttyAMA0", baudrate=9600, timeout=0)
    miPuertoSerial.write('MRFESTADO\n')
    miPuertoSerial.close()
except:
    print "Unexpected error in EscaneaModulos check Serial coms";
#miPuertoSerial.write('MRFLED05=1\n')
#miPuertoSerial.write('MRFLED08=0\n')
#miPuertoSerial.write('MRFESTADO\n')