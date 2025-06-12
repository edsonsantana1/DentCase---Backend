const bcrypt = require('bcryptjs');
const User = require('../models/User');
const gerarMatricula = require('../utils/gerarMatricula');

exports.createUser = async (req, res) => {
  const { nome, email, senha, role } = req.body;
  try {
    if (await User.findOne({ email })) return res.status(400).json({ msg: 'Usuário já existe' });
    const matricula = await gerarMatricula();
    const hash = await bcrypt.hash(senha, 10);
    const user = await User.create({ nome, email, senha: hash, role, matricula });
    res.status(201).json({ msg: 'Usuário criado com sucesso', user: { id: user.id, nome: user.nome, email: user.email, role: user.role, matricula } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

exports.getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) filter.$or = [
    { nome: new RegExp(req.query.search, 'i') },
    { email: new RegExp(req.query.search, 'i') },
    { matricula: new RegExp(req.query.search, 'i') }
  ];
  const sort = req.query.sort || '-createdAt';
  try {
    const users = await User.find(filter)
      .select('-senha -refreshToken')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-senha -refreshToken');
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.senha) updates.senha = await bcrypt.hash(updates.senha, 10);
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-senha -refreshToken');
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });
    res.json({ msg: 'Usuário deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};