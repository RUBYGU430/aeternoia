from PIL import Image

def convert_to_transparent(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    for r, g, b, a in data:
        max_val = max(r, g, b)
        if max_val == 0:
            new_data.append((0, 0, 0, 0))
        else:
            r_out = min(255, int(r * 255 / max_val))
            g_out = min(255, int(g * 255 / max_val))
            b_out = min(255, int(b * 255 / max_val))
            new_data.append((r_out, g_out, b_out, max_val))
    img.putdata(new_data)
    img.save(output_path, "PNG")

try:
    convert_to_transparent('crystal_bg.png', 'crystal_bg.png')
    convert_to_transparent('potion_bg.png', 'potion_bg.png')
    print("Success")
except Exception as e:
    print(e)
