# Ảnh Không Gian Vũ Trụ - Space Image Gallery

Một website hiển thị ảnh với giao diện không gian vũ trụ, mỗi ảnh được hiển thị như một ngôi sao có thể zoom và tương tác.

## Tính năng

- 🌟 Hiển thị ảnh như các ngôi sao trong không gian
- 🔍 Zoom in/out với mouse wheel hoặc controls
- 🖱️ Kéo thả để di chuyển trong không gian
- 🖼️ Click vào ngôi sao để xem ảnh full size
- ✨ Hiệu ứng ánh sáng và animation
- 📱 Responsive design cho mobile
- 🎵 Hiệu ứng âm thanh (tùy chọn)

## Cách sử dụng

1. **Thêm ảnh của bạn:**
   - Đặt các file ảnh vào folder `images/`
   - Hoặc cập nhật mảng `sampleImages` trong file `script.js`

2. **Mở website:**
   - Mở file `index.html` trong trình duyệt
   - Hoặc chạy local server để load ảnh từ folder local

3. **Tương tác:**
   - **Click** vào ngôi sao để xem ảnh full size
   - **Kéo thả** để di chuyển trong không gian
   - **Scroll chuột** để zoom in/out
   - **Buttons** ở góc trên trái để điều khiển zoom
   - **ESC** để đóng modal ảnh

## Cấu trúc file

```
birthday2025/
├── index.html          # File HTML chính
├── style.css           # CSS styling và animations
├── script.js           # JavaScript logic
├── images/             # Folder chứa ảnh
│   └── (đặt ảnh ở đây)
└── README.md           # Hướng dẫn này
```

## Customization

### Thay đổi ảnh
Để sử dụng ảnh của bạn thay vì ảnh mẫu, cập nhật mảng `sampleImages` trong `script.js`:

```javascript
const sampleImages = [
    'images/anh1.jpg',
    'images/anh2.jpg',
    'images/anh3.jpg',
    // ...thêm ảnh của bạn
];
```

### Thay đổi màu sắc
Cập nhật CSS variables trong `style.css`:

```css
:root {
    --star-color: #fff;
    --glow-color: rgba(255, 255, 255, 0.5);
    --background: #000;
}
```

### Thêm nhiều hiệu ứng
- Constellation lines: Đường kết nối giữa các ngôi sao gần nhau
- Particle effects: Hiệu ứng hạt trong không gian
- Sound effects: Âm thanh khi tương tác

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Tips

- Sử dụng ảnh có tỷ lệ vuông (1:1) để hiển thị tốt nhất trong ngôi sao tròn
- Kích thước ảnh nên từ 400x400px trở lên để chất lượng tốt khi zoom
- Có thể thêm nhiều ảnh hơn bằng cách cập nhật mảng `sampleImages`

## Local Server (cho ảnh local)

Để load ảnh từ folder local, bạn cần chạy một local server:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (nếu có npx)
npx serve

# Live Server extension trong VS Code
```

Sau đó truy cập: `http://localhost:8000`
