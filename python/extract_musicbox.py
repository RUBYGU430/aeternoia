import os
from PIL import Image

brain_dir = "/Users/m2macbookair/.gemini/antigravity-ide/brain/7a9d215b-f13e-40a9-8c72-585568ffbe1e/"
body_path = os.path.join(brain_dir, "musicbox_body_1780145945751.png")
crank_path = os.path.join(brain_dir, "musicbox_crank_1780145959359.png")
out_dir = "/Users/m2macbookair/Desktop/RUBYGU's AI art/에테리아 치유센터 ASMR/지유프로젝트/"

def remove_black(img_path, out_path, threshold=20):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    newData = []
    for item in data:
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            newData.append((0, 0, 0, 0))
        else:
            newData.append(item)
    img.putdata(newData)
    img.save(out_path)
    print(f"Saved {out_path}")

remove_black(body_path, os.path.join(out_dir, "ornate_musicbox_body.png"), threshold=15)
remove_black(crank_path, os.path.join(out_dir, "ornate_musicbox_crank.png"), threshold=15)
