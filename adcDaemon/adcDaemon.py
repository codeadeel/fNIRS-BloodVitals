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
class singleFnirsLED:
    def __init__(self, ledNum, wavelength, bits4Pins, dataPins, cutOff=0.1, sampleRate=100, filterOrder=1, filterWindow=100):
        """
        This class use to manage single LED of the system, in accordance to operate ATmega328P-DMUX

        Arguments
        =========
        ledNum : LED number by which to be identified
        wavelength : Wavelength of the subject LED
        bits4Pins : 4 Pins of RaspberryPi tp be used as input bits to ATmega328P-DMUX   format => {"bit1": BitPin#1, "bit2": BitPin#2, "bit3": BitPin#3, "bit4": BitPin#4}
        dataPins : List of Analog Pins to read data from    format => {"a0": AnalogPin#1, "a1": AnalogPin#2}
        cutOff : CutOff frequency for the high pass filter ( default : 0.1 )
        sampleRate : Sample rate of data acquisition ( default : 100 )
        filterOrder : Filter order to apply on ButterWorth Filter ( default : 1 )
        filterWindow : Window size for application of highpass filter ( default : 100 )
        """
        self.ledNumber = ledNum
        self.wavelength = wavelength
        self.bitLeds = bits4Pins
        self.dataPins = dataPins
        self.cutOffFrequency = cutOff
        self.sampleRate = sampleRate
        self.filterOrder = filterOrder
        self.filterWindow = filterWindow
        # self.ledActiveTime = 1 / self.sampleRate
        self.ledActiveTime = 0
        self.nyquistFreq = 0.5 * self.sampleRate
        self.normCutOff = self.cutOffFrequency / self.nyquistFreq
        self.filterCoeff1, self.filterCoeff2 = butter(self.filterOrder, self.normCutOff, btype="highpass")
        self.prevDataAvailable = False
        self.currData = dict()
        self.prevData = dict()
        self.concentrationAvailable = False

        self.bitsConverter = {
            0: [0, 0, 0, 0],
            1: [0, 0, 0, 1],
            2: [0, 0, 1, 0],
            3: [0, 0, 1, 1],
            4: [0, 1, 0, 0],
            5: [0, 1, 0, 1],
            6: [0, 1, 1, 0],
            7: [0, 1, 1, 1],
            8: [1, 0, 0, 0],
            9: [1, 0, 0, 1],
            10: [1, 0, 1, 0],
            11: [1, 0, 1, 1],
            12: [1, 1, 0, 0],
            13: [1, 1, 0, 1],
            14: [1, 1, 1, 0],
            15: [1, 1, 1, 1]
        }
        if ((self.ledNumber < 0) and (self.lenNumber > len(list(self.bitConverter.keys())))):
            raise Exception("[ LED ] : PIN Number Mismatch with Bits")
        self.currentLEDBits = self.bitsConverter[self.ledNumber]
    
    def __setDelC__(self, aPin, delCVal):
        """
        This method process concentration values

        Arguments
        =========
        aPin : Analog PIN Name for which data needs to process
        delCVal : Current concentration value after deltaA multiplication with absorption coefficients
        """
        self.concentrationAvailable = True
        self.currData[aPin]["delC"] = float(delCVal)
        self.prevData[aPin]["filterWindowProcess"].append(float(delCVal))
        del self.prevData[aPin]["filterWindowProcess"][0]
        self.currData[aPin]["filterWindowProcess"] = self.prevData[aPin]["filterWindowProcess"].copy()
        localFilterApply = lfilter(self.filterCoeff2, self.filterCoeff1, self.currData[aPin]["filterWindowProcess"].copy())
        self.currData[aPin]["avgFilterWindowProcess"] = float(np.sum(localFilterApply) / len(localFilterApply))
        self.currData[aPin]["highPass"] = float(localFilterApply[-1])
        if self.currData[aPin]["highPass"] > self.currData[aPin]["avgFilterWindowProcess"]:
            self.currData[aPin]["allowTSI"] = 1
        else:
            self.currData[aPin]["allowTSI"] = 0
        self.prevData = self.currData.copy()
    
    def __getData__(self):
        """
        This method is used to blink the LED and get data from the analog PIN

        Output
        ======
        Current Reading of the LED by blinking
        """
        valList = dict()
        for led, val in zip(list(self.bitLeds.keys()), self.currentLEDBits):
            if val==1:
                self.bitLeds[led].on()
            else:
                self.bitLeds[led].off()
        sleep(self.ledActiveTime)
        for k in list(self.dataPins.keys()):
            valList[k] = {
                "value": self.dataPins[k].value,
                "voltage": self.dataPins[k].voltage,
                "delta": 0,
                "delC": 0,
                "filterWindowProcess": [0] * self.filterWindow,
                "avgFilterWindowProcess": 0,
                "highPass": 0,
                "allowTSI": 0
            }
        return valList

    def __call__(self):
        """
        This method captures the data after blink process and finds the delta value
        """
        self.currData = self.__getData__()
        if self.prevDataAvailable:
            for currKey in list(self.currData.keys()):
                self.currData[currKey]["delta"] = self.currData[currKey]["value"] - self.prevData[currKey]["value"]
        else:
            self.prevDataAvailable = True
            self.prevData = self.currData.copy()

class sensorADC:
    def __init__(self, bit1Pin, bit2Pin, bit3Pin, bit4Pin, cutoff=0.1, sampleRate=1600, filterOrder=1, filterWindow=100):
        """
        This class initializes the ADC process

        Arguments
        =========
        bit1Pin : LED pin for bit # 1
        bit2Pin : LED pin for bit # 2
        bit3Pin : LED pin for bit # 3
        bit4Pin : LED pin for bit # 4
        cutoff : Cutoff frequency for highpass filter
        smapleRate : Sample Rate for the data acquisition
        filerOrder : Filter Order for highpass filter
        filterWindow : Window size for highpass filter
        """
        super(sensorADC, self).__init__()
        self.dispImageAddr = "/root/logoBitmap.png"
        self.currentDeviceID = ""
        self.sio = socketio.SimpleClient()
        self.filterWindow = filterWindow
        self.adcAddr = 48
        self.i2c = busio.I2C(SCL, SDA)
        self.ads = ADS.ADS1115(self.i2c)
        self.a0 = AnalogIn(self.ads, ADS.P0) # ( Wavelength : 400nm - 1000nm )
        self.a1 = AnalogIn(self.ads, ADS.P1) # ( Wavelength : 950nm - 1700nm )
        self.bitLeds = {
            "bit1": LED(bit1Pin),
            "bit2": LED(bit2Pin),
            "bit3": LED(bit3Pin),
            "bit4": LED(bit4Pin)
        }
        self.seconds2CheckConnectivity = 60
        self.coeffMat = np.linalg.inv(np.array([
            [691.32, 2.9296],
            [693.44, 22.22]
        ]))

        self.ledPool = [
            singleFnirsLED(0, "940nm", self.bitLeds, {"a0": self.a0}, cutoff, sampleRate, filterOrder, filterWindow),
            singleFnirsLED(1, "870nm", self.bitLeds, {"a0": self.a0}, cutoff, sampleRate, filterOrder, filterWindow),
            singleFnirsLED(2, "1200nm", self.bitLeds, {"a1": self.a1}, cutoff, sampleRate, filterOrder, filterWindow),
            singleFnirsLED(3, "1550nm", self.bitLeds, {"a1": self.a1}, cutoff, sampleRate, filterOrder, filterWindow),
            singleFnirsLED(4, "940nm", self.bitLeds, {"a0": self.a0}, cutoff, sampleRate, filterOrder, filterWindow),
            singleFnirsLED(5, "870nm", self.bitLeds, {"a0": self.a0}, cutoff, sampleRate, filterOrder, filterWindow),
            singleFnirsLED(6, "1200nm", self.bitLeds, {"a1": self.a1}, cutoff, sampleRate, filterOrder, filterWindow),
            singleFnirsLED(7, "1550nm", self.bitLeds, {"a1": self.a1}, cutoff, sampleRate, filterOrder, filterWindow),
            singleFnirsLED(8, "940nm", self.bitLeds, {"a0": self.a0}, cutoff, sampleRate, filterOrder, filterWindow),
            singleFnirsLED(9, "870nm", self.bitLeds, {"a0": self.a0}, cutoff, sampleRate, filterOrder, filterWindow),
            singleFnirsLED(10, "1200nm", self.bitLeds, {"a1": self.a1}, cutoff, sampleRate, filterOrder, filterWindow),
            singleFnirsLED(11, "1550nm", self.bitLeds, {"a1": self.a1}, cutoff, sampleRate, filterOrder, filterWindow),
            singleFnirsLED(12, "940nm", self.bitLeds, {"a0": self.a0}, cutoff, sampleRate, filterOrder, filterWindow),
            singleFnirsLED(13, "870nm", self.bitLeds, {"a0": self.a0}, cutoff, sampleRate, filterOrder, filterWindow),
            singleFnirsLED(14, "1200nm", self.bitLeds, {"a1": self.a1}, cutoff, sampleRate, filterOrder, filterWindow),
            singleFnirsLED(15, "1550nm", self.bitLeds, {"a1": self.a1}, cutoff, sampleRate, filterOrder, filterWindow)
        ]

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
        for l in range(len(self.ledPool)):
            self.ledPool[l]()
        delC = np.dot(self.coeffMat, np.array([
            [self.ledPool[1].currData["a0"]["delta"], self.ledPool[5].currData["a0"]["delta"], self.ledPool[9].currData["a0"]["delta"], self.ledPool[13].currData["a0"]["delta"]],
            [self.ledPool[0].currData["a0"]["delta"], self.ledPool[4].currData["a0"]["delta"], self.ledPool[8].currData["a0"]["delta"], self.ledPool[12].currData["a0"]["delta"]]
        ]))
        self.ledPool[1].__setDelC__("a0", delC[0][0])
        self.ledPool[5].__setDelC__("a0", delC[0][1])
        self.ledPool[9].__setDelC__("a0", delC[0][2])
        self.ledPool[13].__setDelC__("a0", delC[0][3])
        self.ledPool[0].__setDelC__("a0", delC[1][0])
        self.ledPool[4].__setDelC__("a0", delC[1][1])
        self.ledPool[8].__setDelC__("a0", delC[1][2])
        self.ledPool[12].__setDelC__("a0", delC[1][3])

        rawSignalAvg = {
            "870nm": (self.ledPool[1].currData["a0"]["value"] + self.ledPool[5].currData["a0"]["value"] + self.ledPool[9].currData["a0"]["value"] + self.ledPool[13].currData["a0"]["value"]) / 4,
            "940nm": (self.ledPool[0].currData["a0"]["value"] + self.ledPool[4].currData["a0"]["value"] + self.ledPool[8].currData["a0"]["value"] + self.ledPool[12].currData["a0"]["value"]) / 4,
            "1200nm": (self.ledPool[2].currData["a1"]["value"] + self.ledPool[6].currData["a1"]["value"] + self.ledPool[10].currData["a1"]["value"] + self.ledPool[14].currData["a1"]["value"]) / 4,
            "1550nm": (self.ledPool[3].currData["a1"]["value"] + self.ledPool[7].currData["a1"]["value"] + self.ledPool[11].currData["a1"]["value"] + self.ledPool[15].currData["a1"]["value"]) / 4
        }
        self.sio.emit('serverMSGA', rawSignalAvg)
        deltaSignalAvg = {
            "870nm": (self.ledPool[1].currData["a0"]["delta"] + self.ledPool[5].currData["a0"]["delta"] + self.ledPool[9].currData["a0"]["delta"] + self.ledPool[13].currData["a0"]["delta"]) / 4,
            "940nm": (self.ledPool[0].currData["a0"]["delta"] + self.ledPool[4].currData["a0"]["delta"] + self.ledPool[8].currData["a0"]["delta"] + self.ledPool[12].currData["a0"]["delta"]) / 4,
            "1200nm": (self.ledPool[2].currData["a1"]["delta"] + self.ledPool[6].currData["a1"]["delta"] + self.ledPool[10].currData["a1"]["delta"] + self.ledPool[14].currData["a1"]["delta"]) / 4,
            "1550nm": (self.ledPool[3].currData["a1"]["delta"] + self.ledPool[7].currData["a1"]["delta"] + self.ledPool[11].currData["a1"]["delta"] + self.ledPool[15].currData["a1"]["delta"]) / 4
        }
        self.sio.emit('serverMSGdeltaA', deltaSignalAvg)
        concentrationSignalAvg = {
            "870nm": (self.ledPool[1].currData["a0"]["delC"] + self.ledPool[5].currData["a0"]["delC"] + self.ledPool[9].currData["a0"]["delC"] + self.ledPool[13].currData["a0"]["delC"]) / 4,
            "940nm": (self.ledPool[0].currData["a0"]["delC"] + self.ledPool[4].currData["a0"]["delC"] + self.ledPool[8].currData["a0"]["delC"] + self.ledPool[12].currData["a0"]["delC"]) / 4
        }
        self.sio.emit('serverMSGC', concentrationSignalAvg)
        highpassSignalAvg = {
            "870nm": (self.ledPool[1].currData["a0"]["highPass"] + self.ledPool[5].currData["a0"]["highPass"] + self.ledPool[9].currData["a0"]["highPass"] + self.ledPool[13].currData["a0"]["highPass"]) / 4,
            "940nm": (self.ledPool[0].currData["a0"]["highPass"] + self.ledPool[4].currData["a0"]["highPass"] + self.ledPool[8].currData["a0"]["highPass"] + self.ledPool[12].currData["a0"]["highPass"]) / 4
        }
        self.sio.emit('serverMSGCHP', highpassSignalAvg)
        if (concentrationSignalAvg["870nm"] + concentrationSignalAvg["940nm"]) > 0:
            tsiVals = {
                "870nm": ((concentrationSignalAvg["870nm"] / (concentrationSignalAvg["870nm"] + concentrationSignalAvg["940nm"])) * 7) + 90,
                "940nm": ((concentrationSignalAvg["940nm"] / (concentrationSignalAvg["870nm"] + concentrationSignalAvg["940nm"])) * 7) + 90
            }
        else:
            tsiVals = {
                "870nm": 0,
                "940nm": 0
            }
        allowTSIVals = {
            "870nm": (self.ledPool[1].currData["a0"]["allowTSI"] + self.ledPool[5].currData["a0"]["allowTSI"] + self.ledPool[9].currData["a0"]["allowTSI"] + self.ledPool[13].currData["a0"]["allowTSI"]) > 2,
            "940nm": (self.ledPool[0].currData["a0"]["allowTSI"] + self.ledPool[4].currData["a0"]["allowTSI"] + self.ledPool[8].currData["a0"]["allowTSI"] + self.ledPool[12].currData["a0"]["allowTSI"]) > 2
        }
        if tsiVals["870nm"] > 100:
            tsiVals["870nm"] = 100
        if tsiVals["940nm"] > 100:
            tsiVals["940nm"] = 100
        if tsiVals["870nm"] < 0:
            tsiVals["870nm"] = 0
        if tsiVals["940nm"] < 0:
            tsiVals["940nm"] = 0
        tsiVals = {
            "870nm": tsiVals["870nm"] * (1 if allowTSIVals["870nm"] else 0),
            "940nm": tsiVals["940nm"] * (1 if allowTSIVals["940nm"] else 0)
        }
        self.sio.emit('serverMSGTSI', tsiVals)

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
    adcTest = sensorADC("GPIO4", "GPIO17", "GPIO27", "GPIO22")
    adcTest()
