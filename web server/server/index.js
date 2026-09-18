const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const Database = require("better-sqlite3");

const db = new Database("./pictures.db");

app.use(express.static(path.join(__dirname, "../frontend")));


app.get("/api/latest", (req, res) => {
    const img = db.prepare(`
        SELECT * FROM images
        ORDER BY date DESC, time DESC
        LIMIT 1
    `).get();

    if (!img) {
        return res.status(404).json({ error: "No images found" });
    }
    res.json(img);
})
app.get("/api/latest/:type", (req, res) => {
    const { type } = req.params;

    const allowedTypes = ["filepath_full", "filepath_medium", "filepath_thumbnail"];

    if(!allowedTypes.includes(type)) {
        return res.status(400).json({ error: "Invalid type" });
    }

    const img = db.prepare(`
        SELECT ${type} FROM images
        ORDER BY date DESC, time DESC
        LIMIT 1
    `).get();

    if (!img) {
        return res.status(404).json({ error: "No images found" });
    }
    res.json(img[type]);
})

app.get("/api/:date", (req, res) => {
    const { date } = req.params;

    const img = db.prepare(`
        SELECT filepath_thumbnail, time FROM images
        WHERE date = ?
        ORDER BY date DESC, time DESC
    `).all(date);

    if (!img) {
        return res.status(404).json({ error: "No images found" });
    }

    res.json(img);
})

app.get("/", (request, response) => {
    fs.readFile('/Users/petarbabic/Library/Mobile Documents/com~apple~CloudDocs/Faks/SpaceMaster/Aalto/Projects/All-sky-camera/web server/frontend/index.html', 'utf8', (err, html) => {
        if(err) {
            response.status(500).send(err);
        }
        response.send(html);
    })
});

app.get("/api/metadata/:date/:time", (req, res) => {
    const { date, time } = req.params;

    const data = db.prepare(`
        SELECT aurora, cloudy, meteor
        FROM images
        WHERE date = @date AND time = @time
    `).get({ date, time });

    if (!data) {
        return res.status(404).json({ error: "No images found" });
    }

    res.json(data);
});

app.get("/api/:path/:date/:time", (req, res) => {
    const { path, date, time } = req.params;

    const allowedTypes = ["filepath_full", "filepath_medium", "filepath_thumbnail"];

    if(!allowedTypes.includes(path)) {
        return res.status(400).json({ error: "Invalid type" });
    }

    const imgs = db.prepare(`
        SELECT ${path}
        FROM images
        WHERE date = @date AND time = @time
    `).all({ date, time });

    res.json(imgs.map(row => row[path]));
});

app.use("/images", express.static(path.join(__dirname, "/images")));


app.listen(process.env.PORT || 3000, () => console.log("App avaiable on http://localhost:3000")) 