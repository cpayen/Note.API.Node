const express = require('express');
const router = express.Router();
const notesService = require('./notes.service');

// routes
router.get('/tree', getTree);
router.get('/:dir1?/:dir2?/:dir3?', getDir);

module.exports = router;

function getTree(req, res, next) {
  notesService.getTree()
    .then(data => res.json(data))
    .catch(next);
}

function getDir(req, res, next) {
  const p = req.params;
  const rootDir = [p.dir1, p.dir2, p.dir3].filter(o => o !== undefined).join('/');
  notesService.getDir(rootDir)
    .then(data => res.json(data))
    .catch(next);
}
