const express = require('express');
const router = express.Router();
const notesService = require('./notes.service');

// routes
router.get('/tree', getTree);

module.exports = router;

function getTree(req, res, next) {
  notesService.getTree()
    .then(dirs => res.json(dirs))
    .catch(next);
}
