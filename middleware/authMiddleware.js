const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authMiddleware = async (req, res, next) => {
  const header = req.header('Authorization');
  if (!header) return res.status(401).json({ msg: 'Sem token, autorização negada' });
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ msg: 'Formato de token inválido' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });
    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Token inválido ou expirado' });
  }
};

exports.roleMiddleware = roles => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ msg: 'Acesso negado' });
  next();
};