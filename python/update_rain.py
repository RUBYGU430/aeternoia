import base64
import os

filepath = "audio_base64.js"
loop_mp3 = "game_sound/효과음/rain_window_loop.mp3"
single_mp3 = "game_sound/효과음/rain_window_single.mp3"

with open(loop_mp3, "rb") as f:
    loop_b64 = base64.b64encode(f.read()).decode("utf-8")
with open(single_mp3, "rb") as f:
    single_b64 = base64.b64encode(f.read()).decode("utf-8")

loop_data = f"data:audio/mp3;base64,{loop_b64}"
single_data = f"data:audio/mp3;base64,{single_b64}"

with open(filepath, "r") as f:
    lines = f.readlines()

lines.append(f"\nconst RAIN_WINDOW_LOOP_MP3_B64 = '{loop_data}';\n")
lines.append(f"const RAIN_WINDOW_SINGLE_MP3_B64 = '{single_data}';\n")

with open(filepath, "w") as f:
    f.writelines(lines)

print("Done appending rain window mp3s")
