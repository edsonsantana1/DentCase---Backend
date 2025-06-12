const express = require('express');
const router = express.Router();
const { isValidObjectId } = require('mongoose');
const { createUser, getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, roleMiddleware(['admin']), createUser);

router.get('/:id', authMiddleware, (req, res, next) => {
  if (!isValidObjectId(req.params.id)) return res.status(400).json({ msg: 'ID inválido' });
  next();
}, getUser);

router.get('/', authMiddleware, roleMiddleware(['admin']), getAllUsers);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);

module.exports = router;