require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const seed = require('./seed');

const authRoutes = require('./routes/auth');
const { contentRouter, blogPostsRouter } = require('./routes/content');
const uploadRoutes = require('./routes/upload');
const contactRoutes = require('./routes/contact');
const careersRoutes = require('./routes/careers');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRouter);
app.use('/api/blog-posts', blogPostsRouter);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/careers', careersRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function start() {
  await seed();

  app.listen(PORT, () => {
    console.log(`\n🚀 Galler CMS server running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
  });
}

start();
