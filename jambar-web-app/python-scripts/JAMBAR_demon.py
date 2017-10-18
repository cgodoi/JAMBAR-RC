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
misModulos = miDbMeteor.modulos
miModuloEstado = miDbMeteor.moduloEstado
buffer = ''
origenModulo = 'interno'

miPuertoSerial = serial.Serial("/dev/ttyAMA0", baudrate=9600, timeout=1)


def validaMensaje(mensaje):
    try:
        if ('HRF' in mensaje or 'MRF' in mensaje):
            print 'OK'
            return 'OK';
        else:
            print 'NOK'
            return 'NOK';
    except (KeyboardInterrupt, SystemExit):
        raise
    except Exception as ex:
        print "Unexpected error in validaMensaje check if logic:" + str(ex);



def creaNuevoModulo(mensaje):
    try:
        modulo, valor = mensaje.split('=')
        cursorCodigo = misModulos.find({"codigo": modulo}).limit(1)
        cursorCodigoOrigen = misModulos.find({"codigoOrigen": modulo}).limit(1)
        if (cursorCodigoOrigen.count() == 0 and cursorCodigo.count() == 0):
            nuevoModulo = misModulos.insert_one({"_id": str(ObjectId()), "alias": "*aliasModulo", "codigo": modulo, "createdAt": datetime.now()})

    except (KeyboardInterrupt, SystemExit):
        raise            
    except Exception as ex:
        print "Unexpected error in creaNuevoModulo, please check:" + str(ex);



def registraEventoBD(mensaje):
    try:
        modulo, valor = mensaje.split('=')
        valor2 = valor.split()[0]
        cursor = misModulos.find({"codigoOrigen": modulo}).limit(1)
        if (cursor.count() == 0):
            cursor = misModulos.find({"codigo": modulo}).limit(1)

        for miModulo in cursor:
            print "insertando estado"
            moduloEstado = miModuloEstado.update_one({"moduloID": miModulo['_id']}, {"$set":{"origen": origenModulo, "valor": valor2, "fechaOrigen": datetime.now(), "ejecutado": "S", "fechaEjecuta": datetime.now(), "mensaje":mensaje}},upsert=True)
            print "insertando log evento"
            nuevoModulo = miModuloLog.insert_one({"_id": str(ObjectId()), "origen": origenModulo, "moduloID": miModulo['_id'],"valor": valor2, "fechaOrigen": datetime.now(), "ejecutado": "S", "fechaEjecuta": datetime.now(), "mensaje":mensaje})
        return;

    except (KeyboardInterrupt, SystemExit):
        raise    
    except Exception as ex:
        print "Unexpected error in registraEventoBD: " + str(ex);



def enviaMensajeRFModulos(mensaje):
    try:
        mensaje = mensaje + '\n'
        mensaje = mensaje[:0] + 'M' + mensaje[1:]
        #print(mensaje)
        miPuertoSerial.write(mensaje)
        return;

    except (KeyboardInterrupt, SystemExit):
        raise    
    except Exception as ex:
        print "Unexpected error in enviaMensajeRFModulos check RF serial conection, please check:" + str(ex);



def consultaEventosPendientesEnvio():
    try:
         cursor = miModuloLog.find({"ejecutado": "P"}).sort('fechaOrigen', pymongo.ASCENDING).limit(1)
         for miEvento in cursor:
             mensaje = miEvento['mensaje']
             enviaMensajeRFModulos(mensaje)
             #anula mensajes anteriores (ultimos: No)
             #miModuloLog.update({"moduloID": miEvento['moduloID']}, {"$set": {"ultimo": "N"}},{"multi":true})
             #miModuloEstado.update({'moduloID':miEvento['moduloID']},{'$set':{'Type': "Most important"}},upsert = True)
             #miModuloEstado.update({}, { "$unset": { "assignments": 1 } }, upsert=False, multi=True)
             print "insertando estado"
             moduloEstado = miModuloEstado.update_one({"moduloID": miEvento['moduloID']}, {"$set":{"origen": miEvento['origen'], "valor": miEvento['valor'], "fechaOrigen": miEvento['fechaOrigen'], "ejecutado": "S", "fechaEjecuta": datetime.now(), "mensaje":miEvento['mensaje']}},upsert=True)

             print "actualizando log"
             miModuloLog.update({"_id": miEvento['_id']}, {"$set": {"ejecutado": "S", "fechaEjecuta": datetime.now()}})

    except (KeyboardInterrupt, SystemExit):
        raise             
    except Exception as ex:
        print "Unexpected error in consultaEventosPendientesEnvio check mongodb instance" + str(ex);


while (True):
    try:
        consultaEventosPendientesEnvio()
        bytesLeer = miPuertoSerial.inWaiting()
        if (bytesLeer > 0):
           buffer += miPuertoSerial.read(miPuertoSerial.inWaiting())
           print buffer;
           if '\n' in buffer:
               print buffer;
               dataSerial, buffer = buffer.split('\n')[-2:]
               if (validaMensaje(dataSerial)=='OK'):
                   if ('=' in dataSerial):
                       creaNuevoModulo(dataSerial)
                       registraEventoBD(dataSerial)
    except (KeyboardInterrupt, SystemExit):
        raise
    except:
         print 'Ha ocurrido un error favor revisar:', sys.exc_info()[0]