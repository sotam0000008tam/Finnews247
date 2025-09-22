import os
from PIL import Image

# Thư mục chứa ảnh gốc
input_dir = "images_duyet"
# Thư mục lưu ảnh sau khi resize
output_dir = "images_resized"

# Tạo thư mục output nếu chưa có
os.makedirs(output_dir, exist_ok=True)

# Kích thước chuẩn muốn resize (16:9, đẹp cho thumbnail)
TARGET_SIZE = (1200, 675)

def resize_and_crop(image_path, output_path, size):
    with Image.open(image_path) as img:
        # Chuyển về RGB nếu cần (JPEG không hỗ trợ alpha)
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGB")

        # Resize theo tỉ lệ
        img_ratio = img.width / img.height
        target_ratio = size[0] / size[1]

        if img_ratio > target_ratio:
            new_height = size[1]
            new_width = int(new_height * img_ratio)
        else:
            new_width = size[0]
            new_height = int(new_width / img_ratio)

        img = img.resize((new_width, new_height), Image.LANCZOS)

        # Crop cho đúng size
        left = (img.width - size[0]) / 2
        top = (img.height - size[1]) / 2
        right = (img.width + size[0]) / 2
        bottom = (img.height + size[1]) / 2
        img = img.crop((left, top, right, bottom))

        # Giữ nguyên định dạng gốc
        ext = os.path.splitext(output_path)[1].lower()
        if ext in [".jpg", ".jpeg"]:
            img = img.convert("RGB")  # Bắt buộc cho JPEG
            img.save(output_path, "JPEG", quality=85, optimize=True)
        elif ext == ".png":
            img.save(output_path, "PNG", optimize=True)
        elif ext == ".webp":
            img.save(output_path, "WEBP", quality=85, method=6)
        else:
            img.save(output_path)  # fallback

def main():
    for filename in os.listdir(input_dir):
        if filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, filename)
            resize_and_crop(input_path, output_path, TARGET_SIZE)
            print(f"✅ {filename} đã resize & optimize → {output_dir}/")

if __name__ == "__main__":
    main()
