const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const notesRoutes = require('./routes/notesRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/notes', notesRoutes);

//Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

//Error Handler (must come last) 
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Notes App Server  →  http://localhost:${PORT}`);
  console.log(`Environment       →  ${process.env.NODE_ENV}`);
});

module.exports = app;
