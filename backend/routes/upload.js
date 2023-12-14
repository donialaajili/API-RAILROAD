import express from 'express';
import multer from 'multer';
import path from 'path';

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/images'); // Dossier où stocker les images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route pour gérer le téléchargement d'image
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ imagePath: `/images/${req.file.filename}` });
});

// Route pour servir les images statiques
app.use('/images', express.static('upload/images'));

// Route pour récupérer une image spécifique par son nom de fichier
app.get('/images/:filename', (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, 'upload/images', filename));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
