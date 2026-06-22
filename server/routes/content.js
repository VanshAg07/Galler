const express = require('express');
const { readJSON, writeJSON } = require('../utils/fileStore');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const content = readJSON('content.json');
  if (!content) {
    return res.status(500).json({ message: 'Content not found' });
  }
  res.json(content);
});

router.get('/:section', (req, res) => {
  const content = readJSON('content.json');
  if (!content) {
    return res.status(500).json({ message: 'Content not found' });
  }

  const section = content[req.params.section];
  if (!section) {
    return res.status(404).json({ message: `Section "${req.params.section}" not found` });
  }

  res.json(section);
});

router.put('/:section', authMiddleware, (req, res) => {
  const content = readJSON('content.json');
  if (!content) {
    return res.status(500).json({ message: 'Content not found' });
  }

  const { section } = req.params;
  if (!content[section]) {
    return res.status(404).json({ message: `Section "${section}" not found` });
  }

  if (section === 'marquee' && Array.isArray(req.body.logos) && req.body.logos.length > 18) {
    return res.status(400).json({ message: 'Marquee supports a maximum of 18 logos.' });
  }

  content[section] = { ...content[section], ...req.body };
  writeJSON('content.json', content);

  res.json({ message: `Section "${section}" updated`, data: content[section] });
});

/* ──────────────────────────────────────────────────────────
   Blog-posts routes (blog-posts.json)
────────────────────────────────────────────────────────── */
const blogPostsRouter = express.Router();

blogPostsRouter.get('/', (req, res) => {
  const data = readJSON('blog-posts.json');
  if (!data) return res.status(500).json({ message: 'blog-posts.json not found' });
  res.json(data);
});

blogPostsRouter.put('/', authMiddleware, (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ message: 'Body must be an array' });
  }
  writeJSON('blog-posts.json', req.body);
  res.json({ message: 'blog-posts updated' });
});

module.exports = { contentRouter: router, blogPostsRouter };
