// server.js
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const sgMail = require("@sendgrid/mail");

const app = express();
const PORT = process.env.PORT || 3000; // Render daje port ovdje

// SendGrid API key
sgMail.setApiKey("TVOJ_SENDGRID_API_KEY"); // <- zamijeni sa stvarnim API key

// Folder za upload
const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const upload = multer({ dest: uploadFolder });

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Endpoint za formu
app.post("/submit", upload.array("files"), async (req, res) => {
  const { email, facebook, instagram, linkedin, twitter } = req.body;

  const attachments = (req.files || []).map(f => ({
    content: fs.readFileSync(f.path).toString("base64"),
    filename: f.originalname,
    type: f.mimetype,
    disposition: "attachment"
  }));

  const msg = {
    to: "g.bakterija@gmail.com",
    from: "g.bakterija@gmail.com",
    subject: "Novi upit s Viora forme",
    text: `Email: ${email}\nFacebook: ${facebook}\nInstagram: ${instagram}\nLinkedIn: ${linkedin}\nTwitter: ${twitter}`,
    attachments
  };

  try {
    await sgMail.send(msg);
    res.send("Podaci uspješno poslani!");
  } catch (err) {
    console.error("Greška pri slanju maila:", err);
    res.status(500).send("Greška pri slanju emaila.");
  }
});

// Pokreni server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
