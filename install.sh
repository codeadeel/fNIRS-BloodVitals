#!/usr/bin/env bash
# Stopping Existing Services
if [ -e "/etc/systemd/system/fnirsNetwork.service" ]; then
	echo ">> Existing fNIRS Network Service Cleanup"
	systemctl stop fnirsNetwork.service
	systemctl disable fnirsNetwork.service
fi
if [ -e "/etc/systemd/system/adcDaemon.service" ]; then
	echo ">> Existing ADC Daemon Service Cleanup"
	systemctl stop adcDaemon.service
	systemctl disable adcDaemon.service
fi

# Setting up the environment
echo ">> Setting up Environment"
apt-get update
apt-get install -y wget curl python3 python3-pip python3-gpiozero python3-smbus i2c-tools nginx

echo ">> Downloading Resources"
cd /root
wget -O ./package.tar https://www.ftp.codeadeel.com/fnirsEdgeDevice/package.tar
wget -O ./version https://www.ftp.codeadeel.com/fnirsEdgeDevice/version

echo ">> Installing Resources"
tar -xvf ./package.tar
pip3 install -r ./resources/requirements.txt --break-system-packages
if [ -d "/var/www/html/dist" ]; then
	echo ">>> Existing Frontend Cleanup"
	rm -r /var/www/html/dist
fi
mv ./resources/dist /var/www/html/
mv ./resources/default /etc/nginx/sites-enabled/
cp /etc/nginx/sites-enabled/default /etc/nginx/sites-available/
systemctl restart nginx.service

mv ./resources/networkManager/networkHandler.py /root/
mv ./resources/networkManager/portalAddress /root/
mv ./resources/OLED/oledlib.py /root/
mv ./resources/OLED/logoBitmap.png /root/
mv ./resources/updateDaemon/updateDaemon.py /root/
mv ./resources/adcDaemon/adcDaemon.py /root/
chmod 777 /root/networkHandler.py
chmod 777 /root/oledlib.py
chmod 777 /root/updateDaemon.py
chmod 777 /root/adcDaemon.py

echo ">> Creating fNIRS Network Service"
mv ./resources/networkManager/fnirsNetwork.service /etc/systemd/system/
systemctl enable fnirsNetwork.service
systemctl restart fnirsNetwork.service

echo ">> Creating ADC Daemon Service"
mv ./resources/networkManager/adcDaemon.service /etc/systemd/system/
systemctl enable adcDaemon.service
systemctl restart adcDaemon.service

if [ ! -e "/etc/systemd/system/updateDaemon.service" ]; then
	echo ">>> Creating Update Daemon Service"
	mv ./resources/updateDaemon/updateDaemon.service /etc/systemd/system/
	systemctl enable updateDaemon.service
	systemctl restart updateDaemon.servce
fi

echo ">> Cleanup"
rm -r ./resources
rm ./package.tar
