import os
from PIL import Image

brain_dir = "/Users/m2macbookair/.gemini/antigravity-ide/brain/7a9d215b-f13e-40a9-8c72-585568ffbe1e/"
img_path = os.path.join(brain_dir, "flower_fruit_elements_1780049631308.png")
out_dir = "/Users/m2macbookair/Desktop/RUBYGU's AI art/에테리아 치유센터 ASMR/지유프로젝트/"

# Load image
img = Image.open(img_path).convert("RGBA")

# Make black transparent
data = img.getdata()
newData = []
for item in data:
    if item[0] < 20 and item[1] < 20 and item[2] < 20:
        newData.append((0, 0, 0, 0))
    else:
        newData.append(item)
img.putdata(newData)

# Extract items based on grid locations
regions = [
    ("flower_pink.png", (50, 50, 480, 480)),
    ("flower_purple.png", (540, 50, 970, 480)),
    ("flower_daisy.png", (300, 300, 720, 720)),
    ("berry_blue.png", (50, 540, 480, 970)),
    ("berry_red.png", (540, 540, 970, 970)),
]

for name, box in regions:
    cropped = img.crop(box)
    bbox = cropped.getbbox()
    if bbox:
        cropped = cropped.crop(bbox)
        cropped.save(os.path.join(out_dir, name))
        print(f"Saved {name}")
    else:
        print(f"Failed to extract {name}")

bowl_path = os.path.join(brain_dir, "ornate_bowl_topdown_1780049616352.png")
bowl = Image.open(bowl_path)
bowl.save(os.path.join(out_dir, "bowl_bg.png"))
print("Saved bowl_bg.png")
