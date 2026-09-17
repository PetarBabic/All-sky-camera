from pathlib import Path
import sqlite3
import re

IMAGE_ROOT = Path("web server/server/images/")
DB_PATH = Path("web server/server/pictures.db")

TIME_PATTERN = re.compile(r"^(\d{2})(\d{2})-(\d{2})\.jpg$", re.IGNORECASE)

conn = sqlite3.connect(DB_PATH)

conn.execute("""
CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,

    filepath_full TEXT NOT NULL UNIQUE,
    filepath_medium TEXT NOT NULL,
    filepath_thumbnail TEXT NOT NULL,

    aurora INTEGER NOT NULL DEFAULT 0,
    cloudy INTEGER NOT NULL DEFAULT 0,
    meteor INTEGER NOT NULL DEFAULT 0
)
""")

for path in IMAGE_ROOT.glob("*/*/??*"):
    # Only process files in full-sized directories
    if path.parent.name != "full":
        continue

    if path.suffix.lower() != ".jpg":
        continue

    # Expected:
    # images/2026-09-17/full-sized/2305-42.jpg

    date = path.parent.parent.name
    filename = path.name

    match = TIME_PATTERN.match(filename)

    if not match:
        print(f"Skipping invalid filename: {path}")
        continue

    hour, minute, second = match.groups()
    time = f"{hour}:{minute}:{second}"

    filepath_full = str(path).split("server/")[2]
    filepath_medium = str(
        path.parent.parent / "medium" / filename
    ).split("server/")[2]
    filepath_thumbnail = str(
        path.parent.parent / "thumbnail" / filename
    ).split("server/")[2]

    conn.execute("""
        INSERT OR IGNORE INTO images (
            date,
            time,
            filepath_full,
            filepath_medium,
            filepath_thumbnail
        )
        VALUES (?, ?, ?, ?, ?)
    """, (
        date,
        time,
        filepath_full,
        filepath_medium,
        filepath_thumbnail
    ))

conn.commit()
conn.close()