#!/usr/bin/env python
import serial
import time
import sys
#function for storing readings into database
#def pruebaBD(str):
#log to raspberry pi mysql

ser = serial.Serial(
port='/dev/ttyAMA0',
baudrate = 9600, 
parity=serial.PARITY_NONE, 
stopbits=serial.STOPBITS_ONE, 
bytesize=serial.EIGHTBITS, 
timeout=1
)
while 1:
        if (ser.inWaiting() > 0):
                serdata = ser.readline()
                print serdata