// server.js
const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Setup folder za upload
const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

// Multer konfiguracija
const upload = multer({ dest: uploadFolder });

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Nodemailer konfiguracija
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "g.bakterija@gmail.com",          // tvoj Gmail
    pass: "shum gdgx fxlu awza"            // tvoj App password
  }
});

// Endpoint za formu
app.post("/submit", upload.array("files"), (req, res) => {
  const { email, facebook, instagram, linkedin, twitter } = req.body;

  const attachments = (req.files || []).map(f => ({
    filename: f.originalname,
    path: f.path
  }));

  transporter.sendMail({
    from: "g.bakterija@gmail.com",
    to: "g.bakterija@gmail.com",
    subject: "Novi upit s Viora forme",
    text: `Email: ${email}\nFacebook: ${facebook}\nInstagram: ${instagram}\nLinkedIn: ${linkedin}\nTwitter: ${twitter}`,
    attachments
  }, (err, info) => {
    if (err) {
      console.error("Greška pri slanju emaila:", err);
      return res.status(500).send("Greška pri slanju emaila.");
    }
    console.log("Email poslan:", info.response);
    res.send("Podaci uspješno poslani!");
  });
});

// Pokreni server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
