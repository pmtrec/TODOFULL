import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB for images
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image' && !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    if (file.fieldname === 'file' && !file.mimetype.startsWith('audio/')) {
      return cb(new Error('Only audio files are allowed'));
    }
    cb(null, true);
  }
});

// In-memory storage for simplicity (in production, use a database)
let users = [];
let tasks = [];
let chats = [];

// Load data from files if exist
const usersFile = path.join(__dirname, 'data', 'users.json');
const tasksFile = path.join(__dirname, 'data', 'tasks.json');
const chatsFile = path.join(__dirname, 'data', 'chats.json');

if (fs.existsSync(usersFile)) users = JSON.parse(fs.readFileSync(usersFile));
if (fs.existsSync(tasksFile)) tasks = JSON.parse(fs.readFileSync(tasksFile));
if (fs.existsSync(chatsFile)) chats = JSON.parse(fs.readFileSync(chatsFile));

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
    role: 'user',
    createdAt: new Date().toISOString()
  };

  users.push(user);
  saveData();

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({ id: user.id, name: user.name, email: user.email });
});

// Task routes
app.get('/api/tasks', authenticateToken, (req, res) => {
  const userTasks = tasks.filter(task =>
    task.creatorId === req.user.id ||
    task.assignedUsers.some(assigned => assigned.userId === req.user.id)
  );
  res.json(userTasks);
});

app.get('/api/tasks/all', authenticateToken, (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', authenticateToken, (req, res) => {
  const { title, description, startDate, endDate, priority } = req.body;

  if (!title || !description || !startDate || !endDate) {
    return res.status(400).json({ error: 'Title, description, startDate, and endDate are required' });
  }

  const task = {
    id: tasks.length + 1,
    title,
    description,
    startDate,
    endDate,
    priority: priority || 'medium',
    image: null,
    audio: null,
    status: 'todo',
    creatorId: req.user.id,
    creatorName: users.find(u => u.id === req.user.id)?.name || 'Utilisateur',
    assignedUsers: [{ userId: req.user.id, permissions: ['read', 'write', 'modify'] }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.push(task);
  saveData();
  res.status(201).json(task);
});

app.put('/api/tasks/:id', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (!task) return res.status(404).json({ error: 'Task not found' });

  // Check permissions
  const userAssignment = task.assignedUsers.find(a => a.userId === req.user.id);
  if (!userAssignment || !userAssignment.permissions.includes('write')) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  Object.assign(task, req.body);
  saveData();
  res.json(task);
});

app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });

  const task = tasks[taskIndex];
  if (task.creatorId !== req.user.id) {
    return res.status(403).json({ error: 'Only creator can delete task' });
  }

  tasks.splice(taskIndex, 1);
  saveData();
  res.status(204).send();
});

// Assign task
app.post('/api/tasks/:id/assign', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const { userId, permissions } = req.body;

  const task = tasks.find(t => t.id === taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  if (task.creatorId !== req.user.id) {
    return res.status(403).json({ error: 'Only creator can assign tasks' });
  }

  const existingAssignment = task.assignedUsers.find(a => a.userId === userId);
  if (existingAssignment) {
    existingAssignment.permissions = permissions;
  } else {
    task.assignedUsers.push({ userId, permissions });
  }

  saveData();
  res.json(task);
});

// Chat routes
app.get('/api/tasks/:id/chat', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskChats = chats.filter(c => c.taskId === taskId);
  res.json(taskChats);
});

app.post('/api/tasks/:id/chat', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const { message } = req.body;

  const chat = {
    id: chats.length + 1,
    taskId,
    userId: req.user.id,
    userName: users.find(u => u.id === req.user.id)?.name || 'Utilisateur',
    message,
    createdAt: new Date().toISOString()
  };

  chats.push(chat);
  saveData();
  res.status(201).json(chat);
});

// File upload endpoints
app.patch('/api/tasks/:id/image', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const { imageBase64 } = req.body;

  const task = tasks.find(t => t.id === taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  if (task.creatorId !== req.user.id) {
    return res.status(403).json({ error: 'Only creator can upload images' });
  }

  task.image = `data:image/jpeg;base64,${imageBase64}`;
  saveData();
  res.json({ imageUrl: task.image });
});

app.post('/upload-vocal', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Convert buffer to base64
  const base64 = req.file.buffer.toString('base64');
  const audioUrl = `data:${req.file.mimetype};base64,${base64}`;

  res.json({ path: audioUrl });
});

// Save data to files
function saveData() {
  if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
  }

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
  fs.writeFileSync(chatsFile, JSON.stringify(chats, null, 2));
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});