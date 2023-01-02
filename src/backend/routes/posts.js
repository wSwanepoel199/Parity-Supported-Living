const express = require('express');
const postController = require('../controllers/post.controller');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, postController.all);
router.post('/create', auth, postController.create);

module.exports = router;