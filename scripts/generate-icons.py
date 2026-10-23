#!/usr/bin/env python3
"""توليد أيقونات تطبيق «وصفات قمر» (PWA) برمجيًا من غير أي مكتبات خارجية.

الهوية: خلفية أخضر زيتوني #34483D، هلال برتقالي #C9653F، ونجمة كريمي
#F8F5EE. بنرسم بدقة 4x وبنصغّر (supersampling) عشان الحواف تبقى ناعمة.
الاستخدام: python3 scripts/generate-icons.py
"""
import struct
import zlib
import os

BG = (0x34, 0x48, 0x3D)      # أخضر زيتوني
ORANGE = (0xC9, 0x65, 0x3F)  # برتقالي الهوية
CREAM = (0xF8, 0xF5, 0xEE)   # كريمي


def render(size: int, pad_ratio: float) -> list:
    """بيرجع بكسلات RGB بحجم size×size. pad_ratio = هامش أمان للماسكابل."""
    ss = 4
    S = size * ss
    cx = cy = S / 2
    # الهلال: قرص برتقالي بينقص منه قرص مزاح بلون الخلفية
    r_main = S * (0.30 if pad_ratio == 0 else 0.26)
    cut_r = r_main * 0.86
    cut_dx, cut_dy = r_main * 0.48, -r_main * 0.34
    star_r = S * 0.045
    star_x, star_y = cx + r_main * 0.78, cy - r_main * 0.92
    rows = []
    for y in range(size):
        row = bytearray()
        for x in range(size):
            r_acc = g_acc = b_acc = 0
            for sy in range(ss):
                for sx in range(ss):
                    px, py = x * ss + sx + 0.5, y * ss + sy + 0.5
                    col = BG
                    d_main = ((px - cx) ** 2 + (py - cy) ** 2) ** 0.5
                    if d_main <= r_main:
                        d_cut = (
                            (px - (cx + cut_dx)) ** 2 + (py - (cy + cut_dy)) ** 2
                        ) ** 0.5
                        if d_cut > cut_r:
                            col = ORANGE
                    d_star = ((px - star_x) ** 2 + (py - star_y) ** 2) ** 0.5
                    if d_star <= star_r:
                        col = CREAM
                    r_acc += col[0]
                    g_acc += col[1]
                    b_acc += col[2]
            n = ss * ss
            row += bytes((r_acc // n, g_acc // n, b_acc // n))
        rows.append(b"\x00" + bytes(row))
    return rows


def write_png(path: str, size: int, pad_ratio: float = 0.0) -> None:
    raw = b"".join(render(size, pad_ratio))

    def chunk(kind: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + kind
            + data
            + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)
        )

    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(png)
    print("wrote", path, len(png), "bytes")


if __name__ == "__main__":
    root = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
    write_png(os.path.join(root, "icon-192.png"), 192)
    write_png(os.path.join(root, "icon-512.png"), 512)
    write_png(os.path.join(root, "icon-maskable-512.png"), 512, pad_ratio=0.1)
    write_png(os.path.join(root, "apple-touch-icon.png"), 180)
