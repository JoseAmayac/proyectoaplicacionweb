const router = require('express').Router();
const commentsController = require('../controllers/comments.controller');

router.get('/', commentsController.index);
router.post('/', commentsController.store);

module.exports = router;