from moviepy.editor import VideoFileClip, concatenate_videoclips, ColorClip, CompositeVideoClip
import os
from PIL import Image

Image.ANTIALIAS = Image.LANCZOS

# Helper: safe subclip
def safe_subclip(path, start, end):
    clip = VideoFileClip(path)
    real_end = min(end, clip.duration)
    return clip.subclip(start, real_end)

base = r"C:\Users\adem2\Github\adem-rguez.github.io\images\demos"

clips = [
    safe_subclip(base + r"\Basic-fr\basic-fr.webm", 1, 3),
    safe_subclip(base + r"\Saint-Gobain\saint-gobain.webm", 0, 2),
    safe_subclip(base + r"\PolyT\polyt demo.webm", 1, 5),
    safe_subclip(base + r"\Saint-Gobain\saint-gobain.webm", 8, 11),
    safe_subclip(base + r"\Basic-fr\basic-fr.webm", 4, 6),
    safe_subclip(base + r"\PolyT\polyt demo.webm", 16, 19),
]

# 1. Find biggest resolution
max_w = max(c.w for c in clips)
max_h = max(c.h for c in clips)

print("Final resolution:", max_w, "x", max_h)

# 2. Letterbox each clip into that resolution
normalized_clips = []

for c in clips:
    # Resize to fit inside max canvas
    scale = min(max_w / c.w, max_h / c.h)
    resized = c.resize(scale)

    # Black background
    bg = ColorClip(size=(max_w, max_h), color=(0,0,0)).set_duration(resized.duration)

    # Center video
    composed = CompositeVideoClip(
        [bg, resized.set_position("center")],
        size=(max_w, max_h)
    )

    normalized_clips.append(composed)

# Outro
outro = ColorClip(size=(max_w, max_h), color=(0,0,0)).set_duration(2)

# Final
final = concatenate_videoclips(normalized_clips + [outro])

final.write_videofile(
    "portfolio_showreel.mp4",
    fps=30,
    audio_codec="aac"
)
