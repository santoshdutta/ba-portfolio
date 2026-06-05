const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  if (req.path === '/' || req.path === '') {
    const preferred = path.join(__dirname, 'portfolio.html');
    res.sendFile(preferred, (err) => {
      if (err) {
        res.sendFile(path.join(__dirname, 'Portfolio (Dark).html'));
      }
    });
    return;
  }

  const filePath = path.join(__dirname, req.path);
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).send('Not found');
  });
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
