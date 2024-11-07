#!/usr/bin/env python3

# %%
# ADC Handler
# ===========
# This script is responsible for handling the ADC for Sernsor inference

# => Before running the script, please enable I2c interface from raspi-config

# %%
# Importing Libraries
from board import SCL, SDA
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
from gpiozero import LED
from time import sleep
import numpy as np
from scipy.signal import butter, lfilter
import subprocess
import requests
import socketio
import oledlib

oledisp = oledlib.oled()

# %%
# ADC Tools
class sensorADC:
    def __init__(self, pinList):
        """
        This class initializes the ADC process

        Arguments
        =========
        pinList: List of GPIO Pins for LEDs
        cutoff : Cutoff frequency for highpass filter
        smapleRate : Sample Rate for the data acquisition
        filerOrder : Filter Order for highpass filter
        filterWindow : Window size for highpass filter
        """
        super(sensorADC, self).__init__()
        self.dispImageAddr = "/root/logoBitmap.png"
        self.currentDeviceID = ""
        self.pinList = pinList
        self.sio = socketio.SimpleClient()
        self.adcAddr = 48
        self.i2c = busio.I2C(SCL, SDA)
        self.ads = ADS.ADS1115(self.i2c)
        self.a0 = AnalogIn(self.ads, ADS.P0) # ( Wavelength : 400nm - 1000nm )
        self.a1 = AnalogIn(self.ads, ADS.P1) # ( Wavelength : 950nm - 1700nm )

        self.ledPool = {
            "led0": {"instance": LED(self.pinList[0]), "wavelength": "1550nmch1"},
            "led1": {"instance": LED(self.pinList[1]), "wavelength": "870nmch1"},
            "led2": {"instance": LED(self.pinList[2]), "wavelength": "1200nmch1"},
            "led3": {"instance": LED(self.pinList[3]), "wavelength": "660nmch1"},
            "led4": {"instance": LED(self.pinList[4]), "wavelength": "1550nmch2"},
            "led5": {"instance": LED(self.pinList[5]), "wavelength": "870nmch2"},
            "led6": {"instance": LED(self.pinList[6]), "wavelength": "1200nmch2"},
            "led7": {"instance": LED(self.pinList[7]), "wavelength": "660nmch2"},
            "led8": {"instance": LED(self.pinList[8]), "wavelength": "1550nmch3"},
            "led9": {"instance": LED(self.pinList[9]), "wavelength": "870nmch3"},
            "led10": {"instance": LED(self.pinList[10]), "wavelength": "1200nmch3"},
            "led11": {"instance": LED(self.pinList[11]), "wavelength": "660nmch3"},
            "led12": {"instance": LED(self.pinList[12]), "wavelength": "660nmch4"},
            "led13": {"instance": LED(self.pinList[13]), "wavelength": "1200nmch4"},
            "led14": {"instance": LED(self.pinList[14]), "wavelength": "870nmch4"},
            "led15": {"instance": LED(self.pinList[15]), "wavelength": "1550nmch4"}
        }
        self.seconds2CheckConnectivity = 60

    def __checkSystemHealth__(self):
        """
        This function checks for system health
        """
        print("[ Update Daemon ] : Checking System Health")
        nginxService = subprocess.run("systemctl is-active nginx.service", shell=True, text=True, capture_output=True)
        fnirsService = subprocess.run("systemctl is-active fnirsNetwork.service", shell=True, text=True, capture_output=True)
        if ((nginxService.stdout.replace("\"", "").replace("\n", "")=="active") and (fnirsService.stdout.replace("\"", "").replace("\n", "")=="active")):
            return True
        else:
            return False

    def __checkSystemConnectivity__(self):
        """
        This function checks for system connectivity with server
        """
        portalAddress = requests.get("http://0.0.0.0:5003/api/network/portaladdress").text.replace("\"", "").replace("\n", "")
        serverCheck = requests.get(f"http://0.0.0.0:5003/api/network/servercheck?server={portalAddress}").text.replace("\"", "").replace("\n", "")
        self.currentDeviceID = requests.get(f"http://0.0.0.0:5003/api/device/id").text.replace("\"", "").replace("\n", "")
        if serverCheck=="true":
            return portalAddress, True
        else:
            return portalAddress, False

    def __process__(self):
        """
        This methood executes the ADC process for the LEDs, find concentrations and TSIs. After the process, it transmits data to the portal
        """
        currentData = {
            "deviceID": self.currentDeviceID,
            "values": dict(),
            "voltages": dict()
        }
        for l in list(self.ledPool.keys()):
            self.ledPool[l]["instance"].on()
            # sleep(0.1)
            if self.ledPool[l]["wavelength"].split("nmch")[0] in ["870", "660"]:
                currentData["values"][self.ledPool[l]["wavelength"]] = self.a0.value
                currentData["voltages"][self.ledPool[l]["wavelength"]] = self.a0.voltage
            else:
                currentData["values"][self.ledPool[l]["wavelength"]] = self.a1.value
                currentData["voltages"][self.ledPool[l]["wavelength"]] = self.a1.voltage
            self.ledPool[l]["instance"].off()

        self.sio.emit('serverRAW', currentData)

    def __call__(self):
        """
        This method checks for system connectivity validation and executes ADC process accordingly
        """
        currentConnectivity = False
        if self.__checkSystemHealth__():
            portal, portalCheck = self.__checkSystemConnectivity__()
            if portalCheck:
                currentConnectivity = True
                print(f"[ ADC Handler ] : Server Available @ {portal}")
                oledisp.upstreamCheck(portal)
                self.sio.connect('https://' + portal)
                self.sio.emit('serverDevID', self.currentDeviceID)
                sleep(0.0000001)
            else:
                currentConnectivity = False
                print(f"[ ADC Handler ] : PING Error @ {portal}")
                oledisp.pingError()
        while True:
            if currentConnectivity:
                try:
                    self.__process__()
                except Exception as error:
                    print("[ ADC Handler ] : Error Occured while Processing")
                    self.sio.disconnect()
                    oledisp.throwError("ADC", type(error).__name__)
                    sleep(5)
                    currentConnectivity = False
            else:
                sleep(self.seconds2CheckConnectivity)
                if self.__checkSystemHealth__():
                    portal, portalCheck = self.__checkSystemConnectivity__()
                    if portalCheck:
                        currentConnectivity = True
                        print("f[ ADC Hadnler ] : Server Available @ {portal}")
                        oledisp.upstreamCheck(portal)
                        self.sio.connect(portal)
                    else:
                        currentConnectivity = False
                        print(f"[ ADC Handler ] : PING Error @ {portal}")
                        oledisp.pingError()


# Execution
if __name__=="__main__":
    adcTest = sensorADC([
        "GPIO4", "GPIO17", "GPIO27", "GPIO22",
        "GPIO10", "GPIO9", "GPIO11", "GPIO5",
        "GPIO6", "GPIO13", "GPIO19", "GPIO26",
        "GPIO12", "GPIO16", "GPIO20", "GPIO21"
    ])
    adcTest()
    