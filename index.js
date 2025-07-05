import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// File path for data storage
const DATA_FILE = path.join(process.cwd(), 'data.json');

// Function to load data from file
const loadData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return default data
    console.log('No existing data file found, using default data');
    return [];
  }
};

// Function to save data to file
const saveData = async (data) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    console.log('Data saved to file successfully');
  } catch (error) {
    console.error('Error saving data to file:', error);
  }
};

// In-memory storage for items (loaded from file)
let items = await loadData();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static('public'));

// Basic route - redirect to client
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Example API endpoint with async/await
app.get('/api/data', async (req, res) => {
  try {
    // Return the current items list
    const data = {
      total: items.length,
      items: items,
      timestamp: new Date().toISOString()
    };
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST endpoint example
app.post('/api/data', async (req, res) => {
  const { m, u } = req.body;
  
  // Validation
  if (!m || typeof m !== 'string') {
    return res.status(400).json({ error: 'Field "m" is required and must be a string' });
  }
  
  if (!u || (u !== 'u' && u !== 'i')) {
    return res.status(400).json({ error: 'Field "u" is required and must be either "u" or "i"' });
  }
  
  // Create new item
  const newItem = {
    id: items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1,
    m: m.trim(),
    u: u,
    t: new Date().toISOString()
  };
  
  // Add to items array
  items.push(newItem);
  
  // Save to file
  await saveData(items);
  
  res.status(201).json({
    message: 'Item created successfully',
    item: newItem,
    total: items.length
  });
});

// GET individual item by ID
app.get('/api/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  const item = items.find(item => item.id === id);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  res.json(item);
});

// DELETE item by ID
app.delete('/api/data/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  const deletedItem = items.splice(itemIndex, 1)[0];
  
  // Save to file after deletion
  await saveData(items);
  
  res.json({
    message: 'Item deleted successfully',
    item: deletedItem,
    total: items.length
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📡 API endpoint: http://localhost:${PORT}/api/data`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();