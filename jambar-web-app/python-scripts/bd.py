#!/usr/bin/env python
import serial
import time
import sys
import MySQLdb as mdb
#function for storing readings into database
#def pruebaBD(str):
#log to raspberry pi mysql

while True:
	ser = serial.Serial(
	port='/dev/ttyAMA0',
	baudrate = 9600,
	parity=serial.PARITY_NONE,
	stopbits=serial.STOPBITS_ONE,
	bytesize=serial.EIGHTBITS,
	timeout=1
	)
	txtlog = ser.readline()
	if len(txtlog) > 0:
		print(txtlog)
		con = mdb.connect('127.0.0.1', 'root', 'pipass', 'bd_autocasa');
		cursor = con.cursor()
		sql = "INSERT INTO log(texto) VALUES (%s)" 
		cursor.execute(sql,txtlog)
		cursor.close()
		con.commit()
		con.close()
	time.sleep(1)