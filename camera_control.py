import cv2
import pyzwoasi
from pyzwoasi import ZWOCamera
from pyzwoasi.pyzwoasi import ASIImageType
import csv
import exif
from datetime import datetime
import os

image_metadata = {
    # 'camera_owner_name': 'Aalto University',
    'copyright': 'Aalto University',
    'datetime': '',
    'exposure_time': 0,
    'f_number': '1.2',
    'focal_length': '2.5',
    'gain': 0,
    # 'temperature': '',
    'model': 'ZWO ASI676MC'
}

def read_settings(): # type: ignore
    with open("camera_settings.csv", "r") as f:
        data = csv.DictReader(f)
        for row in data:
            image_metadata['exposure_time'] = float(row['exposure'])
            image_metadata['gain'] = int(row['gain'])

# https://exif.readthedocs.io/en/latest/usage.html
def encode_image(img, filename):
    status, image_jpg_coded = cv2.imencode('.jpg', img)

    image_jpg_coded_bytes = image_jpg_coded.tobytes()
    exif_jpg = exif.Image(image_jpg_coded_bytes)

    for name, attr in image_metadata.items():
        exif_jpg[name] = attr

    filename = filename + '/' +datetime.now().strftime("%H%M-%S") + ".jpg"

    with open(filename, 'wb') as new_image_file:
        new_image_file.write(exif_jpg.get_file())


def camera_set_settings(camera: ZWOCamera):
    settings = read_settings()

    exposure_time = int(image_metadata['exposure_time'])

    if(exposure_time > 40):
        exposure_time = 40
        
    camera.exposure = int(exposure_time * 1e6)
    camera.gain = image_metadata['gain']    

def take_picture():
    path = 'Images'

    if(not os.path.isdir(path)):
        os.mkdir(path)

    path = path + '/' + str(datetime.today().strftime('%Y-%m-%d'))
    if(not os.path.isdir(path)):
        os.mkdir(path)

    numOfConnectedCameras = pyzwoasi.getNumOfConnectedCameras()
    if (numOfConnectedCameras == 0):
        print("No camera connected")
        exit()

    for cameraIndex in range(numOfConnectedCameras):
        with ZWOCamera(cameraIndex) as camera:
            camera.imageType = ASIImageType.ASI_IMG_RGB24

            camera_set_settings(camera)

            camera.gain = 70
            image_metadata['datetime'] = str(datetime.now())
            im = camera.shot()

            encode_image(im, path)

if __name__ == "__main__":
    while(True):
        take_picture()