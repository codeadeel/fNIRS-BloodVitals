#!/usr/bin/env python3

# This file is responsible for update daemon

# %%
# Importing Libraries
import os
import subprocess
from time import sleep
import requests
import oledlib

# %%
# Check version difference
def checkDownloadDiff(existFile, ftpLink, ftpServer):
    """
    This function is used to check for the hash difference to take update decision

    Arguments
    =========
    existFile : Absolute address for exisiting version file
    ftpLink : Web address file to check for new version
    ftpServer : FTP server address
    """
    ftpCheck = requests.get(f"http://0.0.0.0:5003/api/network/servercheck?server={ftpServer}").text.replace("\"", "").replace("\n", "")
    if ftpCheck=="true":
        with open(existFile, "r") as file1:
            edat = file1.readlines()[0].replace("\n", "")
            print(f"[ Existing Hash ] : {edat}")
        resp = requests.get(ftpLink).text.replace("\n", "")
        print(f"[ New Hash ] : {resp}")
        if edat==resp:
            return False
        else:
            return True
    else:
        return False

def checkSystemHealth():
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

def checkSystemConnectivity():
    """
    This function checks for system connectivity with server
    """
    portalAddress = requests.get("http://0.0.0.0:5003/api/network/portaladdress").text.replace("\"", "").replace("\n", "")
    serverCheck = requests.get(f"http://0.0.0.0:5003/api/network/servercheck?server={portalAddress}").text.replace("\"", "").replace("\n", "")
    if serverCheck=="true":
        return portalAddress, True
    else:
        return portalAddress, False

def updateMechanism(firstTime=False):
    """
    This function provides update mechanism for the update daemon
    
    Arguments
    =========
    firstTime : Check if the mechanism is being run first time
    """
    brkEror = ["X    BRICKED    X", "code.adeel@gmail.com"]
    oledisp = oledlib.oled()
    if firstTime:
        oledisp.displayImage("/root/logoBitmap.png")
        sleep(7)
    if checkSystemHealth():
        oledisp.checkingUpdates()
        print("[ Update Daemon ] : Checking for Updates")
        if checkDownloadDiff("/root/version", "https://www.ftp.codeadeel.com/fnirsEdgeDevice/version", "ftp.codeadeel.com"):
            oledisp.updating()
            print("[ Update Daemon ] : Downloading Updates")
            updte = subprocess.run(f"wget -O /root/install.sh https://www.ftp.codeadeel.com/fnirsEdgeDevice/install.sh", shell=True, text=True, capture_output=True)
            if updte.returncode==0:
                print("[ Update Daemon ] : Installing Updates")
                excer = subprocess.run(f"/bin/bash /root/install.sh", shell=True, text=True, capture_output=True)
                if excer.returncode==0:
                    clnup = subprocess.run(f"rm /root/install.sh", shell=True, text=True, capture_output=True)
                    if clnup.returncode==0:
                        print("[ Update Daemon ] : Cleanup Process Completed")
                        oledisp.shuttingDown()
                        shdn = subprocess.run(f"shutdown now", shell=True, text=True, capture_output=True)
                        if shdn.returncode==0:
                            print("[ Update Daemon ]: Shutting Down as Part of Update Process")
                        else:
                            print("[ Update Daemon ]: Manual Shutdown Required to Complete Update")
                            oledisp.shutdownFailed()
                    else:
                        print("[ Update Daemon ] : Cleanup Process Failed")
                else:
                    print("[ Update Daemon ] : Device Bricked")
                    oledisp.throwError(brkEror[0], brkEror[1])
                    exit()
            else:
                oledisp.throwError("UPD-1", "Update Failed")
        else:
            connCheck = checkSystemConnectivity()
            if connCheck[1]:
                oledisp.upstreamCheck(connCheck[0])
            else:
                oledisp.pingError()
                sleep(5)
                print("[ Update Daemon ] : Requesting Hotspot")
                hpot = requests.get(f"http://0.0.0.0:5003/api/network/createhotspot?ssid=fnirsEdge @ AEELab&password=fnirsEdge123")
    else:
        print("[ Update Daemon ] : Device Bricked")
        oledisp.throwError(brkEror[0], brkEror[1])
        exit()

# %%
# Execution
if __name__=="__main__":
    updateMechanism(True)
    while True:
        sleep(21600)
        updateMechanism()
