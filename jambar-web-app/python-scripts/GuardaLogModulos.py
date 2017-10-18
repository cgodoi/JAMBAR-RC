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
miModuloLog = miDbMeteor.moduloLogs
     
miPuertoSerial = serial.Serial("/dev/ttyAMA0", baudrate=9600, timeout=0.5)
while (True):
    try:
        bytesLeer = miPuertoSerial.inWaiting()
        if (bytesLeer > 0):
           dataSerial = miPuertoSerial.readline()
           if ('HRF' in dataSerial or 'MRF' in dataSerial):
               if ('=' in dataSerial):
			       modulo,valor = dataSerial.split('=')
			       nuevoModulo = miModuloLog.insert_one({"_id":str(ObjectId()),"idModulo":modulo,"valor":valor,"fecha":datetime.now()})
    except (KeyboardInterrupt, SystemExit):
         raise
    except:
         print 'Ha ocurrido un error favor revisar:', sys.exc_info()[0]
         pass