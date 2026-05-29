const router = require('express').Router();
const { getDashboard } = require('../controllers/stats.controller');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/', auth, admin, getDashboard);

module.exports = router;
