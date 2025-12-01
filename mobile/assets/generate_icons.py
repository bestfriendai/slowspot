#!/usr/bin/env python3
"""
Generate modern, professional meditation app icons
Slow Spot - Premium Meditation App Icon Generator
"""
from PIL import Image, ImageDraw, ImageFilter
import math

def create_premium_gradient(size):
    """Create a beautiful multi-stop gradient"""
    image = Image.new('RGB', size)

    # Premium purple gradient
    color_top = (99, 102, 241)     # Indigo-500
    color_middle = (139, 92, 246)  # Violet-500
    color_bottom = (168, 85, 247)  # Purple-500

    for y in range(size[1]):
        ratio = y / size[1]
        # Smooth easing
        ratio = ratio * ratio * (3 - 2 * ratio)

        if ratio < 0.5:
            r = ratio * 2
            r_val = int(color_top[0] * (1-r) + color_middle[0] * r)
            g_val = int(color_top[1] * (1-r) + color_middle[1] * r)
            b_val = int(color_top[2] * (1-r) + color_middle[2] * r)
        else:
            r = (ratio - 0.5) * 2
            r_val = int(color_middle[0] * (1-r) + color_bottom[0] * r)
            g_val = int(color_middle[1] * (1-r) + color_bottom[1] * r)
            b_val = int(color_middle[2] * (1-r) + color_bottom[2] * r)

        for x in range(size[0]):
            image.putpixel((x, y), (r_val, g_val, b_val))

    return image

def draw_petal(draw, cx, cy, angle, length, width, color):
    """Draw a single smooth petal"""
    rad = math.radians(angle)

    points = []
    steps = 60

    for i in range(steps + 1):
        t = i / steps
        # Distance along petal
        dist = t * length
        # Width varies - widest at 40% from base
        w = width * math.sin(t * math.pi) * (1.0 if t < 0.5 else (1 - (t - 0.5) * 0.3))

        # Position along petal axis
        px = cx + math.cos(rad) * dist
        py = cy + math.sin(rad) * dist

        # Perpendicular offset for width
        perp = rad + math.pi / 2
        points.append((px + math.cos(perp) * w, py + math.sin(perp) * w))

    # Return along other side
    for i in range(steps, -1, -1):
        t = i / steps
        dist = t * length
        w = width * math.sin(t * math.pi) * (1.0 if t < 0.5 else (1 - (t - 0.5) * 0.3))

        px = cx + math.cos(rad) * dist
        py = cy + math.sin(rad) * dist

        perp = rad - math.pi / 2
        points.append((px + math.cos(perp) * w, py + math.sin(perp) * w))

    if len(points) > 2:
        draw.polygon(points, fill=color)

def draw_lotus(draw, center_x, center_y, size, color):
    """Draw elegant 3-petal lotus"""

    # Side petals first (behind)
    petal_length = size * 0.38
    petal_width = size * 0.14

    # Left petal
    draw_petal(draw, center_x, center_y,
               angle=235, length=petal_length * 0.85, width=petal_width * 0.9, color=color)

    # Right petal
    draw_petal(draw, center_x, center_y,
               angle=305, length=petal_length * 0.85, width=petal_width * 0.9, color=color)

    # Center petal (on top, pointing up)
    draw_petal(draw, center_x, center_y,
               angle=270, length=petal_length, width=petal_width, color=color)

    # Small center dot to clean up
    dot_r = size * 0.025
    draw.ellipse([center_x - dot_r, center_y - dot_r,
                  center_x + dot_r, center_y + dot_r], fill=color)

def create_app_icon(size, filename):
    """Create main app icon"""
    image = create_premium_gradient((size, size))
    image = image.convert('RGBA')
    draw = ImageDraw.Draw(image, 'RGBA')

    center = size // 2
    lotus_size = int(size * 0.70)

    draw_lotus(draw, center, center, lotus_size, color=(255, 255, 255, 255))

    image = image.filter(ImageFilter.SMOOTH)
    image.save(filename, 'PNG', quality=100)
    print(f"Created {filename} ({size}x{size})")

def create_adaptive_icon(size, filename):
    """Create Android adaptive icon"""
    image = create_premium_gradient((size, size))
    image = image.convert('RGBA')
    draw = ImageDraw.Draw(image, 'RGBA')

    center = size // 2
    lotus_size = int(size * 0.55)

    draw_lotus(draw, center, center, lotus_size, color=(255, 255, 255, 255))

    image = image.filter(ImageFilter.SMOOTH)
    image.save(filename, 'PNG', quality=100)
    print(f"Created {filename} ({size}x{size})")

def create_splash_icon(size, filename):
    """Create splash screen icon"""
    image = create_premium_gradient((size, size))
    image = image.convert('RGBA')
    draw = ImageDraw.Draw(image, 'RGBA')

    center = size // 2
    lotus_size = int(size * 0.50)

    draw_lotus(draw, center, center, lotus_size, color=(255, 255, 255, 255))

    image = image.filter(ImageFilter.SMOOTH)
    image.save(filename, 'PNG', quality=100)
    print(f"Created {filename} ({size}x{size})")

def create_favicon(filename):
    """Create favicon"""
    size = 48
    image = create_premium_gradient((size, size))
    image = image.convert('RGBA')
    draw = ImageDraw.Draw(image, 'RGBA')

    center = size // 2
    lotus_size = int(size * 0.75)

    draw_lotus(draw, center, center, lotus_size, color=(255, 255, 255, 255))

    image.save(filename, 'PNG', quality=100)
    print(f"Created {filename} ({size}x{size})")

def create_notification_icon(filename):
    """Create notification icon"""
    size = 96
    image = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image, 'RGBA')

    center = size // 2
    lotus_size = int(size * 0.80)

    draw_lotus(draw, center, center, lotus_size, color=(255, 255, 255, 255))

    image.save(filename, 'PNG', quality=100)
    print(f"Created {filename} ({size}x{size})")

if __name__ == '__main__':
    import os

    script_dir = os.path.dirname(os.path.abspath(__file__))

    print("Generating Slow Spot premium app icons...")
    print("=" * 50)

    create_app_icon(1024, os.path.join(script_dir, 'icon.png'))
    create_adaptive_icon(1024, os.path.join(script_dir, 'adaptive-icon.png'))
    create_splash_icon(1024, os.path.join(script_dir, 'splash-icon.png'))
    create_favicon(os.path.join(script_dir, 'favicon.png'))
    create_notification_icon(os.path.join(script_dir, 'notification-icon.png'))

    print("=" * 50)
    print("All icons generated!")
