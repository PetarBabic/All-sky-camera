import cv2
import pyzwoasi
from pyzwoasi import ZWOCamera
from pyzwoasi.pyzwoasi import ASIImageType


numOfConnectedCameras = pyzwoasi.getNumOfConnectedCameras()
if (numOfConnectedCameras == 0):
    print("No camera connected")
    exit()

for cameraIndex in range(numOfConnectedCameras):
    with ZWOCamera(cameraIndex) as camera:
        camera.imageType = ASIImageType.ASI_IMG_RGB24

        camera.gain = 70
        im = camera.shot(exposureTime_us = 50000)
        cv2.imwrite('image.jpg', im)