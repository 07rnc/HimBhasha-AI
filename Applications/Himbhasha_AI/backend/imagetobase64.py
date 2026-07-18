import base64

image_path = "testimage.png"

with open(image_path, "rb") as image_file:
    encoded = base64.b64encode(image_file.read()).decode("utf-8")

print(encoded)