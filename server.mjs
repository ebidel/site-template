// import fs from 'fs';
// import url from 'url';
// const URL = url.URL;
import express from 'express';
// import firebaseAdmin from 'firebase-admin';
import nunjucks from 'nunjucks';
import markdown from 'nunjucks-markdown';
import marked from 'marked';
import highlight from 'highlight.js';

import serverHelpers from './server-helpers.mjs';

const DEV = process.env.DEV || false;
const PORT = process.env.PORT || 8080;
const app = express();

marked.setOptions({
  gfm: true,
  headerIds: true,
  tables: true,
  highlight: function(code, lang) {
    return highlight.highlightAuto(code).value;
  },
});

const env = nunjucks.configure(['./templates'], {
  autoescape: true,
  express: app,
  watch: DEV,
});
env.addFilter('limit', (arr, limit) => arr.slice(0, limit));

markdown.register(env, marked);

app.use(serverHelpers.forceSSL);
// app.use(serverHelpers.enableCors);
// app.use(serverHelpers.addRequestHelpers);

// Try resource as static, first.
app.use(express.static('public', {extensions: ['html', 'htm']}));
app.use(express.static('node_modules'));

// Establish sw as top level URL.
app.get('/sw.js', (req, res, next) => {
  res.sendFile('/js/sw.js', {root: './public'});
});

// Provide some data to all subsequent handlers.
app.use(function includeData(req, res, next) {
  res.locals.data = {
    DEV,
    posts: [{title: 'Post title'}, {title: 'Post title2'}],
  };
  next();
});

// Handle / dynamically.
app.get('/', (req, res, next) => {
  return res.render(`pages/index.html`, res.locals.data);
});

app.get('/:page', (req, res, next) => {
  return res.render(`pages/${req.params.page}.html`, res.locals.data);
});

app.use(serverHelpers.errorHandler); // catch all.

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`); /* eslint-disable-line */
  console.log('Press Ctrl+C to quit.'); /* eslint-disable-line */
});

