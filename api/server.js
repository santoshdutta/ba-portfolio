const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/' || urlPath === '') urlPath = '/portfolio.html';

    const candidate = path.join(process.cwd(), urlPath);
    let filePath = null;

    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      filePath = candidate;
    } else {
      // Try without leading slash
      const alt = path.join(process.cwd(), urlPath.replace(/^\//, ''));
      if (fs.existsSync(alt) && fs.statSync(alt).isFile()) filePath = alt;
    }

    if (!filePath) {
      const dark = path.join(process.cwd(), 'Portfolio (Dark).html');
      if (fs.existsSync(dark)) filePath = dark;
    }

    if (!filePath) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const types = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.gif': 'image/gif',
      '.ico': 'image/x-icon',
      '.webp': 'image/webp'
    };

    const contentType = types[ext] || 'application/octet-stream';
    const data = fs.readFileSync(filePath);
    res.setHeader('Content-Type', contentType);
    res.end(data);
  } catch (err) {
    res.statusCode = 500;
    res.end('Server error');
  }
};
