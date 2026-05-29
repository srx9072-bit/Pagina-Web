const router = require('express').Router();
const { calculate, getAll, create } = require('../controllers/quotes.controller');
const auth = require('../middleware/auth');

router.get('/calculate', calculate);

router.use(auth);
router.get('/', getAll);
router.post('/', create);

module.exports = router;
