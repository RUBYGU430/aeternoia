import os
from PIL import Image

brain_dir = "/Users/m2macbookair/.gemini/antigravity-ide/brain/7a9d215b-f13e-40a9-8c72-585568ffbe1e/"
bowl_path = os.path.join(brain_dir, "magical_sand_bowl_1780065785282.png")
miniatures_path = os.path.join(brain_dir, "magical_miniatures_1780065806201.png")
out_dir = "/Users/m2macbookair/Desktop/RUBYGU's AI art/에테리아 치유센터 ASMR/지유프로젝트/"

def remove_black(img_path, out_path, is_bowl=False):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    newData = []
    threshold = 30 if not is_bowl else 15
    for item in data:
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            newData.append((0, 0, 0, 0))
        else:
            newData.append(item)
    img.putdata(newData)
    
    if is_bowl:
        img.save(out_path)
        print(f"Saved {out_path}")
    else:
        # 4 miniatures horizontally
        w, h = img.size
        cw = w // 4
        names = ["dragon", "unicorn", "wizard", "castle"]
        for i in range(4):
            box = (i * cw, 0, (i + 1) * cw, h)
            cropped = img.crop(box)
            bbox = cropped.getbbox()
            if bbox:
                cropped = cropped.crop(bbox)
                out_name = f"mini_{names[i]}.png"
                cropped.save(os.path.join(out_dir, out_name))
                print(f"Saved {out_name}")

remove_black(bowl_path, os.path.join(out_dir, "magical_sand_bowl.png"), is_bowl=True)
remove_black(miniatures_path, "", is_bowl=False)
