// FIX: Import Application, Request, and Response types directly from express for explicit typing.
// This avoids potential conflicts with global types.
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
// FIX: Import randomUUID for generating unique IDs.
import { randomUUID } from 'crypto';

// FIX: Explicitly type the app instance as Application for better type inference.
const app: Application = express();
const PORT = process.env.PORT || 3001;

// Determine paths based on the current working directory, which is more reliable
// across dev and prod environments than __dirname.
// `npm run dev` runs from /server, `npm run start` runs from /
const isDev = process.cwd().endsWith('server');
const dbPath = isDev 
    ? path.join(process.cwd(), 'db.json')
    : path.join(process.cwd(), 'server', 'db.json');


interface Project {
  id: string;
  // This is a placeholder; the actual type has more properties
}

interface IncomeEntry {
  id: string;
  date: string; // Used for sorting
  // This is a placeholder; the actual type has more properties
}

interface DB {
  projects: Project[];
  incomes: IncomeEntry[];
}

// Middleware
app.use(cors());
// FIX: Use express.json() middleware to parse JSON bodies. This resolves the overload error.
app.use(express.json());

// --- Database Helper Functions ---
const readDB = async (): Promise<DB> => {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    // If the file doesn't exist or is corrupted, return a default structure
    return { projects: [], incomes: [] };
  }
};

const writeDB = async (data: DB): Promise<void> => {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to database:', error);
  }
};

// --- API Routes ---

// -- Projects --
// FIX: Add explicit Request and Response types to route handlers.
app.get('/api/projects', async (req: Request, res: Response) => {
  const db = await readDB();
  res.json(db.projects);
});

// FIX: Add explicit Request and Response types, and use randomUUID for new project IDs.
app.post('/api/projects', async (req: Request, res: Response) => {
  const db = await readDB();
  const newProject = { ...req.body, id: randomUUID() };
  db.projects.unshift(newProject); // Add to the beginning
  await writeDB(db);
  res.status(201).json(newProject);
});

// FIX: Add explicit Request and Response types to route handlers.
app.put('/api/projects/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedProject = req.body;
  const db = await readDB();
  const index = db.projects.findIndex(p => p.id === id);

  if (index !== -1) {
    db.projects[index] = { ...updatedProject, id };
    await writeDB(db);
    res.json(db.projects[index]);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
});

// FIX: Add explicit Request and Response types to route handlers.
app.delete('/api/projects/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const db = await readDB();
  const filteredProjects = db.projects.filter(p => p.id !== id);

  if (filteredProjects.length !== db.projects.length) {
    db.projects = filteredProjects;
    await writeDB(db);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
});

// -- Incomes --
// FIX: Add explicit Request and Response types to route handlers.
app.get('/api/incomes', async (req: Request, res: Response) => {
  const db = await readDB();
  res.json(db.incomes);
});

// FIX: Add explicit Request and Response types, and use randomUUID for new income IDs.
app.post('/api/incomes', async (req: Request, res: Response) => {
  const db = await readDB();
  const newIncome = { ...req.body, id: randomUUID() };
  db.incomes.push(newIncome);
  // Sort by date descending
  db.incomes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  await writeDB(db);
  res.status(201).json(newIncome);
});

// FIX: Add explicit Request and Response types to route handlers.
app.delete('/api/incomes/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const db = await readDB();
    const filteredIncomes = db.incomes.filter(i => i.id !== id);
  
    if (filteredIncomes.length !== db.incomes.length) {
      db.incomes = filteredIncomes;
      await writeDB(db);
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Income entry not found' });
    }
});

// This block should be after all API routes.
// It serves the static frontend files when in a production environment.
if (process.env.NODE_ENV === 'production') {
    // In production, the start script runs from the project root.
    const buildPath = process.cwd();
    // FIX: Use express.static middleware to serve static files. This resolves the overload error.
    app.use(express.static(buildPath));

    // For any other request, serve the index.html file
    // FIX: Add explicit Request and Response types to route handlers.
    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
}


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
