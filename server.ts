import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory store for temporary ICS files
  const calendarStore = new Map<string, { content: string; expiry: number }>();

  // Cleanup old entries
  setInterval(() => {
    const now = Date.now();
    for (const [id, data] of calendarStore.entries()) {
      if (now > data.expiry) {
        calendarStore.delete(id);
      }
    }
  }, 60000);

  // API: Prepare Calendar
  app.post('/api/calendar/prepare', (req, res) => {
    const { icsContent } = req.body;
    if (!icsContent) {
      return res.status(400).json({ error: 'Missing content' });
    }

    const id = Math.random().toString(36).substring(2, 15);
    calendarStore.set(id, {
      content: icsContent,
      expiry: Date.now() + 300000 // 5 minutes
    });

    res.json({ id });
  });

  // API: Download Calendar
  app.get('/api/calendar/download/:id.ics', (req, res) => {
    const { id } = req.params;
    const data = calendarStore.get(id);

    if (!data) {
      return res.status(404).send('Calendar file expired or not found.');
    }

    res.setHeader('Content-Type', 'text/calendar;charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="david_tung_matrix.ics"`);
    res.send(data.content);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
