#!/usr/bin/env python3

# %%
# OLED Display Handler
# ====================
# This script is responsible for handling the OLED Screen for user information

# => Before running the script, please enable I2c interface from raspi-config

# %%
# Importing Libraries
from board import SCL, SDA
import busio
import adafruit_ssd1306
from PIL import Image, ImageDraw, ImageFont

# %%
# OLED Tools
class oled:
    def __init__(self):
        """
        This class is responsible for initialization of OLED Screen
        """
        self.oledHeight = 32
        self.oledWidth = 128
        self.oledAddr = 0x3c
        self.fontSize = 8
        self.i2c = busio.I2C(SCL, SDA)
        self.display = adafruit_ssd1306.SSD1306_I2C(self.oledWidth, self.oledHeight, self.i2c, addr = self.oledAddr)
        self.font = ImageFont.load_default(size=self.fontSize)

    def getFontSize(self, text):
        """
        This method gets calculates the area of the text placement

        Arguments
        =========
        text : Text to be place on the screen

        Output
        ======
        text : Text to be place on the screen
        fontWidth : Text width being placed
        fontHeight : Text height being placed
        """
        left, top, right, bottom = self.font.getbbox(text)
        fontWidth = right - left
        fontHeight = bottom - top
        return text, fontWidth, fontHeight

    def displayImage(self, imgPth):
        """
        This method will diplay image on the OLED screen

        Arguments
        =========
        imgPth : Image path to be shown
        """
        pasterImg = Image.open(imgPth).convert("1")
        img = Image.new("1", (self.oledWidth, self.oledHeight))
        img.paste(pasterImg)
        self.display.image(img)
        self.display.show()

    def showHotspot(self, wifissid, wifipass, wifigate):
        """
        This method will display hotspot credentials on the OLED screen

        Arguments
        =========
        wifissid : SSID to be displayed
        wifipass : WiFi password to be displayed
        wifigate : Default gateway to be displayed
        """
        img = Image.new("1", (self.oledWidth, self.oledHeight))
        draw = ImageDraw.Draw(img)
        txt1, fontWidth1, fontHeight1 = self.getFontSize("fNIRS EDGE")
        draw.text(((self.oledWidth//2)-(fontWidth1//2), -1), txt1, font=self.font, fill=255);
        txt2, fontWidth2, fontHeight2 = self.getFontSize(f"SSID: {wifissid}")
        draw.text((0, fontHeight1), txt2, font=self.font, fill=255)
        txt3, fontWidth3, fontHeight3 = self.getFontSize(f"Pass: {wifipass}")
        draw.text((0, fontHeight1 + fontHeight2), txt3, font=self.font, fill=255)
        txt4, fontWidth4, fontHeight4 = self.getFontSize(f"Gateway: {wifigate}")
        draw.text((0, fontHeight1 + fontHeight2 + fontHeight3), txt4, font=self.font, fill=255)
        self.display.image(img)
        self.display.show()

    def upstreamCheck(self):
        """
        This method is used to display if the system is working correctly
        """
        img = Image.new("1", (self.oledWidth, self.oledHeight))
        draw = ImageDraw.Draw(img)
        txt1, fontWidth1, fontHeight1 = self.getFontSize("fNIRS EDGE")
        draw.text(((self.oledWidth//2)-(fontWidth1//2), -1), txt1, font=self.font, fill=255);
        txt2, fontWidth2, fontHeight2 = self.getFontSize(f"Access : Granted")
        draw.text((0, fontHeight1), txt2, font=self.font, fill=255)
        txt3, fontWidth3, fontHeight3 = self.getFontSize("Dashboard :")
        draw.text((0, fontHeight1 + fontHeight2 + 1), txt3, font=self.font, fill=255);
        txt4, fontWidth4, fontHeight4 = self.getFontSize("fnirs . codeadeel . com")
        draw.text((0, fontHeight1 + fontHeight2 + fontHeight3 + 2), txt4, font=self.font, fill=255);
        self.display.image(img)
        self.display.show()


    def gatewayAssignmentError(self):
        """
        This method is used to display gateway assignment error
        """
        img = Image.new("1", (self.oledWidth, self.oledHeight))
        draw = ImageDraw.Draw(img)
        txt1, fontWidth1, fontHeight1 = self.getFontSize("fNIRS EDGE")
        draw.text(((self.oledWidth//2)-(fontWidth1//2), -1), txt1, font=self.font, fill=255);
        txt2, fontWidth2, fontHeight2 = self.getFontSize(f"ERROR : Code - 3")
        draw.text((0, fontHeight1), txt2, font=self.font, fill=255)
        txt3, fontWidth3, fontHeight3 = self.getFontSize("Gateway Failed")
        draw.text((0, fontHeight1 + fontHeight2 + 1), txt3, font=self.font, fill=255);
        self.display.image(img)
        self.display.show()

    def credsError(self):
        """
        This method is used to display bad credentials error during network connection
        """
        img = Image.new("1", (self.oledWidth, self.oledHeight))
        draw = ImageDraw.Draw(img)
        txt1, fontWidth1, fontHeight1 = self.getFontSize("fNIRS EDGE")
        draw.text(((self.oledWidth//2)-(fontWidth1//2), -1), txt1, font=self.font, fill=255);
        txt2, fontWidth2, fontHeight2 = self.getFontSize(f"ERROR : Code - 4")
        draw.text((0, fontHeight1), txt2, font=self.font, fill=255)
        txt3, fontWidth3, fontHeight3 = self.getFontSize("Bad Credentials")
        draw.text((0, fontHeight1 + fontHeight2 + 1), txt3, font=self.font, fill=255);
        self.display.image(img)
        self.display.show()

    def fatalError(self):
        img = Image.new("1", (self.oledWidth, self.oledHeight))
        draw = ImageDraw.Draw(img)
        txt1, fontWidth1, fontHeight1 = self.getFontSize("fNIRS EDGE")
        draw.text(((self.oledWidth//2)-(fontWidth1//2), -1), txt1, font=self.font, fill=255);
        txt2, fontWidth2, fontHeight2 = self.getFontSize(f"ERROR : Code - 5")
        draw.text((0, fontHeight1), txt2, font=self.font, fill=255)
        txt3, fontWidth3, fontHeight3 = self.getFontSize("Fatal Error")
        draw.text((0, fontHeight1 + fontHeight2 + 1), txt3, font=self.font, fill=255);
        txt4, fontWidth4, fontHeight4 = self.getFontSize("fnirs . codeadeel . com")
        draw.text((0, fontHeight1 + fontHeight2 + fontHeight3 + 2), txt4, font=self.font, fill=255);
        self.display.image(img)
        self.display.show()
# %%
# Execution
if __name__=="__main__":
    oledDisp = oled()
    # oledDisp.displayImage("/home/aeelab/PSAU.png")
    # oledDisp.showHotspot(wifissid="fNIRS @ Edge", wifipass="aeelab123", wifigate="10 . 10 . 10 . 1 / 24")
    # oledDisp.gatewayAssignmentError()
    # oledDisp.credsError()
    # oledDisp.fatalError()
    # oledDisp.upstreamCheck()
