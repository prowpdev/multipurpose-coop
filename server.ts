import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db/database';
import { initialSeedData } from './server/db/seed';
import apiRouter from './server/routes/api';

export const app = express();
export const PORT = 3000;

app.use(cors());
app.use(express.json());

// Initialize seed database if empty
const currentData = db.load();
if (!currentData.cooperatives || currentData.cooperatives.length === 0) {
  console.log('[Database] Bootstrapping initial cooperative seed database...');
  db.resetToSeed(initialSeedData);
}

// Mount REST API routes first
app.use('/api', apiRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    cooperative: 'Mayap Care Agriculture Cooperative',
    architecture: 'Configuration-Driven Full-Stack Engine (Express + Vite)',
    timestamp: new Date().toISOString()
  });
});

export async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Development mode: attach Vite as middleware for instant hot reload and SPA fallback
    const vite = await createViteServer({
      root: process.cwd(),
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve pre-compiled static assets from dist/
    const distPath = path.join(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');

    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    }

    app.get('*', (req, res) => {
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(503).send(`
          <!DOCTYPE html>
          <html>
            <head><title>Build Required</title></head>
            <body style="font-family: sans-serif; padding: 2rem; text-align: center;">
              <h2>Production Build Not Found</h2>
              <p>Please run <code>npm run build</code> first to generate the production assets in <code>dist/</code>.</p>
            </body>
          </html>
        `);
      }
    });
  }

  return new Promise((resolve) => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Server] CoopFlex Core Server running on http://0.0.0.0:${PORT}`);
      console.log(`[Server] API available at http://0.0.0.0:${PORT}/api`);
      resolve(app);
    });
  });
}

// Auto-start server when executed
startServer().catch((err) => {
  console.error('[Server] Failed to start server:', err);
});

