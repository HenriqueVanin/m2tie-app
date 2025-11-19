# Revisão das APIs Backend

## 📋 Sumário

1. [API de Autenticação](#api-de-autenticação)
2. [API de Dashboards](#api-de-dashboards)
3. [API de Questões](#api-de-questões)
4. [API de Respostas](#api-de-respostas)
5. [API de Usuários](#api-de-usuários)

---

## API de Autenticação

### ✅ Pontos Corretos

1. **Validações completas**: Email format, senha confirmação, campos obrigatórios
2. **Segurança**: Bcrypt para hash de senha com salt (12 rounds)
3. **JWT**: Geração de token com dados do usuário
4. **Documentação Swagger**: Bem estruturada com exemplos

## ⚠️ Ajustes Recomendados

### 1. **Segurança do JWT**

```javascript
// ❌ Problema atual
const token = jwt.sign({ ... }, process.env.JWT_SECRET);

// ✅ Recomendação: Adicionar expiração
const token = jwt.sign(
  { name: user.name, userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' } // ou '24h', '30d', etc
);
```

### 2. **Tratamento de Erros**

```javascript
// ❌ Problema atual
catch (error) {
  res.status(500).json({ error }); // Expõe detalhes internos
}

// ✅ Recomendação
catch (error) {
  console.error('Erro no registro:', error);
  res.status(500).json({
    error: 'Erro ao processar requisição. Tente novamente.'
  });
}
```

### 3. **Validação de Email Aprimorada**

```javascript
// ❌ Regex atual permite alguns casos inválidos
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ✅ Regex mais robusta
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
```

### 4. **Validação de Senha**

```javascript
// ✅ Adicionar requisitos mínimos de senha
if (password.length < 6) {
  return res.status(400).json({
    error: "A senha deve ter no mínimo 6 caracteres",
  });
}

// Opcional: Validar força da senha
const hasUpperCase = /[A-Z]/.test(password);
const hasLowerCase = /[a-z]/.test(password);
const hasNumbers = /\d/.test(password);

if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
  return res.status(400).json({
    error: "A senha deve conter letras maiúsculas, minúsculas e números",
  });
}
```

### 5. **Sanitização de Inputs**

```javascript
// ✅ Instalar: npm install validator
const validator = require("validator");

// Sanitizar e validar
const email = validator.normalizeEmail(req.body.email);
const name = validator.escape(validator.trim(req.body.name));
```

### 6. **Rate Limiting**

```javascript
// ✅ Instalar: npm install express-rate-limit
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: { error: 'Muitas tentativas. Tente novamente em 15 minutos.' }
});

router.post("/login", authLimiter, async (req, res) => { ... });
router.post("/register", authLimiter, async (req, res) => { ... });
```

### 7. **Consistência na Resposta de Erros**

```javascript
// ✅ Sempre retornar no formato: { error: string }
// Sucesso: { error: null, msg: string, token: string, userId: string }
// Erro: { error: string }
```

### 8. **Validação de Estado (UF)**

```javascript
// ✅ Validar sigla do estado brasileiro
const validStates = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

if (!validStates.includes(state.toUpperCase())) {
  return res.status(400).json({ error: "Estado inválido" });
}
```

### 9. **Logging e Auditoria**

```javascript
// ✅ Registrar tentativas de login
try {
  const user = await User.findOne({ email: email });
  if (user) {
    console.log(`[AUTH] Login attempt for user: ${user._id}`);
  } else {
    console.log(`[AUTH] Login attempt for non-existent email: ${email}`);
  }
  // ... resto do código
} catch (error) {
  console.error("[AUTH] Login error:", error);
}
```

### 10. **Melhorias no Modelo User**

```javascript
// ✅ No model User, adicionar:
userSchema.pre("save", function (next) {
  // Normalizar email
  this.email = this.email.toLowerCase().trim();
  // Normalizar estado
  this.state = this.state.toUpperCase().trim();
  next();
});

// ✅ Índices para performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
```

## 📋 Compatibilidade com Frontend

### ✅ Campos Validados

- `name`, `anonymous`, `email`, `password`, `confirmPassword`
- `role`, `city`, `state`, `institution`

### ✅ Formato de Resposta

```json
{
  "error": null,
  "msg": "Registro realizado com sucesso",
  "token": "eyJhbGc...",
  "userId": "507f1f77..."
}
```

### ✅ Formato de Erro

```json
{
  "error": "Mensagem de erro descritiva"
}
```

## 🔒 Checklist de Segurança (Autenticação)

- [x] Hash de senha com bcrypt (salt 12)
- [ ] JWT com expiração definida
- [ ] Rate limiting em rotas de autenticação
- [ ] Sanitização de inputs
- [ ] Validação robusta de email
- [ ] Tratamento de erros sem expor detalhes internos
- [ ] HTTPS obrigatório em produção
- [ ] CORS configurado corretamente
- [ ] Helmet.js para headers de segurança
- [ ] Validação de força de senha

## 🚀 Próximos Passos (Autenticação)

1. Implementar rate limiting
2. Adicionar expiração ao JWT
3. Melhorar tratamento de erros
4. Adicionar logging estruturado
5. Implementar refresh token
6. Adicionar verificação de email (opcional)
7. Implementar recuperação de senha funcional

---

## API de Dashboards

### ✅ Pontos Corretos

1. **Verificação de permissões**: Apenas admin e staff podem acessar
2. **Soft delete**: Respeita usuários e questões deletadas com `deleted: false`
3. **Populate inteligente**: Filtra dados deletados com `match: { deleted: false }`
4. **Análises estatísticas completas**: Suporta todos os tipos de questões
5. **Documentação Swagger**: Bem estruturada com exemplos
6. **Filtros robustos**: Remove respostas de usuários/questões deletadas

### ⚠️ Ajustes Recomendados

#### 1. **Paginação para Grandes Volumes de Dados**

```javascript
// ✅ Adicionar paginação nas rotas de listagem
router.get("/:formId", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const totalResponses = await Response.countDocuments({
    formId,
    deleted: false,
  });
  const responses = await Response.find({ formId, deleted: false })
    .skip(skip)
    .limit(limit)
    .populate(/* ... */);

  return res.status(200).json({
    error: null,
    message: "Dados obtidos com sucesso!",
    form: form.title,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalResponses / limit),
      totalResponses,
      responsesPerPage: limit,
    },
    responses: filteredResponses,
  });
});
```

#### 2. **Cache para Análises Pesadas**

```javascript
// ✅ Instalar: npm install node-cache
const NodeCache = require("node-cache");
const analysisCache = new NodeCache({ stdTTL: 300 }); // 5 minutos

router.get("/full-analysis/:formId", verifyToken, async (req, res) => {
  const cacheKey = `analysis_${formId}`;
  const cached = analysisCache.get(cacheKey);

  if (cached) {
    return res.status(200).json(cached);
  }

  // ... processar análise ...

  const result = { formTitle, totalResponses, questionsAnalysis };
  analysisCache.set(cacheKey, result);
  return res.status(200).json(result);
});
```

#### 3. **Tratamento de Erros Consistente**

```javascript
// ❌ Problema atual
catch (error) {
  return res.status(500).json({ msg: "Erro ao buscar dados!", error: error.message });
}

// ✅ Recomendação
catch (error) {
  console.error('[DASHBOARD] Erro ao buscar dados:', error);
  return res.status(500).json({
    error: "Erro ao processar análise. Tente novamente.",
    msg: "Erro ao buscar dados!"
  });
}
```

#### 4. **Validação de ObjectId**

```javascript
// ✅ Validar IDs antes de buscar no banco
const mongoose = require("mongoose");

router.get("/analysis/:formId/:questionId", verifyToken, async (req, res) => {
  const { formId, questionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(formId)) {
    return res.status(400).json({ error: "ID de formulário inválido" });
  }

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(400).json({ error: "ID de questão inválido" });
  }

  // ... resto do código
});
```

#### 5. **Otimização de Queries com Agregação**

```javascript
// ✅ Usar agregação para análises mais eficientes
router.get("/full-analysis/:formId", verifyToken, async (req, res) => {
  const analysis = await Response.aggregate([
    { $match: { formId: mongoose.Types.ObjectId(formId), deleted: false } },
    { $unwind: "$answers" },
    {
      $lookup: {
        from: "questions",
        localField: "answers.questionId",
        foreignField: "_id",
        as: "questionData",
      },
    },
    { $unwind: "$questionData" },
    { $match: { "questionData.deleted": false } },
    {
      $group: {
        _id: "$answers.questionId",
        title: { $first: "$questionData.title" },
        type: { $first: "$questionData.type" },
        answers: { $push: "$answers.answer" },
        totalAnswers: { $sum: 1 },
      },
    },
  ]);

  // Processar análise por tipo
  // ...
});
```

#### 6. **Limite de Exportação**

```javascript
// ✅ Adicionar limite para exportações grandes
router.get("/export/:formId", verifyToken, async (req, res) => {
  const totalResponses = await Response.countDocuments({
    formId,
    deleted: false,
  });

  if (totalResponses > 10000) {
    return res.status(400).json({
      error:
        "Exportação muito grande. Use filtros ou solicite arquivo em background.",
    });
  }

  // ... resto do código de exportação
});
```

#### 7. **Valores Padrão para Análises Vazias**

```javascript
// ✅ Melhorar tratamento quando não há respostas
case 'scale':
  const scaleValues = answers.map(a => parseInt(a)).filter(v => !isNaN(v));
  if (scaleValues.length === 0) {
    analysis = {
      type: 'scale',
      average: null,
      min: null,
      max: null,
      distribution: {},
      totalAnswers: 0
    };
  } else {
    // ... cálculos normais
  }
  break;
```

#### 8. **Logging e Auditoria**

```javascript
// ✅ Registrar acessos aos dashboards
router.get("/export/:formId", verifyToken, async (req, res) => {
  console.log(
    `[DASHBOARD] Export requested by user ${userId} for form ${formId}`
  );

  try {
    // ... código de exportação

    console.log(
      `[DASHBOARD] Export successful: ${exportData.length} rows exported`
    );
  } catch (error) {
    console.error(`[DASHBOARD] Export failed for form ${formId}:`, error);
  }
});
```

#### 9. **Formato de Resposta Consistente**

```javascript
// ✅ Padronizar todas as respostas
// Sucesso:
{
  error: null,
  message: "Operação bem-sucedida",
  data: { /* dados */ }
}

// Erro:
{
  error: "Mensagem de erro",
  message: null,
  data: null
}
```

#### 10. **Validação de Divisão por Zero**

```javascript
// ✅ Proteger contra divisões por zero
case 'scale':
  const scaleValues = answers.map(a => parseInt(a)).filter(v => !isNaN(v));
  const average = scaleValues.length > 0
    ? scaleValues.reduce((sum, val) => sum + val, 0) / scaleValues.length
    : 0;

  analysis = {
    type: 'scale',
    average: scaleValues.length > 0 ? average.toFixed(2) : "N/A",
    // ...
  };
  break;
```

### 📊 Compatibilidade com Frontend

#### ✅ Interfaces TypeScript Alinhadas

```typescript
// dashboardService.ts está correto e alinhado com:

// GET /api/dashboards/analysis/:formId/:questionId
interface SingleQuestionAnalysisResponse {
  question: string;
  questionType:
    | "text"
    | "multiple_choice"
    | "checkbox"
    | "dropdown"
    | "scale"
    | "date";
  analysis: {
    /* ... */
  };
}

// GET /api/dashboards/full-analysis/:formId
interface FullAnalysisResponse {
  formTitle: string;
  totalResponses: number;
  questionsAnalysis: QuestionAnalysis[];
}

// GET /api/dashboards/export/:formId
interface ExportDataResponse {
  formTitle: string;
  totalResponses: number;
  data: Array<Record<string, any>>;
}

// GET /api/dashboards/:formId
interface AllResponsesResponse {
  error: null;
  message: string;
  form: string;
  totalResponses: number;
  responses: RawResponse[];
}
```

### 🔒 Checklist de Segurança (Dashboards)

- [x] Verificação de autenticação com token
- [x] Autorização por role (admin/staff)
- [x] Filtros de soft delete
- [x] Populate com match para dados deletados
- [ ] Validação de ObjectId
- [ ] Paginação para grandes volumes
- [ ] Rate limiting
- [ ] Cache para análises pesadas
- [ ] Limite de exportação
- [ ] Logging de acesso

### 🚀 Próximos Passos (Dashboards)

1. Implementar paginação nas listagens
2. Adicionar cache para análises
3. Validar ObjectIds nos params
4. Implementar agregação para performance
5. Adicionar limite de exportação
6. Melhorar tratamento de erros
7. Adicionar logging estruturado
8. Implementar filtros avançados (data, cidade, instituição)
9. Adicionar exportação em background para grandes volumes
10. Implementar webhooks para notificar conclusão de exportação

---

## API de Questões

### ✅ Pontos Corretos

1. **Controle de acesso granular**: Admin para criar/editar/deletar, staff para visualizar
2. **Validação robusta**: Helper `validateQuestion` com verificação de campos obrigatórios
3. **Soft delete**: Flag `deleted` em vez de remoção física
4. **Populate inteligente**: Filtra usuários deletados com `match: { deleted: false }`
5. **Documentação Swagger**: Exemplos completos para cada tipo de questão
6. **Trim nos inputs**: Limpa espaços em branco em títulos e opções
7. **Tipos de questão suportados**: text, multiple_choice, checkbox, dropdown, scale, date

### ⚠️ Ajustes Recomendados

#### 1. **Validação de ObjectId**

```javascript
// ✅ Validar IDs antes de queries
const mongoose = require("mongoose");

router.get("/:id", verifyToken, async (req, res) => {
  const questionId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(400).json({ error: "ID de questão inválido" });
  }

  // ... resto do código
});
```

#### 2. **Paginação e Busca**

```javascript
// ✅ Adicionar paginação e filtros
router.get("/all", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || "";
  const type = req.query.type; // Filtrar por tipo
  const skip = (page - 1) * limit;

  const filter = { deleted: false };

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  if (type) {
    filter.type = type;
  }

  const total = await Question.countDocuments(filter);
  const questions = await Question.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate(/* ... */);

  return res.status(200).json({
    error: null,
    msg: "Questões encontradas com sucesso",
    data: questions,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalQuestions: total,
      questionsPerPage: limit,
    },
  });
});
```

#### 3. **Verificação de Uso em Formulários**

```javascript
// ✅ Prevenir exclusão de questões em uso
router.delete("/:id", verifyToken, async (req, res) => {
  const questionId = req.params.id;

  // Verificar se a questão está em algum formulário
  const Form = require("../models/form");
  const formsUsingQuestion = await Form.countDocuments({
    "questions.questionId": questionId,
    deleted: false,
  });

  if (formsUsingQuestion > 0) {
    return res.status(400).json({
      error: `Esta questão está sendo usada em ${formsUsingQuestion} formulário(s) ativo(s). Remova-a dos formulários antes de deletar.`,
    });
  }

  // ... prosseguir com soft delete
});
```

#### 4. **Validação de Tipos com Enum**

```javascript
// ✅ Validar tipo de questão com constante
const VALID_QUESTION_TYPES = [
  "text",
  "multiple_choice",
  "checkbox",
  "dropdown",
  "scale",
  "date",
];

router.post("/", verifyToken, async (req, res) => {
  const { type } = req.body;

  if (!VALID_QUESTION_TYPES.includes(type)) {
    return res.status(400).json({
      error: `Tipo inválido. Use: ${VALID_QUESTION_TYPES.join(", ")}`,
    });
  }

  // ... resto do código
});
```

#### 5. **Tratamento de Erros Detalhado**

```javascript
// ❌ Problema atual
catch (error) {
  return res.status(500).json({ error });
}

// ✅ Recomendação
catch (error) {
  console.error('[QUESTIONS] Erro ao buscar questões:', error);

  if (error.name === 'CastError') {
    return res.status(400).json({ error: "ID de questão inválido" });
  }

  return res.status(500).json({
    error: "Erro ao processar requisição. Tente novamente."
  });
}
```

#### 6. **Validação de Opções Duplicadas**

```javascript
// ✅ Prevenir opções com valores duplicados
const validateQuestionUpdate = ({ options, type }) => {
  if (["multiple_choice", "checkbox", "dropdown"].includes(type) && options) {
    const values = options.map((opt) => opt.value);
    const uniqueValues = new Set(values);

    if (values.length !== uniqueValues.size) {
      return {
        isValid: false,
        error: "As opções não podem ter valores duplicados",
      };
    }
  }

  return { isValid: true };
};
```

#### 7. **Auditoria de Alterações**

```javascript
// ✅ Registrar quem editou e quando
router.put("/:id", verifyToken, async (req, res) => {
  const newQuestion = {
    // ... campos atualizados
    updatedBy: user._id.toString(),
    updatedAt: new Date(),
  };

  const updatedQuestion = await Question.findOneAndUpdate(
    { _id: questionId },
    { $set: newQuestion },
    { new: true }
  );

  console.log(`[QUESTIONS] Question ${questionId} updated by user ${userId}`);

  // ...
});
```

#### 8. **Resposta Consistente no Update**

```javascript
// ❌ Problema atual: createdBy é sobrescrito no update
newQuestion.createdBy = user._id.toString();

// ✅ Recomendação: Não sobrescrever createdBy
router.put("/:id", verifyToken, async (req, res) => {
  const newQuestion = {};

  // ... outros campos

  // Adicionar updatedBy, não sobrescrever createdBy
  newQuestion.updatedBy = user._id.toString();
  newQuestion.updatedAt = new Date();

  // ... update
});
```

#### 9. **Validação de Opções Obrigatórias**

```javascript
// ✅ Melhorar validação para tipos que requerem opções
const validateQuestion = ({ title, type, options }) => {
  const typesRequiringOptions = ["multiple_choice", "checkbox", "dropdown"];

  if (typesRequiringOptions.includes(type)) {
    if (!options || !Array.isArray(options) || options.length === 0) {
      return {
        isValid: false,
        error: `Questões do tipo ${type} requerem pelo menos uma opção`,
      };
    }

    if (options.length < 2) {
      return {
        isValid: false,
        error: "Forneça pelo menos 2 opções",
      };
    }

    // Validar estrutura de cada opção
    for (const opt of options) {
      if (!opt.label || !opt.value) {
        return {
          isValid: false,
          error: "Cada opção deve ter 'label' e 'value'",
        };
      }
    }
  }

  return { isValid: true };
};
```

#### 10. **Busca Avançada com Múltiplos Filtros**

```javascript
// ✅ Endpoint de busca avançada
router.get("/search", verifyToken, async (req, res) => {
  const { query, type, createdBy, dateFrom, dateTo } = req.query;

  const filter = { deleted: false };

  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  if (type) {
    filter.type = type;
  }

  if (createdBy) {
    filter.createdBy = createdBy;
  }

  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo);
  }

  const questions = await Question.find(filter)
    .sort({ createdAt: -1 })
    .populate(/* ... */);

  return res.status(200).json({
    error: null,
    msg: `${questions.length} questões encontradas`,
    data: questions,
  });
});
```

### 📊 Compatibilidade com Frontend

#### ✅ Interfaces TypeScript Alinhadas

```typescript
// questionService.ts está correto e alinhado com:

// POST /api/questions
interface CreateQuestionDto {
  title: string;
  description?: string;
  type: string;
  options?: QuestionOption[];
  validation?: QuestionValidation;
}

// GET /api/questions/all
// GET /api/questions/:id
interface Question {
  _id: string;
  title: string;
  type: string;
  options: QuestionOption[];
  validation: QuestionValidation;
  createdBy: { _id; name; email; role };
  createdAt?: string;
  updatedAt?: string;
}

// PUT /api/questions/:id
interface UpdateQuestionDto {
  title?: string;
  type?: string;
  options?: QuestionOption[];
  validation?: QuestionValidation;
}

// DELETE /api/questions/:id
// Retorna: { error: null, msg: string }
```

#### ✅ Formato de Resposta

```json
// Sucesso (Create/Update/Get):
{
  "error": null,
  "msg": "Operação bem-sucedida",
  "data": { /* Question object */ }
}

// Sucesso (List):
{
  "error": null,
  "msg": "Questões encontradas com sucesso",
  "data": [ /* array de Questions */ ]
}

// Sucesso (Delete):
{
  "error": null,
  "msg": "Questão deletada com sucesso"
}

// Erro:
{
  "error": "Mensagem de erro descritiva"
}
```

### 🔒 Checklist de Segurança (Questões)

- [x] Verificação de autenticação com token
- [x] Autorização por role (admin para CUD, staff para R)
- [x] Validação de campos obrigatórios
- [x] Soft delete implementado
- [x] Trim em strings
- [ ] Validação de ObjectId
- [ ] Rate limiting
- [ ] Paginação
- [ ] Verificação de uso antes de deletar
- [ ] Logging de operações

### 🚀 Próximos Passos (Questões)

1. Implementar validação de ObjectId
2. Adicionar paginação e busca
3. Verificar uso em formulários antes de deletar
4. Implementar validação de opções duplicadas
5. Adicionar campo `updatedBy` (não sobrescrever `createdBy`)
6. Melhorar tratamento de erros (CastError, etc)
7. Adicionar endpoint de busca avançada
8. Implementar logging estruturado
9. Adicionar estatísticas de uso (quantos formulários usam cada questão)
10. Implementar duplicação de questões

---

## API de Respostas

### ✅ Pontos Corretos

1. **Validações abrangentes**: Formato, IDs, questões obrigatórias, duplicatas
2. **Validação de ObjectId**: Já implementada para formId e questionIds
3. **Soft delete**: Flag `deleted` respeitada em todas queries
4. **Populate inteligente**: Filtra dados deletados com `match: { deleted: false }`
5. **Controle de acesso**: Admin para delete, staff+admin para visualização
6. **Prevenção de duplicatas**: Verifica se usuário já respondeu o formulário
7. **Documentação Swagger**: Exemplos detalhados com múltiplos tipos de resposta
8. **Tratamento de usuários deletados**: Placeholder "Usuário Deletado" mantém integridade
9. **Validação de formulário ativo**: Impede respostas em formulários desativados
10. **Filtro de answers**: Remove respostas de questões deletadas

### ⚠️ Ajustes Recomendados

#### 1. **Paginação para Grandes Volumes**

```javascript
// ✅ Adicionar paginação na listagem
router.get("/all", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const filter = { deleted: false };

  // Filtros opcionais
  if (req.query.formId) {
    filter.formId = req.query.formId;
  }

  if (req.query.dateFrom || req.query.dateTo) {
    filter.submittedAt = {};
    if (req.query.dateFrom)
      filter.submittedAt.$gte = new Date(req.query.dateFrom);
    if (req.query.dateTo) filter.submittedAt.$lte = new Date(req.query.dateTo);
  }

  const total = await Response.countDocuments(filter);
  const responses = await Response.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ submittedAt: -1 })
    .populate(/* ... */);

  return res.status(200).json({
    error: null,
    msg: "Respostas encontradas com sucesso",
    data: responsesWithDeletedUsers,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResponses: total,
      responsesPerPage: limit,
    },
  });
});
```

#### 2. **Validação de Resposta Vazia (Checkbox)**

```javascript
// ✅ Melhorar validação para arrays vazios
for (const answer of answers) {
  const value = answer.answer;

  if (value === undefined || value === null || value === "") {
    return res
      .status(400)
      .json({ error: "Todas as respostas devem ter um valor" });
  }

  // Validar arrays vazios (checkbox)
  if (Array.isArray(value) && value.length === 0) {
    return res.status(400).json({
      error: "Respostas do tipo checkbox não podem estar vazias",
    });
  }
}
```

#### 3. **Validação de Tipo de Resposta**

```javascript
// ✅ Validar tipo da resposta conforme tipo da questão
const questionTypes = form.questions.reduce((acc, q) => {
  acc[q.questionId._id.toString()] = q.questionId.type;
  return acc;
}, {});

for (const answer of answers) {
  const qType = questionTypes[answer.questionId.toString()];

  switch (qType) {
    case "checkbox":
      if (!Array.isArray(answer.answer)) {
        return res.status(400).json({
          error: "Resposta de checkbox deve ser um array",
        });
      }
      break;

    case "scale":
      const scaleValue = parseInt(answer.answer);
      if (isNaN(scaleValue) || scaleValue < 1 || scaleValue > 10) {
        return res.status(400).json({
          error: "Resposta de escala deve ser um número entre 1 e 10",
        });
      }
      break;

    case "text":
    case "multiple_choice":
    case "dropdown":
      if (typeof answer.answer !== "string") {
        return res.status(400).json({
          error: `Resposta de ${qType} deve ser texto`,
        });
      }
      break;
  }
}
```

#### 4. **Validação de Opções Válidas**

```javascript
// ✅ Verificar se opção selecionada existe
for (const answer of answers) {
  const question = form.questions.find(
    (q) => q.questionId._id.toString() === answer.questionId.toString()
  );

  if (["multiple_choice", "dropdown"].includes(question.questionId.type)) {
    const validOptions = question.questionId.options.map((o) => o.value);

    if (!validOptions.includes(answer.answer)) {
      return res.status(400).json({
        error: `Opção inválida para a questão "${question.questionId.title}"`,
      });
    }
  }

  if (question.questionId.type === "checkbox") {
    const validOptions = question.questionId.options.map((o) => o.value);
    const invalidOptions = answer.answer.filter(
      (a) => !validOptions.includes(a)
    );

    if (invalidOptions.length > 0) {
      return res.status(400).json({
        error: `Opções inválidas: ${invalidOptions.join(", ")}`,
      });
    }
  }
}
```

#### 5. **Rate Limiting por Formulário**

```javascript
// ✅ Limitar submissões por usuário/formulário
const recentSubmissions = await Response.countDocuments({
  userId,
  formId,
  submittedAt: { $gte: new Date(Date.now() - 60000) }, // último minuto
  deleted: false,
});

if (recentSubmissions > 0) {
  return res.status(429).json({
    error: "Muitas tentativas. Aguarde antes de enviar novamente.",
  });
}
```

#### 6. **Validação de ObjectId no Get**

```javascript
// ✅ Validar ID antes de buscar
router.get("/:id", verifyToken, async (req, res) => {
  const responseId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(responseId)) {
    return res.status(400).json({ error: "ID de resposta inválido" });
  }

  // ... resto do código
});
```

#### 7. **Estatísticas de Respondentes**

```javascript
// ✅ Adicionar estatísticas agregadas
router.get("/:formId/respondents", verifyToken, async (req, res) => {
  // ... código existente ...

  // Adicionar estatísticas
  const stats = {
    totalRespondents: respondents.length,
    byRole: {
      user: respondents.filter((r) => r.role === "user").length,
      staff: respondents.filter((r) => r.role === "staff").length,
      admin: respondents.filter((r) => r.role === "admin").length,
    },
    lastResponse: respondents[0]?.submittedAt,
    firstResponse: respondents[respondents.length - 1]?.submittedAt,
  };

  return res.status(200).json({
    error: null,
    msg: "Respondentes encontrados com sucesso",
    formTitle: form.title,
    formDescription: form.description,
    totalRespondents: respondents.length,
    respondents: respondents,
    stats: stats,
  });
});
```

#### 8. **Logging de Submissões**

```javascript
// ✅ Registrar submissões para auditoria
router.post("/", verifyToken, async (req, res) => {
  // ... validações ...

  const newResponse = await response.save();

  console.log(
    `[RESPONSES] New submission - User: ${userId}, Form: ${formId}, Questions: ${answers.length}`
  );

  return res.status(201).json({
    message: "Resposta submetida com sucesso!",
    data: newResponse,
  });
});
```

#### 9. **Validação de Comprimento de Texto**

```javascript
// ✅ Validar minLength/maxLength para questões de texto
for (const answer of answers) {
  const question = form.questions.find(
    (q) => q.questionId._id.toString() === answer.questionId.toString()
  );

  if (question.questionId.type === "text") {
    const validation = question.questionId.validation;
    const text = answer.answer;

    if (validation.minLength && text.length < validation.minLength) {
      return res.status(400).json({
        error: `A resposta para "${question.questionId.title}" deve ter no mínimo ${validation.minLength} caracteres`,
      });
    }

    if (validation.maxLength && text.length > validation.maxLength) {
      return res.status(400).json({
        error: `A resposta para "${question.questionId.title}" deve ter no máximo ${validation.maxLength} caracteres`,
      });
    }
  }
}
```

#### 10. **Exportação de Respostas Individuais**

```javascript
// ✅ Endpoint para exportar respostas de um usuário
router.get("/user/:userId", verifyToken, async (req, res) => {
  const token = req.header("auth-token");
  const userByToken = await getUserByToken(token);
  const requestUserId = userByToken._id.toString();
  const targetUserId = req.params.userId;

  // Usuário pode ver apenas suas próprias respostas (exceto admin/staff)
  if (
    requestUserId !== targetUserId &&
    userByToken.role !== "admin" &&
    userByToken.role !== "staff"
  ) {
    return res.status(403).json({
      error: "Você só pode acessar suas próprias respostas",
    });
  }

  const responses = await Response.find({
    userId: targetUserId,
    deleted: false,
  })
    .populate("formId", "title description")
    .sort({ submittedAt: -1 });

  return res.status(200).json({
    error: null,
    msg: "Respostas do usuário encontradas",
    totalResponses: responses.length,
    data: responses,
  });
});
```

### 📊 Compatibilidade com Frontend

#### ✅ Interfaces TypeScript Alinhadas

```typescript
// responseService.ts está correto e alinhado com:

// POST /api/responses
interface SubmitResponseRequest {
  formId: string;
  answers: Answer[];
}

interface Answer {
  questionId: string;
  answer: string | string[] | number;
}

// GET /api/responses/all
// GET /api/responses/:id
interface ResponseData {
  _id: string;
  formId: { _id; title; description };
  userId: { _id?; name; email }; // _id opcional (usuário deletado)
  answers: Array<{
    questionId: { _id; title; type; options };
    answer: string | string[] | number;
  }>;
  submittedAt: string;
}

// GET /api/forms/:formId/respondents (rota correta no swagger)
// ou GET /api/responses/:formId/respondents (implementação atual)
interface GetFormRespondentsResponse {
  error: null;
  msg: string;
  formTitle: string;
  formDescription?: string;
  totalRespondents: number;
  respondents: Respondent[];
}

// DELETE /api/responses/:id
// Retorna: { error: null, msg: string }
```

#### ⚠️ Discrepância de Rota

```javascript
// ❌ Backend implementa: GET /api/responses/:formId/respondents
// ✅ Swagger documenta: GET /api/forms/:id/respondents

// Solução: Mover para formService ou manter ambas rotas
// Frontend já suporta ambas com flag useLegacyPath
```

#### ✅ Formato de Resposta

```json
// Sucesso (Submit):
{
  "message": "Resposta submetida com sucesso!",
  "data": { /* Response object */ }
}

// Sucesso (List/Get):
{
  "error": null,
  "msg": "Respostas encontradas com sucesso",
  "data": [ /* array ou objeto */ ]
}

// Sucesso (Delete):
{
  "error": null,
  "msg": "Resposta deletada com sucesso"
}

// Erro:
{
  "error": "Mensagem de erro descritiva"
}
```

### 🔒 Checklist de Segurança (Respostas)

- [x] Verificação de autenticação com token
- [x] Autorização por role (admin para delete, staff+admin para R)
- [x] Validação de ObjectId (formId e questionIds)
- [x] Prevenção de duplicatas (mesmo usuário + formulário)
- [x] Validação de formulário ativo
- [x] Verificação de questões obrigatórias
- [x] Soft delete implementado
- [x] Filtros para dados deletados
- [ ] Rate limiting por submissão
- [ ] Validação de tipo de resposta (string vs array vs number)
- [ ] Validação de opções válidas
- [ ] Validação de minLength/maxLength
- [ ] Paginação
- [ ] Logging de submissões

### 🚀 Próximos Passos (Respostas)

1. Implementar paginação na listagem
2. Validar tipo de resposta conforme tipo de questão
3. Validar opções selecionadas (multiple_choice, checkbox, dropdown)
4. Implementar rate limiting por submissão
5. Validar minLength/maxLength para questões de texto
6. Adicionar endpoint de respostas por usuário
7. Adicionar estatísticas agregadas em respondentes
8. Implementar logging estruturado
9. Corrigir discrepância de rota (respondents)
10. Adicionar filtros avançados (data, formulário, usuário)

---

## API de Usuários

### ✅ Pontos Corretos

1. **Controle de acesso granular**: Admin para listar/deletar, admin+próprio usuário para editar
2. **Soft delete**: Flag `deleted` respeitada em todas queries
3. **Bcrypt para senhas**: Hash com salt (12 rounds) na atualização
4. **Exclusão de senha**: Select `-password` ou `{ password: 0 }` em todos GET
5. **Validação de email duplicado**: Verifica antes de atualizar (excluindo próprio usuário)
6. **Validação de role**: Apenas admin pode alterar funções
7. **Confirmação de senha**: Valida se `password` == `confirmPassword`
8. **Documentação Swagger**: 4 exemplos de atualização + casos de erro
9. **Campos adicionais**: Suporta `anonymous`, `city`, `state`, `institution`
10. **Updates parciais**: Permite atualizar campos individualmente

### ⚠️ Ajustes Recomendados

#### 1. **Validação de ObjectId**

```javascript
// ✅ Validar IDs antes de queries
const mongoose = require("mongoose");

router.get("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID de usuário inválido" });
  }

  // ... resto do código
});
```

#### 2. **Paginação e Busca**

```javascript
// ✅ Adicionar paginação e filtros na listagem
router.get("/all", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || "";
  const role = req.query.role;
  const skip = (page - 1) * limit;

  const filter = { deleted: false };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (role) {
    filter.role = role;
  }

  const total = await User.countDocuments(filter);
  const users = await User.find(filter, { password: 0 })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return res.json({
    error: null,
    msg: "Usuários encontrados com sucesso",
    data: users,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
      usersPerPage: limit,
    },
  });
});
```

#### 3. **Validação de Email**

```javascript
// ✅ Adicionar validação de formato de email
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

if (email && !emailRegex.test(email)) {
  return res.status(400).json({ error: "Formato de e-mail inválido" });
}
```

#### 4. **Validação de Senha no Update**

```javascript
// ✅ Adicionar requisitos mínimos de senha
if (password) {
  if (password.length < 6) {
    return res.status(400).json({
      error: "A senha deve ter no mínimo 6 caracteres",
    });
  }

  if (password !== confirmpassword) {
    return res.status(400).json({ error: "As senhas não coincidem" });
  }

  // Opcional: validar força da senha
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return res.status(400).json({
      error: "A senha deve conter letras maiúsculas, minúsculas e números",
    });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);
  updateData.password = passwordHash;
}
```

#### 5. **Prevenção de Auto-Deleção**

```javascript
// ✅ Impedir admin de deletar a si mesmo
router.delete("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const userId = userByToken._id.toString();

  if (id === userId) {
    return res.status(400).json({
      error: "Você não pode deletar sua própria conta",
    });
  }

  // ... resto do código
});
```

#### 6. **Validação de Estado (UF)**

```javascript
// ✅ Validar sigla do estado brasileiro
const validStates = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

if (state && !validStates.includes(state.toUpperCase())) {
  return res.status(400).json({ error: "Estado inválido" });
}

if (state) {
  updateData.state = state.toUpperCase();
}
```

#### 7. **Tratamento de Erros Detalhado**

```javascript
// ❌ Problema atual
catch (error) {
  return res.status(500).json({ error: "Erro ao atualizar usuário" });
}

// ✅ Recomendação
catch (error) {
  console.error('[USERS] Erro ao atualizar usuário:', error);

  if (error.name === 'CastError') {
    return res.status(400).json({ error: "ID de usuário inválido" });
  }

  if (error.code === 11000) {
    return res.status(400).json({ error: "Email já cadastrado" });
  }

  return res.status(500).json({
    error: "Erro ao processar requisição. Tente novamente."
  });
}
```

#### 8. **Logging de Operações**

```javascript
// ✅ Registrar operações críticas
router.put("/:id", verifyToken, async (req, res) => {
  // ... código de validação ...

  const updatedUser = await User.findOneAndUpdate(/* ... */);

  const changedFields = Object.keys(updateData).join(", ");
  console.log(
    `[USERS] User ${userReqId} updated by ${userId}. Fields: ${changedFields}`
  );

  res.json({
    error: null,
    msg: "Usuário atualizado com sucesso",
    data: updatedUser,
  });
});

router.delete("/:id", verifyToken, async (req, res) => {
  // ... código de deleção ...

  console.log(`[USERS] User ${id} deleted by ${userId}`);
  return res
    .status(200)
    .json({ error: null, msg: "Usuário deletado com sucesso" });
});
```

#### 9. **Endpoint de Perfil Próprio**

```javascript
// ✅ Adicionar rota para obter perfil do usuário logado
router.get("/me/profile", verifyToken, async (req, res) => {
  const token = req.header("auth-token");
  const userByToken = await getUserByToken(token);
  const userId = userByToken._id.toString();

  try {
    const user = await User.findOne(
      { _id: userId, deleted: false },
      { password: 0 }
    );

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.json({
      error: null,
      msg: "Perfil obtido com sucesso",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar perfil" });
  }
});
```

#### 10. **Estatísticas de Usuários**

```javascript
// ✅ Endpoint de estatísticas agregadas
router.get("/stats", verifyToken, async (req, res) => {
  const token = req.header("auth-token");
  const userByToken = await getUserByToken(token);

  try {
    const user = await User.findOne({ _id: userByToken._id, deleted: false });

    if (!user || user.role !== "admin") {
      return res.status(401).json({ error: "Acesso negado" });
    }

    const totalUsers = await User.countDocuments({ deleted: false });
    const byRole = await User.aggregate([
      { $match: { deleted: false } },
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const stats = {
      totalUsers,
      byRole: byRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentUsers: await User.find({ deleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email role createdAt"),
    };

    return res.json({
      error: null,
      msg: "Estatísticas obtidas com sucesso",
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar estatísticas" });
  }
});
```

### 📊 Compatibilidade com Frontend

#### ✅ Interfaces TypeScript Alinhadas

```typescript
// userService.ts está correto e alinhado com:

// GET /api/users/all
// GET /api/users/:id
interface User {
  _id: string;
  name: string;
  anonymous?: boolean;
  email: string;
  role: "admin" | "staff" | "user";
  city?: string;
  state?: string;
  institution?: string;
  createdAt?: string;
  updatedAt?: string;
}

// PUT /api/users/:id
interface UpdateUserPayload {
  id: string;
  name?: string;
  anonymous?: boolean;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: User["role"];
  city?: string;
  state?: string;
  institution?: string;
}

// DELETE /api/users/:id
// Retorna: { error: null, msg: string }
```

#### ✅ Formato de Resposta

```json
// Sucesso (List/Get/Update):
{
  "error": null,
  "msg": "Operação bem-sucedida",
  "data": { /* User object ou array */ }
}

// Sucesso (Delete):
{
  "error": null,
  "msg": "Usuário deletado com sucesso"
}

// Erro:
{
  "error": "Mensagem de erro descritiva"
}
```

#### ⚠️ Endpoint `/auth/me` no Frontend

```typescript
// userService.ts tem função getCurrentUser() que chama /auth/me
// ❌ Backend não implementa este endpoint
// ✅ Recomendação: Implementar ou remover do frontend

// Opção 1: Implementar no backend (auth.js)
router.get("/me", verifyToken, async (req, res) => {
  const token = req.header("auth-token");
  const user = await getUserByToken(token);
  const userData = await User.findOne(
    { _id: user._id, deleted: false },
    { password: 0 }
  );

  if (!userData) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  return res.json({ error: null, msg: "Perfil obtido", data: userData });
});

// Opção 2: Remover do frontend e usar getUserById(decodedToken.userId)
```

### 🔒 Checklist de Segurança (Usuários)

- [x] Verificação de autenticação com token
- [x] Autorização por role (admin para list/delete)
- [x] Autorização para editar (admin ou próprio usuário)
- [x] Bcrypt para hash de senha
- [x] Exclusão de senha em respostas
- [x] Soft delete implementado
- [x] Validação de email duplicado
- [x] Validação de confirmação de senha
- [ ] Validação de ObjectId
- [ ] Validação de formato de email
- [ ] Validação de força de senha
- [ ] Validação de estado (UF)
- [ ] Prevenção de auto-deleção (admin)
- [ ] Paginação
- [ ] Logging de operações
- [ ] Rate limiting

### 🚀 Próximos Passos (Usuários)

1. Implementar validação de ObjectId
2. Adicionar paginação e busca na listagem
3. Validar formato de email
4. Validar requisitos de senha (comprimento, força)
5. Validar estado brasileiro (UF)
6. Implementar prevenção de auto-deleção
7. Adicionar logging estruturado
8. Implementar endpoint `/auth/me` ou remover do frontend
9. Adicionar endpoint de estatísticas
10. Melhorar tratamento de erros (CastError, duplicate key)

---

## 🎯 Status Geral

### ✅ Autenticação

- Frontend **100% compatível** com backend
- Campos obrigatórios alinhados
- Formato de resposta padronizado

### ✅ Dashboards

- Frontend **100% compatível** com backend
- Interfaces TypeScript corretas
- Todas as 4 rotas implementadas e funcionais

### ✅ Questões

- Frontend **100% compatível** com backend
- Interfaces TypeScript corretas
- CRUD completo implementado
- Controle de acesso por role funcionando

### ✅ Respostas

- Frontend **100% compatível** com backend
- Interfaces TypeScript corretas
- CRUD completo (exceto Update - não permitido)
- Validações robustas implementadas
- ⚠️ Discrepância de rota: respondents (documentado em `/forms`, implementado em `/responses`)

### ✅ Usuários

- Frontend **98% compatível** com backend
- Interfaces TypeScript corretas e atualizadas
- CRUD completo implementado
- Controle de acesso por role funcionando
- ⚠️ Endpoint `/auth/me` não existe no backend (frontend tem função `getCurrentUser`)

### ⚠️ Melhorias Prioritárias Globais

1. **JWT com expiração** (segurança crítica - todas APIs)
2. **Rate limiting** (todas APIs + submissão de respostas)
3. **Validação de ObjectId** (dashboards + questões + respostas + usuários)
4. **Paginação** (dashboards + questões + respostas + usuários)
5. **Tratamento de erros consistente** (não expor stack traces)
6. **Cache** (dashboards)
7. **Logging estruturado** (auditoria - todas APIs)
8. **Verificação de uso antes de deletar** (questões)
9. **Validação de tipo de resposta** (respostas - string/array/number)
10. **Validação de opções válidas** (respostas - multiple_choice/checkbox/dropdown)
11. **Implementar `/auth/me`** ou remover `getCurrentUser()` do frontend
12. **Prevenção de auto-deleção** (usuários - admin não pode deletar a si mesmo)

### 📊 Resumo de Compatibilidade

| API          | Rotas | Frontend | Backend | Status | Observações                 |
| ------------ | ----- | -------- | ------- | ------ | --------------------------- |
| Autenticação | 2     | ✅       | ✅      | 100%   | -                           |
| Dashboards   | 4     | ✅       | ✅      | 100%   | -                           |
| Questões     | 5     | ✅       | ✅      | 100%   | -                           |
| Respostas    | 5     | ✅       | ⚠️      | 95%    | Rota respondents diverge    |
| Usuários     | 4     | ⚠️       | ✅      | 98%    | `/auth/me` não implementado |

---

## 🚀 Próximos Passos Globais
