import os
from PIL import Image
import shutil

brain_dir = "/Users/m2macbookair/.gemini/antigravity-ide/brain/7a9d215b-f13e-40a9-8c72-585568ffbe1e/"
window_path = os.path.join(brain_dir, "fantasy_rain_window_1780146766448.png")
drop_path = os.path.join(brain_dir, "fantasy_raindrop_1780146782421.png")
out_dir = "/Users/m2macbookair/Desktop/RUBYGU's AI art/에테리아 치유센터 ASMR/지유프로젝트/"

# 1. Copy window
shutil.copy(window_path, os.path.join(out_dir, "fantasy_rain_window.png"))
print("Copied window background")

# 2. Remove black from drop
img = Image.open(drop_path).convert("RGBA")
data = img.getdata()
newData = []
for item in data:
    if item[0] < 20 and item[1] < 20 and item[2] < 20:
        newData.append((0, 0, 0, 0))
    else:
        newData.append(item)
img.putdata(newData)
img.save(os.path.join(out_dir, "fantasy_raindrop.png"))
print("Saved raindrop with transparency")
