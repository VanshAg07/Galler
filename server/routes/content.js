const express = require('express');
const { body, validationResult } = require('express-validator');
const { readJSON, writeJSON } = require('../utils/fileStore');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Validation helper
function validateContent(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Invalid data provided',
      errors: errors.array() 
    });
  }
  next();
}

// Generic content field validators
const stringValidator = (field, maxLength = 5000) => 
  body(field)
    .optional()
    .isString().withMessage(`${field} must be a string`)
    .trim()
    .isLength({ max: maxLength }).withMessage(`${field} must be ${maxLength} characters or less`)
    .escape();

const urlValidator = (field) =>
  body(field)
    .optional()
    .isString().withMessage(`${field} must be a string`)
    .trim()
    .custom((value) => {
      if (value === '') return true; // Allow empty strings
      // Allow /uploads/ paths or full URLs
      if (value.startsWith('/uploads/')) return true;
      if (value.match(/^https?:\/\/.+/)) return true;
      throw new Error(`${field} must be a valid URL or /uploads/ path`);
    });

const arrayValidator = (field, maxItems = 50) =>
  body(field)
    .optional()
    .isArray().withMessage(`${field} must be an array`)
    .custom((arr) => arr.length <= maxItems)
    .withMessage(`${field} can have at most ${maxItems} items`);

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

router.put('/:section', 
  authMiddleware,
  [
    // Validate common string fields
    stringValidator('title', 200),
    stringValidator('heading', 200),
    stringValidator('subtitle', 500),
    stringValidator('description', 5000),
    stringValidator('tagline', 200),
    stringValidator('paragraph1', 5000),
    stringValidator('paragraph2', 5000),
    stringValidator('ctaText', 100),
    stringValidator('location', 200),
    stringValidator('name', 200),
    stringValidator('email', 200),
    stringValidator('phone', 50),
    stringValidator('address', 500),
    stringValidator('since', 20),
    
    // URL fields
    urlValidator('backgroundImage'),
    urlValidator('videoUrl'),
    urlValidator('image'),
    urlValidator('icon'),
    
    // Array fields
    arrayValidator('logos', 18),
    arrayValidator('items', 50),
    arrayValidator('stats', 20),
    arrayValidator('categories', 20),
    arrayValidator('members', 50),
    arrayValidator('benefits', 30),
    arrayValidator('images', 50),
    arrayValidator('steps', 20),
    arrayValidator('industries', 50),
    arrayValidator('capabilities', 50),
    arrayValidator('milestones', 50),
    
    // Nested object validation
    body('*.title').optional().isString().trim().isLength({ max: 200 }),
    body('*.description').optional().isString().trim().isLength({ max: 5000 }),
    body('*.name').optional().isString().trim().isLength({ max: 200 }),
    body('*.src').optional().isString().trim(),
    body('*.alt').optional().isString().trim().isLength({ max: 200 }),
    body('*.url').optional().isString().trim(),
    body('*.href').optional().isString().trim(),
  ],
  validateContent,
  (req, res) => {
    const content = readJSON('content.json');
    if (!content) {
      return res.status(500).json({ message: 'Content not found' });
    }

    const { section } = req.params;
    if (!content[section]) {
      return res.status(404).json({ message: `Section "${section}" not found` });
    }

    // Additional section-specific validation
    if (section === 'marquee' && Array.isArray(req.body.logos)) {
      if (req.body.logos.length > 18) {
        return res.status(400).json({ message: 'Marquee supports a maximum of 18 logos.' });
      }
      // Validate each logo object
      for (const logo of req.body.logos) {
        if (!logo.id || !logo.src || !logo.alt) {
          return res.status(400).json({ 
            message: 'Each logo must have id, src, and alt properties.' 
          });
        }
        if (typeof logo.id !== 'string' || typeof logo.src !== 'string' || typeof logo.alt !== 'string') {
          return res.status(400).json({ 
            message: 'Logo id, src, and alt must be strings.' 
          });
        }
      }
    }

    // Prevent prototype pollution
    const sanitizedBody = {};
    for (const key in req.body) {
      if (key !== '__proto__' && key !== 'constructor' && key !== 'prototype') {
        sanitizedBody[key] = req.body[key];
      }
    }

    content[section] = { ...content[section], ...sanitizedBody };
    writeJSON('content.json', content);

    res.json({ message: `Section "${section}" updated`, data: content[section] });
  }
);

module.exports = router;
