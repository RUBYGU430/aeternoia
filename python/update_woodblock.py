import base64
import os

mp3_path = "/Users/m2macbookair/Desktop/RUBYGU's AI art/에테리아 치유센터 ASMR/지유프로젝트/game_sound/효과음/wooden_block.mp3"
js_path = "/Users/m2macbookair/Desktop/RUBYGU's AI art/에테리아 치유센터 ASMR/지유프로젝트/audio_base64.js"

with open(mp3_path, "rb") as f:
    encoded = base64.b64encode(f.read()).decode('utf-8')

with open(js_path, "a") as f:
    f.write(f'\nwindow.woodenBlockBase64 = "data:audio/mp3;base64,{encoded}";\n')

print("Done appending wooden block sound to audio_base64.js")
