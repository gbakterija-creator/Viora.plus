const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware za čitanje JSON i form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Postavljanje foldera za statičke fajlove (index.html, style.css, script.js)
app.use(express.static(path.join(__dirname)));

// Folder za uploadane fajlove
const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

// Multer konfiguracija za file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Ruta za submit forme
app.post('/submit', upload.array('chats'), (req, res) => {
  const { email, facebook, instagram, linkedin, twitter } = req.body;
  const files = req.files.map(f => f.filename);

  // Sprema podatke u JSON datoteku (dodaje novi unos)
  const dataFile = path.join(__dirname, 'submissions.json');
  let submissions = [];
  if (fs.existsSync(dataFile)) {
    submissions = JSON.parse(fs.readFileSync(dataFile));
  }
  submissions.push({ email, facebook, instagram, linkedin, twitter, files, date: new Date() });
  fs.writeFileSync(dataFile, JSON.stringify(submissions, null, 2));

  res.json({ success: true, message: 'Upitnik poslan!' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
