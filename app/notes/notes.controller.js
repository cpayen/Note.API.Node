const express = require('express');
const router = express.Router();
const notesService = require('./notes.service');

// routes
router.get('/tree', getTree);
router.get('/list', getList);
router.get('/list/*', getList);

module.exports = router;

function getTree(req, res, next) {
  notesService.getTree()
    .then(data => res.json(data))
    .catch(next);
}

function getList(req, res, next) {
  const rootDir = req.params[0];
  notesService.getDir(rootDir)
    .then(data => res.json(data))
    .catch(next);
}
