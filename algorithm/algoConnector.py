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
            [3.78, 6.041, 0.053645, -0.00066],
            [17.28, 1.711, 0.0035719, 0.0002],
            [0.05, 0.075, 1.0357, 0.00075],
            [0.075, 1, 7.9959, 0.723]
        ]))
        self.localRawDataPool = dict()
        self.localDeltaPool = dict()
        self.localDeltaCPool = dict()
        self.localCorelationPool = dict()
        self.localDeltaCHighpassPool = dict()
        self.localTSIPool = dict()
    
    # def getCorrelation(self, wav1, wav2, wav3, wav4):
    #     """
    #     This method finds correlation to four different waveforms, returns the resultant correlation

    #     Arguments
    #     =========
    #     wav1 : Waveform 1
    #     wav2 : Waveform 2
    #     wav3 : Waveform 3
    #     wav4 : Waveform 4

    #     Output
    #     ======
    #     Resultant Correlation
    #     """
    #     wav12 = correlate(wav1, wav2, mode="same", method="direct")
    #     wav34 = correlate(wav3, wav4, mode="same", method="direct")
    #     return correlate(wav12, wav34, mode="same", method="direct").tolist()
    
    def getCorrelation(self, wav1, wav2, wav3, wav4):
        """
        This method finds average to four different waveforms, returns the resultant correlation

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
        ret = np.array(wav1) + np.array(wav2) + np.array(wav3) + np.array(wav4)
        return (ret/4).tolist()

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
                # Initialize the waveforms
                self.localRawDataPool[i] = [0] * self.filterWindow
                self.localDeltaPool[i] = [0] * self.filterWindow
                self.localDeltaCPool[i] = [0] * self.filterWindow
        
        for i in list(data['values'].keys()):
            # Parsing Raw Data
            self.localRawDataPool[i].append(data['values'][i])
            del self.localRawDataPool[i][0]

            # Find DeltaA of the Raw Waveform
            self.localDeltaPool[i].append(self.localRawDataPool[i][-1] - self.localRawDataPool[i][-2])
            del self.localDeltaPool[i][0]

            # Delete First Element of Concentration Pool
            del self.localDeltaCPool[i][0]
        
        # Find Concentration Levels
        delC = np.dot(self.coeffMat, np.array([
            [self.localDeltaPool['870nmch1'][-1], self.localDeltaPool['870nmch2'][-1], self.localDeltaPool['870nmch3'][-1], self.localDeltaPool['870nmch4'][-1]],
            [self.localDeltaPool['660nmch1'][-1], self.localDeltaPool['660nmch2'][-1], self.localDeltaPool['660nmch3'][-1], self.localDeltaPool['660nmch4'][-1]],
            [self.localDeltaPool['1200nmch1'][-1], self.localDeltaPool['1200nmch2'][-1], self.localDeltaPool['1200nmch3'][-1], self.localDeltaPool['1200nmch4'][-1]],
            [self.localDeltaPool['1550nmch1'][-1], self.localDeltaPool['1550nmch2'][-1], self.localDeltaPool['1550nmch3'][-1], self.localDeltaPool['1550nmch4'][-1]]
        ]))

        self.localDeltaCPool['870nmch1'].append(delC[0][0])
        self.localDeltaCPool['870nmch2'].append(delC[0][1])
        self.localDeltaCPool['870nmch3'].append(delC[0][2])
        self.localDeltaCPool['870nmch4'].append(delC[0][3])
        self.localDeltaCPool['660nmch1'].append(delC[1][0])
        self.localDeltaCPool['660nmch2'].append(delC[1][1])
        self.localDeltaCPool['660nmch3'].append(delC[1][2])
        self.localDeltaCPool['660nmch4'].append(delC[1][3])
        self.localDeltaCPool['1200nmch1'].append(delC[2][0])
        self.localDeltaCPool['1200nmch2'].append(delC[2][1])
        self.localDeltaCPool['1200nmch3'].append(delC[2][2])
        self.localDeltaCPool['1200nmch4'].append(delC[2][3])
        self.localDeltaCPool['1550nmch1'].append(delC[3][0])
        self.localDeltaCPool['1550nmch2'].append(delC[3][1])
        self.localDeltaCPool['1550nmch3'].append(delC[3][2])
        self.localDeltaCPool['1550nmch4'].append(delC[3][3])

        # Find Correlation Between Waveforms
        self.localCorelationPool['870nm'] = self.getCorrelation(self.localDeltaCPool['870nmch1'], self.localDeltaCPool['870nmch2'], self.localDeltaCPool['870nmch3'], self.localDeltaCPool['870nmch4'])
        self.localCorelationPool['660nm'] = self.getCorrelation(self.localDeltaCPool['660nmch1'], self.localDeltaCPool['660nmch2'], self.localDeltaCPool['660nmch3'], self.localDeltaCPool['660nmch4'])
        self.localCorelationPool['1200nm'] = self.getCorrelation(self.localDeltaCPool['1200nmch1'], self.localDeltaCPool['1200nmch2'], self.localDeltaCPool['1200nmch3'], self.localDeltaCPool['1200nmch4'])
        self.localCorelationPool['1550nm'] = self.getCorrelation(self.localDeltaCPool['1550nmch1'], self.localDeltaCPool['1550nmch2'], self.localDeltaCPool['1550nmch3'], self.localDeltaCPool['1550nmch4'])

        # Apply Highpass Filter
        self.localDeltaCHighpassPool['870nm'] = lfilter(self.filterCoeff2, self.filterCoeff1, self.localCorelationPool['870nm'])
        self.localDeltaCHighpassPool['660nm'] = lfilter(self.filterCoeff2, self.filterCoeff1, self.localCorelationPool['660nm'])
        self.localDeltaCHighpassPool['1200nm'] = lfilter(self.filterCoeff2, self.filterCoeff1, self.localCorelationPool['1200nm'])
        self.localDeltaCHighpassPool['1550nm'] = lfilter(self.filterCoeff2, self.filterCoeff1, self.localCorelationPool['1550nm'])

        # Finding TSI Values
        filterAvg1 = float(np.sum(self.localDeltaCHighpassPool['870nm']) / len(self.localDeltaCHighpassPool['870nm']))
        filterAvg2 = float(np.sum(self.localDeltaCHighpassPool['660nm']) / len(self.localDeltaCHighpassPool['660nm']))
        filterAvg3 = float(np.sum(self.localDeltaCHighpassPool['1200nm']) / len(self.localDeltaCHighpassPool['1200nm']))
        filterAvg3 = float(np.sum(self.localDeltaCHighpassPool['1550nm']) / len(self.localDeltaCHighpassPool['1550nm']))

        if (self.localCorelationPool['870nm'][-1] + self.localCorelationPool['660nm'][-1])>0:
            self.localTSIPool['870nm'] = ((self.localCorelationPool['870nm'][-1] / (self.localCorelationPool['870nm'][-1] + self.localCorelationPool['660nm'][-1] + self.localCorelationPool['1200nm'][-1] + self.localCorelationPool['1550nm'][-1])) * 7) + 90
            self.localTSIPool['660nm'] = ((self.localCorelationPool['660nm'][-1] / (self.localCorelationPool['870nm'][-1] + self.localCorelationPool['660nm'][-1] + self.localCorelationPool['1200nm'][-1] + self.localCorelationPool['1550nm'][-1])) * 7) + 90
            self.localTSIPool['1200nm'] = ((self.localCorelationPool['1200nm'][-1] / (self.localCorelationPool['870nm'][-1] + self.localCorelationPool['660nm'][-1] + self.localCorelationPool['1200nm'][-1] + self.localCorelationPool['1550nm'][-1])) * 7) + 90
            self.localTSIPool['1550nm'] = ((self.localCorelationPool['1550nm'][-1] / (self.localCorelationPool['870nm'][-1] + self.localCorelationPool['660nm'][-1] + self.localCorelationPool['1200nm'][-1] + self.localCorelationPool['1550nm'][-1])) * 7) + 90
        else:
            self.localTSIPool['870nm'] = 0
            self.localTSIPool['660nm'] = 0
            self.localTSIPool['1200nm'] = 0
            self.localTSIPool['1550nm'] = 0

        if self.localTSIPool['870nm']>100:
            self.localTSIPool['870nm'] = 100
        if self.localTSIPool['660nm']>100:
            self.localTSIPool['660nm'] = 100
        if self.localTSIPool['1200nm']>100:
            self.localTSIPool['1200nm'] = 100
        if self.localTSIPool['1550nm']>100:
            self.localTSIPool['1550nm'] = 100
        if self.localTSIPool['870nm']<0:
            self.localTSIPool['870nm'] = 0
        if self.localTSIPool['660nm']<0:
            self.localTSIPool['660nm'] = 0
        if self.localTSIPool['1200nm']<0:
            self.localTSIPool['1200nm'] = 0
        if self.localTSIPool['1550nm']<0:
            self.localTSIPool['1550nm'] = 0

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
        outer = dict()
        for i in list(self.localDeltaPool.keys()):
            outer[i] = self.localDeltaPool[i][-1]
        return outer

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
