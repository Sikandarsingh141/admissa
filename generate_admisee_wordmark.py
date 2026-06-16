from PIL import Image, ImageDraw, ImageFont
import os

# Output settings
WIDTH, HEIGHT = 3840, 2160
OUT_DIR = os.path.join(os.path.dirname(__file__), 'images')
os.makedirs(OUT_DIR, exist_ok=True)
OUT_PATH = os.path.join(OUT_DIR, 'AdmiSeeQ-wordmark-4k1.png')

# Colors
ORANGE_START = (255, 106, 26)   # #FF6A1A
ORANGE_END = (255, 122, 0)      # #FF7A00
MIDDLE_COLOR = (255, 255, 255)  # white for middle letters

# Use exact requested casing: capital S in the middle
TEXT = 'AdmiSeeQ'
BOTTOM_TEXT = 'SeeQ the World'
BOTTOM_TEXT_WIDTH_RATIO = 0.42
BOTTOM_TEXT_SCALE = 0.28

# Font search list (Windows common names) - fallbacks will be used
FONT_CANDIDATES = [
    'Poppins-ExtraBold.ttf',
    'Poppins-Black.ttf',
    'Poppins-Bold.ttf',
    'Gilroy-ExtraBold.ttf',
    'CircularStd-Bold.ttf',
    'segoeuib.ttf',        # Segoe UI Black / Bold
    'arialbd.ttf'
]

font_path = None
font_dir = r'C:\Windows\Fonts'
for name in FONT_CANDIDATES:
    p = os.path.join(font_dir, name)
    if os.path.isfile(p):
        font_path = p
        break

if font_path is None:
    # try system default provided by PIL
    try:
        font = ImageFont.load_default()
        print('Using PIL default font (suboptimal).')
    except Exception:
        raise RuntimeError('No suitable font found on system; please install Poppins or provide a font.')
else:
    # find a font size that fills roughly 72% of width
    fontsize = 900
    # create temporary image to measure
    img_tmp = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw_tmp = ImageDraw.Draw(img_tmp)
    font = ImageFont.truetype(font_path, fontsize)
    # adjust size down until fits target width
    target_width = int(WIDTH * 0.78)
    while True:
        bbox = draw_tmp.textbbox((0, 0), TEXT, font=font)
        w = bbox[2] - bbox[0]
        if w <= target_width or fontsize <= 80:
            break
        fontsize -= 8
        font = ImageFont.truetype(font_path, fontsize)

# Create canvas transparent
img = Image.new('RGBA', (WIDTH, HEIGHT), (255, 255, 255, 0))
draw = ImageDraw.Draw(img)

# Measure individual letters to compute positions
letters = list(TEXT)
letter_bboxes = [draw.textbbox((0, 0), ch, font=font) for ch in letters]
letter_widths = [b[2] - b[0] for b in letter_bboxes]
letter_heights = [b[3] - b[1] for b in letter_bboxes]
total_text_width = sum(letter_widths)
# add small kerning adjustment (negative for tighter)
kerning = -int(font.size * 0.04)
total_text_width += kerning * (len(letters) - 1)

start_x = (WIDTH - total_text_width) // 2
baseline_y = (HEIGHT - max(letter_heights)) // 2

# Helper: draw gradient-filled letter at a given x for a single-character mask
from PIL import ImageOps

def draw_gradient_letter(base_img, ch, x, y, font, start_col, end_col):
    # create mask for single letter
    mask = Image.new('L', base_img.size, 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.text((x, y), ch, font=font, fill=255)
    # compute bounding box of mask (crop)
    bbox = mask.getbbox()
    if bbox is None:
        return
    left, upper, right, lower = bbox
    w = right - left
    h = lower - upper
    # create gradient image same crop size
    grad = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(grad)
    for i in range(w):
        ratio = i / float(max(w - 1, 1))
        r = int(start_col[0] + (end_col[0] - start_col[0]) * ratio)
        g = int(start_col[1] + (end_col[1] - start_col[1]) * ratio)
        b = int(start_col[2] + (end_col[2] - start_col[2]) * ratio)
        gdraw.line([(i, 0), (i, h)], fill=(r, g, b, 255))
    # paste gradient onto base using the letter mask crop
    base_img.paste(grad, (left, upper), mask.crop((left, upper, right, lower)))

# Draw letters sequentially; A, S and Q get gradient, others get flat middle color
x = start_x
for i, ch in enumerate(letters):
    lw = letter_widths[i]
    # use capital/lowercase exactly as in TEXT
    if ch in ('A', 'S', 'Q'):
        draw_gradient_letter(img, ch, x, baseline_y, font, ORANGE_START, ORANGE_END)
    else:
        draw.text((x, baseline_y), ch, font=font, fill=MIDDLE_COLOR)
    x += lw + kerning

# Draw bottom caption text
bottom_font_size = int(font.size * BOTTOM_TEXT_SCALE)
bottom_font = ImageFont.truetype(font_path, bottom_font_size) if font_path else ImageFont.load_default()
bottom_bbox = draw.textbbox((0, 0), BOTTOM_TEXT, font=bottom_font)
bottom_width = bottom_bbox[2] - bottom_bbox[0]
bottom_height = bottom_bbox[3] - bottom_bbox[1]

bottom_x = (WIDTH - bottom_width) // 2
bottom_y = baseline_y + max(letter_heights) + int(HEIGHT * 0.10)

# draw bottom caption with orange Q only
for i, ch in enumerate(BOTTOM_TEXT):
    ch_width = draw.textbbox((0, 0), ch, font=bottom_font)[2]
    if ch == 'Q':
        draw.text((bottom_x, bottom_y), ch, font=bottom_font, fill=ORANGE_START)
    else:
        draw.text((bottom_x, bottom_y), ch, font=bottom_font, fill=MIDDLE_COLOR)
    bottom_x += ch_width

# Save PNG
img.save(OUT_PATH)
print('Saved wordmark to', OUT_PATH)
