#!/usr/bin/env python3

# This file is responsible for algorithm processing. It will receive data over socket, processes it & send back to main portal

# %%
# Importing Libraries
import os
import numpy as np
from scipy.signal import butter, lfilter
from scipy.signal import correlate
import socketio

# %%
# Algorithm Class
class algoInference:
    def __init__(self, deviceID, cutoff=0.1, sampleRate=1600, filterOrder=1, filterWindow=100):
        """
        This class initializes the algorithm class

        Arguments
        =========
        cutoff : Cutoff frequency for highpass filter ( default : 0.1 )
        smapleRate : Sample Rate for the data acquisition ( default : 1600 )
        filerOrder : Filter Order for highpass filter ( default : 1 )
        filterWindow : Window size for highpass filter ( default : 100 )
        """
        self.deviceID = deviceID
        self.cutOffFrequency = cutoff
        self.sampleRate = sampleRate
        self.filterOrder = filterOrder
        self.filterWindow = filterWindow
        self.nyquistFreq = 0.5 * self.sampleRate
        self.normCutOff = self.cutOffFrequency / self.nyquistFreq
        self.filterCoeff1, self.filterCoeff2 = butter(self.filterOrder, self.normCutOff, btype="highpass")
        self.runOnce = True
        self.coeffMat = np.linalg.inv(np.array([
            [691.32, 2.9296],
            [693.44, 22.22]
        ]))
        self.localRawDataPool = dict()
        self.localCorelationPool = dict()
        self.localDeltaPool = dict()
        self.localDeltaCPool = {
            '870nm': [0] * self.filterWindow,
            '940nm': [0] * self.filterWindow
        }
        self.localDeltaCHighpassPool = dict()
        self.localTSIPool = dict()
    
    def getCorrelation(self, wav1, wav2, wav3, wav4):
        """
        This method finds correlation to four different waveforms, returns the resultant correlation

        Arguments
        =========
        wav1 : Waveform 1
        wav2 : Waveform 2
        wav3 : Waveform 3
        wav4 : Waveform 4

        Output
        ======
        Resultant Correlation
        """
        wav12 = correlate(wav1, wav2, mode="same", method="direct")
        wav34 = correlate(wav3, wav4, mode="same", method="direct")
        return correlate(wav12, wav34, mode="same", method="direct").tolist()

    def commitData(self, data):
        """
        This method is utilized for new data instance commit

        Arguments
        =========
        data : New data instance
        """
        if self.runOnce:
            self.runOnce = False
            for i in list(data['values'].keys()):
                self.localRawDataPool[i] = [0] * self.filterWindow
        for i in list(data['values'].keys()):
            self.localRawDataPool[i].append(data['values'][i])
            del self.localRawDataPool[i][0]
        
        # Find Correlation Between Waveforms
        self.localCorelationPool['870nm'] = self.getCorrelation(self.localRawDataPool['870nmch1'], self.localRawDataPool['870nmch2'], self.localRawDataPool['870nmch3'], self.localRawDataPool['870nmch4'])
        self.localCorelationPool['940nm'] = self.getCorrelation(self.localRawDataPool['940nmch1'], self.localRawDataPool['940nmch2'], self.localRawDataPool['940nmch3'], self.localRawDataPool['940nmch4'])
        self.localCorelationPool['1200nm'] = self.getCorrelation(self.localRawDataPool['1200nmch1'], self.localRawDataPool['1200nmch2'], self.localRawDataPool['1200nmch3'], self.localRawDataPool['1200nmch4'])
        self.localCorelationPool['1550nm'] = self.getCorrelation(self.localRawDataPool['1550nmch1'], self.localRawDataPool['1550nmch2'], self.localRawDataPool['1550nmch3'], self.localRawDataPool['1550nmch4'])

        # Find Delta of the Waveform
        self.localDeltaPool['870nm'] = self.localCorelationPool['870nm'][-1] - self.localCorelationPool['870nm'][-2]
        self.localDeltaPool['940nm'] = self.localCorelationPool['940nm'][-1] - self.localCorelationPool['940nm'][-2]
        self.localDeltaPool['1200nm'] = self.localCorelationPool['1200nm'][-1] - self.localCorelationPool['1200nm'][-2]
        self.localDeltaPool['1550nm'] = self.localCorelationPool['1550nm'][-1] - self.localCorelationPool['1550nm'][-2]

        # Find Concentration Levels
        delC = np.dot(self.coeffMat, np.array([
            [self.localDeltaPool['870nm']],
            [self.localDeltaPool['940nm']]
        ]))

        self.localDeltaCPool['870nm'].append(delC[0][0])
        self.localDeltaCPool['940nm'].append(delC[1][0])
        del self.localDeltaCPool['870nm'][0]
        del self.localDeltaCPool['940nm'][0]

        # Apply Highpass Filter
        self.localDeltaCHighpassPool['870nm'] = lfilter(self.filterCoeff2, self.filterCoeff1, self.localDeltaCPool['870nm'])
        self.localDeltaCHighpassPool['940nm'] = lfilter(self.filterCoeff2, self.filterCoeff1, self.localDeltaCPool['940nm'])

        # Finding TSI Values
        filterAvg1 = float(np.sum(self.localDeltaCHighpassPool['870nm']) / len(self.localDeltaCHighpassPool['870nm']))
        filterAvg2 = float(np.sum(self.localDeltaCHighpassPool['940nm']) / len(self.localDeltaCHighpassPool['940nm']))

        if (self.localDeltaCPool['870nm'][-1] + self.localDeltaCPool['940nm'][-1])>0:
            self.localTSIPool['870nm'] = ((self.localDeltaCPool['870nm'][-1] / (self.localDeltaCPool['870nm'][-1] + self.localDeltaCPool['940nm'][-1])) * 7) + 90
            self.localTSIPool['940nm'] = ((self.localDeltaCPool['940nm'][-1] / (self.localDeltaCPool['870nm'][-1] + self.localDeltaCPool['940nm'][-1])) * 7) + 90
        else:
            self.localTSIPool['870nm'] = 0
            self.localTSIPool['940nm'] = 0

        if self.localTSIPool['870nm']>100:
            self.localTSIPool['870nm'] = 100
        if self.localTSIPool['940nm']>100:
            self.localTSIPool['940nm'] = 100
        if self.localTSIPool['870nm']<0:
            self.localTSIPool['870nm'] = 0
        if self.localTSIPool['940nm']<0:
            self.localTSIPool['940nm'] = 0

    def getRawData(self):
        """
        This method returns the raw data to the dashboard
        """
        outer = dict()
        for i in list(self.localRawDataPool.keys()):
            outer[i] = self.localRawDataPool[i][-1]
        return outer
    
    def getDeltaData(self):
        """
        This method returns the deltaA data to the dashboard
        """
        return self.localDeltaPool

    def getDeltaCData(self):
        """
        This method returns concentration values to the dashboard
        """
        outer = dict()
        for i in list(self.localDeltaCPool.keys()):
            outer[i] = self.localDeltaCPool[i][-1]
        return outer
    
    def getHighPassData(self):
        """
        This method returns the concentration values after application of highpass filter
        """
        outer = dict()
        for i in list(self.localDeltaCHighpassPool.keys()):
            outer[i] = self.localDeltaCHighpassPool[i][-1]
        return outer

    def getTSIData(self):
        """
        This method returns the TSI values to the dashboard
        """
        return self.localTSIPool


# %%
# Inference Tools
portalAddress = os.environ.get('PORTAL_ADDRESS', "https://fnirs.codeadeel.com")
cutOffFreq = float(os.environ.get('CUTOFF_FREQUENCY', "0.1"))
samplingRate = int(os.environ.get('SAMPLING_RATE', "1600"))
filterOrder = int(os.environ.get('FILTER_ORDER', "1"))
filterWindow = int(os.environ.get('FILTER_WINDOW', "100"))

sio = socketio.Client()
sio.connect(portalAddress)
dataPool = dict()

print(f"[ ALGORITHM : PORTAL ] : {portalAddress}")
print(f"[ ALGORITHM : CUTOFF ] : {cutOffFreq}")
print(f"[ ALGORITHM : SAMPLING ] : {samplingRate}")
print(f"[ ALGORITHM : FILTER ORDER ] : {filterOrder}")
print(f"[ ALGORITHM : FILTER WINDOW ] : {filterWindow}")

@sio.event
def connect():
    print("[ SocketIO : CONNECTION ] : Connected to Server")

@sio.event
def algoRAW(data):
    if data['deviceID'] not in list(dataPool.keys()):
        dataPool[data['deviceID']] = algoInference(data['deviceID'], cutOffFreq, samplingRate, filterOrder, filterWindow)
    dataPool[data['deviceID']].commitData(data)

    sio.emit('serverDevID', data['deviceID'])
    sio.emit('serverMSGA', dataPool[data['deviceID']].getRawData())
    sio.emit('serverMSGdeltaA', dataPool[data['deviceID']].getDeltaData())
    sio.emit('serverMSGC', dataPool[data['deviceID']].getDeltaCData())
    sio.emit('serverMSGCHP', dataPool[data['deviceID']].getHighPassData())
    sio.emit('serverMSGTSI', dataPool[data['deviceID']].getTSIData())

# Event Loop for SocketIO
sio.wait()
sio.disconnect()
