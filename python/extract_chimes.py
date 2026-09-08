import os
from PIL import Image

brain_dir = "/Users/m2macbookair/.gemini/antigravity-ide/brain/7a9d215b-f13e-40a9-8c72-585568ffbe1e/"
crystals_path = os.path.join(brain_dir, "cosmic_crystals_1780059649358.png")
bell_path = os.path.join(brain_dir, "cosmic_bell_body_1780059632409.png")
out_dir = "/Users/m2macbookair/Desktop/RUBYGU's AI art/에테리아 치유센터 ASMR/지유프로젝트/"

def remove_black(img_path, out_path, is_bell=False):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    newData = []
    threshold = 30 if not is_bell else 20
    for item in data:
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            newData.append((0, 0, 0, 0))
        else:
            newData.append(item)
    img.putdata(newData)
    
    if is_bell:
        img.save(out_path)
        print(f"Saved {out_path}")
    else:
        # 5 crystals horizontally
        w, h = img.size
        cw = w // 5
        for i in range(5):
            box = (i * cw, 0, (i + 1) * cw, h)
            cropped = img.crop(box)
            bbox = cropped.getbbox()
            if bbox:
                cropped = cropped.crop(bbox)
                out_name = f"crystal_{i}.png"
                cropped.save(os.path.join(out_dir, out_name))
                print(f"Saved {out_name}")

remove_black(bell_path, os.path.join(out_dir, "cosmic_bell.png"), is_bell=True)
remove_black(crystals_path, "", is_bell=False)
