const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, png, gif, webp, svg)'), false);
  }
};

const videoFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed (mp4, webm, mov)'), false);
  }
};

const documentFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'model/gltf-binary',
    'model/gltf+json',
    'application/octet-stream',
    'application/zip',
    'application/x-zip-compressed',
  ];
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.glb', '.gltf', '.obj', '.stl', '.step', '.stp', '.zip'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only document and 3D model files are allowed (pdf, doc, docx, glb, gltf, obj, stl, step, stp, zip)'), false);
  }
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DOCUMENT_SIZE = 100 * 1024 * 1024; // 100MB

const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: MAX_IMAGE_SIZE }
});

const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: { fileSize: 100 * 1024 * 1024 }
});

const uploadDocument = multer({
  storage,
  fileFilter: documentFilter,
  limits: { fileSize: MAX_DOCUMENT_SIZE }
});

router.post('/', authMiddleware, (req, res) => {
  uploadImage.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Max size is 10MB.' });
      }
      return res.status(400).json({ message: err.message });
    }
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ message: 'File uploaded successfully', url: fileUrl });
  });
});

router.post('/video', authMiddleware, (req, res) => {
  uploadVideo.single('video')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Max size is 100MB.' });
      }
      return res.status(400).json({ message: err.message });
    }
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ message: 'Video uploaded successfully', url: fileUrl });
  });
});

router.post('/document', authMiddleware, (req, res) => {
  uploadDocument.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Max size is 100MB.' });
      }
      return res.status(400).json({ message: err.message });
    }
    if (err) {
      return res.status(400).json({ message: err.message || 'Upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      message: 'File uploaded successfully',
      url: fileUrl,
      fileName: req.file.originalname,
    });
  });
});

router.delete('/',
  authMiddleware,
  [
    body('url')
      .notEmpty().withMessage('URL is required')
      .isString().withMessage('URL must be a string')
      .trim()
      .matches(/^\/uploads\/[a-zA-Z0-9\-_.]+\.[a-zA-Z0-9]+$/)
      .withMessage('Invalid file URL format')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Invalid URL provided',
        errors: errors.array() 
      });
    }

    const { url } = req.body;
    
    // Additional security check
    if (!url.startsWith('/uploads/')) {
      return res.status(400).json({ message: 'Only uploaded files can be deleted' });
    }

    const filename = path.basename(url);
    
    // Prevent path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ message: 'Invalid filename' });
    }

    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const filePath = path.join(uploadsDir, filename);

    // Ensure the resolved path is within uploads directory
    if (!filePath.startsWith(uploadsDir)) {
      return res.status(400).json({ message: 'Invalid file path' });
    }

    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        return res.status(500).json({ message: 'Failed to delete file' });
      }
      res.json({ message: 'File deleted successfully' });
    });
  }
);

module.exports = router;
