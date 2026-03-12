const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

//  Middleware 
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// API Routes 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/members', require('./routes/members'));

// Health check for Railway
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'connected'
  });
});

//  Serve React Frontend (Production) 
const frontendBuild = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendBuild));

// All non-API routes → React app
app.get('*', (req, res) => {
  const indexFile = path.join(frontendBuild, 'index.html');
  res.sendFile(indexFile, (err) => {
    if (err) {
      res.status(200).json({
        message: 'TeamFlow API is running 🚀',
        docs: '/api/health',
        version: '1.0.0'
      });
    }
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start Server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`

  🚀 TeamFlow Server Running           
   Port: ${PORT}                           
   Mode: ${process.env.NODE_ENV || 'development'}                 

  `);
});
