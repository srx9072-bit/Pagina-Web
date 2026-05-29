const router = require('express').Router();
const { getAll, update, remove } = require('../controllers/users.controller');
const auth = require('../middleware/auth');
const { superAdmin } = require('../middleware/admin');

router.use(auth, superAdmin);
router.get('/', getAll);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
