from PIL import Image
import os

brain_dir = "/Users/m2macbookair/.gemini/antigravity-ide/brain/7a9d215b-f13e-40a9-8c72-585568ffbe1e/"
img_path = os.path.join(brain_dir, "runic_wood_block_1780150297752.png")
out_dir = "/Users/m2macbookair/Desktop/RUBYGU's AI art/에테리아 치유센터 ASMR/지유프로젝트/"

img = Image.open(img_path).convert("RGBA")
data = img.getdata()
newData = []
for item in data:
    # Remove pure black or very dark colors
    if item[0] < 15 and item[1] < 15 and item[2] < 15:
        newData.append((0, 0, 0, 0))
    else:
        newData.append(item)
img.putdata(newData)
img.save(os.path.join(out_dir, "runic_wood_block.png"))
print("Done extracting block")
