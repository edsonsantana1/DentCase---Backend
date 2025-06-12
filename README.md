markdown
# DentCase Backend - Sistema de Gerenciamento Odonto-Legal 🦷

![GitHub stars](https://img.shields.io/github/stars/edsonsantana1/DentCase---Backend?style=social)
![GitHub issues](https://img.shields.io/github/issues/edsonsantana1/DentCase---Backend)
![GitHub license](https://img.shields.io/github/license/edsonsantana1/DentCase---Backend)

Backend do sistema DentCase, desenvolvido para gerenciamento de casos e evidências em perícias odontolegais. Fornece API RESTful para o frontend com autenticação segura e armazenamento de dados.

## 🚀 Funcionalidades Principais

- **Autenticação Segura**: JWT com roles (admin, perito, assistente)
- **CRUD Completo**: Para casos e evidências
- **Upload de Arquivos**: Armazenamento de imagens, PDFs e raios-X
- **Geolocalização**: Armazenamento de coordenadas para evidências
- **Validação de Dados**: Schemas robustos para todos os modelos
- **API Documentada**: Endpoints organizados e padronizados

## 🛠 Tecnologias Utilizadas

### Core
- Node.js
- Express.js
- MongoDB (banco de dados)
- Mongoose (ODM)

### Segurança
- JWT (JSON Web Tokens)
- Bcrypt (hash de senhas)
- Helmet (proteção HTTP)
- CORS (controle de acesso)

### Desenvolvimento
- Nodemon (reinício automático)
- Dotenv (gerenciamento de variáveis)
- Postman (testes de API)

## 📦 Instalação e Configuração

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/edsonsantana1/DentCase---Backend.git
   cd DentCase---Backend
Instale as dependências:

bash
npm install
Configure as variáveis de ambiente:
Crie um arquivo .env na raiz do projeto com:

env
MONGODB_URI=sua_string_de_conexao_mongodb
JWT_SECRET=sua_chave_secreta_jwt
PORT=3000
UPLOAD_FOLDER=./uploads
MAX_FILE_SIZE=10485760 # 10MB
Inicie o servidor:

bash
npm start
# Para desenvolvimento:
npm run dev
🌐 Endpoints Principais
Autenticação
POST /api/auth/register - Registrar novo usuário

POST /api/auth/login - Login de usuário existente

Casos
GET /api/cases - Listar todos os casos

POST /api/cases - Criar novo caso

GET /api/cases/:id - Obter caso específico

PUT /api/cases/:id - Atualizar caso

DELETE /api/cases/:id - Remover caso

Evidências
POST /api/evidences - Adicionar evidência

GET /api/evidences/case/:caseId - Listar evidências de um caso

DELETE /api/evidences/:id - Remover evidência

🔑 Exemplo de Uso com Postman
Registrar Admin
Endpoint: POST http://localhost:3000/api/auth/register

Headers:

text
Content-Type: application/json
Body (raw JSON):

json
{
  "username": "admin",
  "password": "senhaSegura123",
  "role": "admin"
}
Resposta Esperada:

json
{
  "message": "Usuário registrado com sucesso",
  "userId": "5f8d...",
  "role": "admin"
}
Criar Caso (autenticado)
Endpoint: POST http://localhost:3000/api/cases

Headers:

text
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_JWT
Body:

json
{
  "title": "Identificação vítima acidente",
  "description": "Vítima masculino, ~30 anos, fraturas dentárias",
  "status": "aberto"
}
🛡️ Autenticação e Autorização
Todos os endpoints (exceto login/registro) requerem JWT válido

Tokens devem ser enviados no header Authorization como Bearer <token>

Roles controlam acesso:

Admin: Todas operações

Perito: Criar/editar casos e evidências

Assistente: Apenas leitura e adição de evidências

📊 Modelo de Dados
Diagram
Code
erDiagram
    USER ||--o{ CASE : cria
    USER {
        string _id
        string username
        string passwordHash
        string role
    }
    CASE ||--o{ EVIDENCE : contém
    CASE {
        string _id
        string title
        string description
        string status
        date openDate
        date closeDate
        ref userId
    }
    EVIDENCE {
        string _id
        string type
        string description
        date dateTime
        string fileUrl
        string geoLocation
        ref caseId
    }







📈 Próximas Atualizações
Documentação Swagger/OpenAPI

Integração com serviços de armazenamento em nuvem

Endpoints para geração de laudos PDF

Sistema de notificações por email

Logs detalhados de atividades

🤝 Como Contribuir
Faça um fork do projeto

Crie sua branch (git checkout -b feature/nova-feature)

Commit suas mudanças (git commit -m 'Adiciona nova funcionalidade')

Push para a branch (git push origin feature/nova-feature)

Abra um Pull Request

📄 Licença
Este projeto está licenciado sob a MIT License.

Desenvolvido de desenvolvimento [Colocaaqui o gt da equipe] © 2023 - Todos os direitos reservados
