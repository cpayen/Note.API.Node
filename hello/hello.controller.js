const express = require('express');
const router = express.Router();

// routes
router.get('/:what', sayHello);

module.exports = router;

function sayHello(req, res, next) {
    return res.json({ message: `Hello ${req.params.what}!` });
}
