// Tiny Express server that mounts the static site under /withdrawals/*
// so the on-disk paths match the public URL (redo.com/withdrawals/...).
// Cloudflare proxies redo.com/withdrawals/* to this Railway origin with
// the path preserved.

const express = require('express');
const path = require('path');

const app = express();
const BASE = '/withdrawals';
const PORT = process.env.PORT || 3000;

// Health check for Railway
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// Bare root redirects to the subpath so local dev "just works"
app.get('/', (_req, res) => res.redirect(302, BASE + '/'));

// Serve static files under /withdrawals
app.use(BASE, express.static(path.join(__dirname), {
  extensions: ['html'],
  index: 'index.html',
}));

// SPA-style fallback: any unknown path under /withdrawals serves the landing page
app.get(BASE + '/*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Withdrawals landing page listening on 0.0.0.0:${PORT}${BASE}/`);
});
