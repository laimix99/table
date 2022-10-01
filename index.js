import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

const PORT = 3010;

async function createServer() {
  const app = express();
  app.use(express.json());

  const supabase = createClient(
    'https://xxcmbphpaqpmvvdfsyqy.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4Y21icGhwYXFwbXZ2ZGZzeXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ2MTczODEsImV4cCI6MTk4MDE5MzM4MX0.nazG0HCGiFklswoJP_Yr8au4ZT2nvuJj9WrqjfB89F8'
  );

  const vite = await createViteServer();

  // User routes
  app.post('/api/items', async (req, res) => {
    const ops = req.body?.ops || [];
    console.log('/api/items ops', ops);

    if (ops.length > 6) {
      return res.json({
        error: 'Too much ops!',
      });
    }

    const items = await ops.reduce((acc, f) => {
      if (f.op === 'contains') acc.filter(f.field, 'ilike', `%${f.value}%`);
      if (f.op === 'gt') acc.filter(f.field, 'gt', f.value);
      if (f.op === 'sort') acc.order(f.field, { ascending: f.value });

      return acc;
    }, supabase.from('items').select('*'));

    res.json(items);
  });

  app.get('/api/max', (req, res) => {
    res.json({ message: 'hello', query: req.query });
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  app.listen(PORT, () => console.log(`App on port ${PORT}`));
}

createServer();
