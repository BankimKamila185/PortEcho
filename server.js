import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from frontend-html directory
app.use(express.static(path.join(__dirname, 'frontend-html')));

// Serve static files from frontend-html/src directory
app.use('/src', express.static(path.join(__dirname, 'frontend-html/src')));

// Serve static files from frontend-html/assets directory
app.use('/assets', express.static(path.join(__dirname, 'frontend-html/assets')));

// Route for the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend-html/src/index.html'));
});

// Route for the dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend-html/src/pages/dashboard.html'));
});

// Catch-all route to handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend-html/src/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Frontend server running on http://localhost:${PORT}`);
});