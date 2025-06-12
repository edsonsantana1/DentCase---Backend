const User = require('../models/User');

async function gerarMatricula() {
  const prefixo = 'MAT';
  const ano = new Date().getFullYear().toString().slice(-2);
  const total = await User.countDocuments();
  const seq = String(total + 1).padStart(6, '0');
  return `${prefixo}${ano}${seq}`;
}

module.exports = gerarMatricula;