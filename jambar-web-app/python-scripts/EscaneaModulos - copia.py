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
     
miPuertoSerial = serial.Serial("/dev/ttyAMA0", baudrate=9600, timeout=0.5)
miPuertoSerial.write('MRFESTADO\n')
numeroModulosEncontrados = 0
numeroModulosNuevos = 0
timeout_start = time.time()
timeout = 5 

def validaMensaje(mensaje):
   if ('HRF' in mensaje or 'MRF' in mensaje):
	    return 'OK';
   else:
        return 'NOK';


while (time.time() < timeout_start + timeout):
    try:
        bytesLeer = miPuertoSerial.inWaiting()
        if (bytesLeer > 0):
           dataSerial = miPuertoSerial.readline()
           if (validaMensaje(dataSerial)=='OK'):
               if ('=' in dataSerial):
			       modulo,valor = dataSerial.split('=')
			       cursor = misModulos.find({"codigo":modulo}).limit(1)
			       numeroModulosEncontrados+=1
			       if (cursor.count() == 0):
			           nuevoModulo = misModulos.insert_one({"_id":str(ObjectId()),"nombre":"*nuevoModulo","codigo":modulo,"createdAt":datetime.now()})
			           numeroModulosNuevos+=1
    except:
         print 'Ha ocurrido un error favor revisar:', sys.exc_info()[0]
         miPuertoSerial.close()
         raise
print 'Se han encontrado ', numeroModulosEncontrados, ' modulos de los cuales ', numeroModulosNuevos,  ' han sido ingresados al sistema'
miPuertoSerial.close()