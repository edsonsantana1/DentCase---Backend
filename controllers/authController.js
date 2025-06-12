const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const gerarMatricula = require('../utils/gerarMatricula');

exports.register = async (req, res) => {
  const { nome, email, senha, role } = req.body;
  try {
    if (await User.findOne({ email })) return res.status(400).json({ msg: 'Usuário já existe' });
    const matricula = await gerarMatricula();
    const hash = await bcrypt.hash(senha, 10);
    const user = await User.create({ nome, email, senha: hash, role, matricula });

    const payload = { user: { id: user.id, role: user.role } };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      accessToken,
      refreshToken,
      user: { id: user.id, nome: user.nome, email: user.email, role: user.role, matricula }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

exports.login = async (req, res) => {
  const { matricula, senha } = req.body;
  try {
    const user = await User.findOne({ matricula });
    if (!user) return res.status(401).json({ msg: 'Credenciais inválidas' });
    if (!await bcrypt.compare(senha, user.senha)) return res.status(401).json({ msg: 'Credenciais inválidas' });

    user.refreshToken = null;
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, nome: user.nome, email: user.email, role: user.role, matricula: user.matricula }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ msg: 'Refresh Token não fornecido' });
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) return res.status(403).json({ msg: 'Refresh Token inválido' });

    const accessToken = jwt.sign({ user: { id: user.id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Refresh Token expirado ou inválido' });
  }
};