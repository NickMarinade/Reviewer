const controllers = require('./controllers.js');
const express = require('express');

const router = express.Router();

router.get('/', controllers.hello);

// write your routes
router.get('/items', controllers.getItems);
router.get('/items/:id', controllers.getItem);

module.exports = router;
