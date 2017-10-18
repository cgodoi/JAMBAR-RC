#!/usr/bin/env python
import serial
import time
import sys
import MySQLdb as mdb


#function returns start of sensor_id and start of measurement
def parseMeasurements(mjerenje):
    pok_id = []
    pok_measure = []
    i = 0

    for znak in mjerenje:

        if (znak == '#'):
            pok_id.append(i)

        if (znak == 'M'):
            pok_measure.append(i)

        i = i + 1
    return (pok_id, pok_measure)


#function to make sure there in no errors during serial transmission
def calc_crc8(polje_podataka,number_of_bytes):
  i = 0
  temp1 = 0
  bit_counter = 0
  feedback_bit = 0
  crc8_result=0
  
  while (number_of_bytes > 0):
    temp1= ord(polje_podataka[i])
    i = i + 1
    
    for bit_counter in range(0, 8):
      feedback_bit = (crc8_result & 0x01)
      crc8_result = crc8_result >> 1
      
      if ( feedback_bit ^ (temp1 & 0x01) ):
        crc8_result = crc8_result ^ 0x8c
        
      temp1 = temp1 >> 1
    
    number_of_bytes = number_of_bytes - 1
  
  return crc8_result

#function for storing readings into database
def insertDB(polje):
  
  (pok_id, pok_measure) = parseMeasurements(polje)
  number_of_meas = len(pok_id);
  
  #log to raspberry pi mysql
  try:
    con = mdb.connect('localhost', 'root', 'pipass', 'bd_autocasa');
    cursor = con.cursor()
    for i in range(0,number_of_meas-1):
      sql = "INSERT INTO log(texto) VALUES ('nowei po' )" 
              
      cursor.execute(sql)
      sql = []
      con.commit()
      con.close()
	
  except mdb.Error, e:  
    print "Date: %s Time: %s  Error while logging to MySQL %d: %s" % (time.strftime("%Y-%m-%d"),time.strftime("%H:%M"),e.args[0],e.args[1])

	#function for storing readings into database
def pruebaBD():
  
  #log to raspberry pi mysql
  try:
    con = mdb.connect('localhost', 'root', 'pipass', 'bd_autocasa');
    cursor = con.cursor()
    sql = "INSERT INTO log(texto) VALUES ('nowei po' )" 
    cursor.execute(sql)
    sql = []
    con.commit()
    con.close()
	
  except mdb.Error, e:  
    print "Date: %s Time: %s  Error while logging to MySQL %d: %s" % (time.strftime("%Y-%m-%d"),time.strftime("%H:%M"),e.args[0],e.args[1])

#function for parsing packet
def parsePacket(data):
  #this flag tells us if we are inside packet
  flagInside = 0

  #how many bytes we have received
  counterbytes = 0

  #crc result
  rez = 1

  mjerenje = []

  for znak in data:
    
    if ord(znak) == 0x01:
      flagInside = 1
      mjerenje = []
      rez = 1
      counterbytes = 0
      continue

    if flagInside == 1 and ord(znak) != 0x04:
      counterbytes = counterbytes + 1
      mjerenje.append(znak)
      continue

    if ord(znak) == 0x04:
      flagInside = 0
      rez = calc_crc8(mjerenje,counterbytes)
      if rez == 0:
        return (rez, mjerenje)

  return (1, [])


#main program
try:
  pruebaBD;
  ser = serial.Serial('/dev/ttyAMA0',9600,timeout=1)

except Exception, e:
  print "Date: %s Time: %s  Error opening serial port: " % (time.strftime("%Y-%m-%d"),time.strftime("%H:%M")) + str(e)
  sys.exit(1)

ser.flushInput()
ser.flushOutput()

#this will store the measurement
paket = []

#this is crc result
crcrez = 1

#number of attempts
attempts = 5

#measurement to insert in DB
measurement = []

while attempts > 0:
  
  ser.flushInput()
  ser.flushOutput()
  attempts = attempts - 1
  measurement = []
  crcrez = 1
  ser.write('P')
  paket = ser.readline()

  if len(paket) > 1:
    #parse packet
    (crcrez, measurement) = parsePacket(paket)
    
  if crcrez == 0 and len(measurement)>0:  #received data are ok
    measurement.pop()  			#remove crc
    insertDB(measurement)		#split the data into measurements and store to database
    break
	
  time.sleep(10)
  
if attempts == 0:
  print "Date: %s Time: %s  Error reading data, maximal number of attempts reached" % (time.strftime("%Y-%m-%d"),time.strftime("%H:%M"))

ser.flushInput()
ser.flushOutput()
ser.close()
del serial
