const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redirectionFilter = function (req, res, next) {
  const date = new Date();
  const url = `${req.protocol}:\/\/${req.hostname}:${port}${req.url}`;

  if (req.get('X-Forwarded-Proto') === 'http') {
    const redirectTo = `https:\/\/${req.hostname}${req.url}`;
    console.log(`${date} Redirecting ${url} --> ${redirectTo}`);
    res.redirect(301, redirectTo);
  } else {
    next();
  }
};

app.get('/*', redirectionFilter);

// allows express to serve ziped files
app.get('*.js', function (req, res, next) {
  if (req.url === "/service-worker.js") {
    next();
  } else {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    next();
  }
});

// Your static pre-build assets folder
app.use(express.static(path.join(__dirname, '..', 'build')));

// Root Redirects to the pre-build assets
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'build'));
});

// Any Page Redirects to the pre-build assets folder index.html that // will load the react app
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'build/index.html'));
});

app.listen(port, () => {
  console.log("Server is running on port: ", port);
});