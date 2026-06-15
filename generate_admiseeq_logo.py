from PIL import Image, ImageDraw, ImageFont
import os

width, height = 3840, 2160
out_dir = os.path.join(os.path.dirname(__file__), 'images')
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, 'admiseeq-logo-4k.png')

# Gradient background colors
start_color = (11, 13, 31)
end_color = (16, 26, 58)
img = Image.new('RGBA', (width, height), start_color)
draw = ImageDraw.Draw(img)
for y in range(height):
    ratio = y / (height - 1)
    r = int(start_color[0] + (end_color[0] - start_color[0]) * ratio)
    g = int(start_color[1] + (end_color[1] - start_color[1]) * ratio)
    b = int(start_color[2] + (end_color[2] - start_color[2]) * ratio)
    draw.line([(0, y), (width, y)], fill=(r, g, b, 255))

# Font selection
font_dir = r'C:\Windows\Fonts'
wordmark_font_path = os.path.join(font_dir, 'segoeuib.ttf')
tagline_font_path = os.path.join(font_dir, 'segoeui.ttf')
if not os.path.isfile(wordmark_font_path):
    wordmark_font_path = os.path.join(font_dir, 'arialbd.ttf')
if not os.path.isfile(tagline_font_path):
    tagline_font_path = os.path.join(font_dir, 'arial.ttf')

wordmark_font = ImageFont.truetype(wordmark_font_path, 300)
tagline_font = ImageFont.truetype(tagline_font_path, 72)

# Branding text
part1 = 'Admi'
part2 = 'See'
part3 = 'Q'
tagline = 'DREEM · APPLY · GO'
color1 = (255, 255, 255, 255)
color2 = (255, 106, 26, 255)
color_tag = (110, 110, 122, 255)

# Measure wordmark
part1_bbox = draw.textbbox((0, 0), part1, font=wordmark_font)
part2_bbox = draw.textbbox((0, 0), part2, font=wordmark_font)
part3_bbox = draw.textbbox((0, 0), part3, font=wordmark_font)
part1_width = part1_bbox[2] - part1_bbox[0]
part2_width = part2_bbox[2] - part2_bbox[0]
part3_width = part3_bbox[2] - part3_bbox[0]
wordmark_width = part1_width + part2_width + part3_width
wordmark_height = max(part1_bbox[3] - part1_bbox[1], part2_bbox[3] - part2_bbox[1], part3_bbox[3] - part3_bbox[1])

# Draw wordmark centered
x = (width - wordmark_width) // 2
y = (height - wordmark_height - 110) // 2
for text, color, width_text in [(part1, color1, part1_width), (part2, color2, part2_width), (part3, color1, part3_width)]:
    draw.text((x, y), text, font=wordmark_font, fill=color)
    x += width_text

# Draw tagline with wide letter spacing
spacing = 16
chars = list(tagline)
char_widths = [draw.textbbox((0, 0), ch, font=tagline_font)[2] - draw.textbbox((0, 0), ch, font=tagline_font)[0] for ch in chars]
span_width = sum(char_widths) + spacing * (len(chars) - 1)
xt = (width - span_width) // 2
yt = y + wordmark_height + 80
for ch, ch_width in zip(chars, char_widths):
    draw.text((xt, yt), ch, font=tagline_font, fill=color_tag)
    xt += ch_width + spacing

img.save(out_path)
print(f'Saved logo to: {out_path}')
