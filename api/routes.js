const controllers = require('./controllers.js');
const express = require('express');

const router = express.Router();

router.get('/', controllers.hello);

// write your routes
router.get('/items', controllers.getItems);
router.get('/items/:id', controllers.getItem);
router.post('/items', controllers.createItem);
router.put('/items/:id', controllers.updItem);
router.delete('/items/:id', controllers.deleteItem);

module.exports = router;
