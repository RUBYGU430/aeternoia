import base64
import os

filepath = "audio_base64.js"
mp3path = "game_sound/효과음/flower_water.mp3"

with open(mp3path, "rb") as f:
    b64_str = base64.b64encode(f.read()).decode("utf-8")

b64_data = f"data:audio/mp3;base64,{b64_str}"

with open(filepath, "r") as f:
    lines = f.readlines()

found = False
for i, line in enumerate(lines):
    if line.startswith("const FLOWER_WATER_MP3_B64"):
        lines[i] = f"const FLOWER_WATER_MP3_B64 = '{b64_data}';\n"
        found = True
        break

if not found:
    lines.append(f"const FLOWER_WATER_MP3_B64 = '{b64_data}';\n")

with open(filepath, "w") as f:
    f.writelines(lines)

print("Done appending FLOWER_WATER_MP3_B64")
