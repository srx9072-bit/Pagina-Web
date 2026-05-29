const router = require('express').Router();
const { getAll, trackByGuia, create, update, remove } = require('../controllers/packages.controller');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/track/:guia', trackByGuia);

router.use(auth);
router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', admin, remove);

module.exports = router;
