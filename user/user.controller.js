const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/auth', authenticate);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}
