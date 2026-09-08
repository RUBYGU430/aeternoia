from PIL import Image
import os
import glob

brain_dir = "/Users/m2macbookair/.gemini/antigravity-ide/brain/7a9d215b-f13e-40a9-8c72-585568ffbe1e/"
out_dir = "/Users/m2macbookair/Desktop/RUBYGU's AI art/에테리아 치유센터 ASMR/지유프로젝트/"

singing_bowl_path = glob.glob(os.path.join(brain_dir, "singing_bowl*.png"))[0]

def process_image(path, out_name):
    img = Image.open(path).convert("RGBA")
    data = img.getdata()
    newData = []
    for item in data:
        if item[0] < 15 and item[1] < 15 and item[2] < 15:
            newData.append((0, 0, 0, 0))
        else:
            newData.append(item)
    img.putdata(newData)
    img.thumbnail((300, 300))
    img.save(os.path.join(out_dir, out_name))

process_image(singing_bowl_path, "singingbowl.png")
print("Done extracting singing bowl")
