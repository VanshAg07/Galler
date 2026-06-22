const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { readJSON, writeJSON } = require('../utils/fileStore');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const resumesDir = path.join(__dirname, '..', 'private', 'resumes');

if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, resumesDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `resume-${uniqueSuffix}${ext}`);
  },
});

const resumeFilter = (_req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
    return;
  }

  cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
};

const uploadResume = multer({
  storage,
  fileFilter: resumeFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const VALID_CATEGORIES = ['engineering', 'sales', 'operations', 'manufacturing', 'support'];
const VALID_JOB_TYPES = ['Full Time', 'PPO'];

const CATEGORY_LABELS = {
  engineering: 'Engineering',
  sales: 'Sales & Marketing',
  operations: 'Operations',
  manufacturing: 'Manufacturing',
  support: 'Support',
};

function getJobs() {
  return readJSON('careers-jobs.json') || [];
}

function saveJobs(data) {
  writeJSON('careers-jobs.json', data);
}

function getGeneralSubmissions() {
  return readJSON('resume-submissions.json') || [];
}

function saveGeneralSubmissions(data) {
  writeJSON('resume-submissions.json', data);
}

function getJobApplications() {
  return readJSON('job-applications.json') || [];
}

function saveJobApplications(data) {
  writeJSON('job-applications.json', data);
}

function getDescriptionPoints(job) {
  if (Array.isArray(job.descriptionPoints)) {
    return job.descriptionPoints.map((point) => String(point).trim()).filter(Boolean);
  }
  if (job.description) {
    return [String(job.description).trim()].filter(Boolean);
  }
  return [];
}

function validateJobBody(body, partial = false) {
  const title = String(body.title || '').trim();
  const descriptionPoints = getDescriptionPoints(body);
  const location = String(body.location || '').trim();
  const experience = String(body.experience || '').trim();
  const type = String(body.type || '').trim();
  const category = String(body.category || '').trim();

  if (!partial || body.title !== undefined) {
    if (!title || title.length > 200) return 'Please enter a valid job title.';
  }
  if (!partial || body.descriptionPoints !== undefined || body.description !== undefined) {
    if (descriptionPoints.length === 0) return 'Please add at least one description point.';
    if (descriptionPoints.some((point) => point.length > 1000)) {
      return 'Each description point must be 1000 characters or less.';
    }
    if (descriptionPoints.length > 50) return 'A job can have at most 50 description points.';
  }
  if (!partial || body.location !== undefined) {
    if (!location || location.length > 200) return 'Please enter a valid location.';
  }
  if (!partial || body.experience !== undefined) {
    if (!experience || experience.length > 100) return 'Please enter valid experience.';
  }
  if (!partial || body.type !== undefined) {
    if (!VALID_JOB_TYPES.includes(type)) return 'Job type must be Full Time or PPO.';
  }
  if (!partial || body.category !== undefined) {
    if (!VALID_CATEGORIES.includes(category)) return 'Please select a valid category.';
  }

  return null;
}

function normalizeJob(body, existing = {}) {
  const category = String(body.category ?? existing.category ?? 'engineering').trim();
  const descriptionPoints = getDescriptionPoints({ ...existing, ...body });
  return {
    id: existing.id || crypto.randomUUID(),
    title: String(body.title ?? existing.title ?? '').trim(),
    descriptionPoints,
    location: String(body.location ?? existing.location ?? '').trim(),
    experience: String(body.experience ?? existing.experience ?? '').trim(),
    type: String(body.type ?? existing.type ?? 'Full Time').trim(),
    category,
    department: CATEGORY_LABELS[category] || category,
  };
}

function handleResumeUpload(req, res, onSuccess) {
  uploadResume.single('resume')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Max size is 5MB.' });
      }
      return res.status(400).json({ message: err.message });
    }
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const fullName = String(req.body.fullName || '').trim();
    const email = String(req.body.email || '').trim();
    const phone = String(req.body.phone || '').trim();

    if (!fullName || fullName.length > 200) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: 'Please enter your full name.' });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (phone.length > 50) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: 'Please check the form and try again.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please attach your resume file.' });
    }

    return onSuccess({ fullName, email, phone, file: req.file });
  });
}

router.get('/jobs', (_req, res) => {
  const jobs = getJobs().map((job) => {
    const normalized = normalizeJob(job, job);
    return {
      ...normalized,
      department: normalized.department || CATEGORY_LABELS[normalized.category] || normalized.category,
    };
  });
  res.json(jobs);
});

router.post('/jobs', authMiddleware, (req, res) => {
  const job = normalizeJob(req.body);
  const error = validateJobBody(job);
  if (error) return res.status(400).json({ message: error });

  const jobs = getJobs();
  jobs.unshift(job);
  saveJobs(jobs);
  res.status(201).json({ message: 'Job opening added', data: job });
});

router.put('/jobs/:id', authMiddleware, (req, res) => {
  const jobs = getJobs();
  const index = jobs.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Job opening not found' });
  }

  const updated = normalizeJob(req.body, jobs[index]);
  const error = validateJobBody(updated);
  if (error) return res.status(400).json({ message: error });

  jobs[index] = updated;
  saveJobs(jobs);
  res.json({ message: 'Job opening updated', data: updated });
});

router.delete('/jobs/:id', authMiddleware, (req, res) => {
  const jobs = getJobs();
  const index = jobs.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Job opening not found' });
  }

  jobs.splice(index, 1);
  saveJobs(jobs);
  res.json({ message: 'Job opening deleted' });
});

router.post('/resume', (req, res) => {
  handleResumeUpload(req, res, ({ fullName, email, phone, file }) => {
    const message = String(req.body.message || '').trim();
    if (message.length > 2000) {
      fs.unlink(file.path, () => {});
      return res.status(400).json({ message: 'Please check the form and try again.' });
    }

    const submission = {
      id: crypto.randomUUID(),
      type: 'general',
      fullName,
      email,
      phone,
      message,
      resumeFileName: file.filename,
      resumeOriginalName: file.originalname,
      resumeSize: file.size,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const submissions = getGeneralSubmissions();
    submissions.unshift(submission);
    saveGeneralSubmissions(submissions);

    return res.status(201).json({
      message: 'Your resume was submitted successfully.',
      id: submission.id,
    });
  });
});

router.post('/apply', (req, res) => {
  handleResumeUpload(req, res, ({ fullName, email, phone, file }) => {
    const jobId = String(req.body.jobId || '').trim();
    const jobs = getJobs();
    const job = jobs.find((item) => item.id === jobId);

    if (!job) {
      fs.unlink(file.path, () => {});
      return res.status(400).json({ message: 'Selected job opening is no longer available.' });
    }

    const application = {
      id: crypto.randomUUID(),
      jobId: job.id,
      jobTitle: job.title,
      jobDescription: getDescriptionPoints(job).join('\n'),
      jobCategory: job.category,
      jobLocation: job.location,
      jobExperience: job.experience,
      jobType: job.type,
      fullName,
      email,
      phone,
      resumeFileName: file.filename,
      resumeOriginalName: file.originalname,
      resumeSize: file.size,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const applications = getJobApplications();
    applications.unshift(application);
    saveJobApplications(applications);

    return res.status(201).json({
      message: 'Your application was submitted successfully.',
      id: application.id,
    });
  });
});

router.get('/resumes', authMiddleware, (_req, res) => {
  res.json(getGeneralSubmissions());
});

router.get('/applications', authMiddleware, (_req, res) => {
  res.json(getJobApplications());
});

router.patch('/resumes/:id/read', authMiddleware, (req, res) => {
  const submissions = getGeneralSubmissions();
  const index = submissions.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  submissions[index].read = true;
  saveGeneralSubmissions(submissions);
  res.json(submissions[index]);
});

router.patch('/applications/:id/read', authMiddleware, (req, res) => {
  const applications = getJobApplications();
  const index = applications.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Application not found' });
  }

  applications[index].read = true;
  saveJobApplications(applications);
  res.json(applications[index]);
});

router.get('/resumes/:id/download', authMiddleware, (req, res) => {
  const submissions = getGeneralSubmissions();
  const submission = submissions.find((item) => item.id === req.params.id);
  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  const filePath = path.join(resumesDir, submission.resumeFileName);
  if (!filePath.startsWith(resumesDir) || !fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Resume file not found' });
  }

  res.download(filePath, submission.resumeOriginalName);
});

router.get('/applications/:id/download', authMiddleware, (req, res) => {
  const applications = getJobApplications();
  const application = applications.find((item) => item.id === req.params.id);
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const filePath = path.join(resumesDir, application.resumeFileName);
  if (!filePath.startsWith(resumesDir) || !fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Resume file not found' });
  }

  res.download(filePath, application.resumeOriginalName);
});

module.exports = router;
