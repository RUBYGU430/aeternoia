from pytubefix import YouTube
yt = YouTube('https://youtu.be/VZ30TQa_Rl0')
stream = yt.streams.filter(only_audio=True).first()
print(stream.url)
