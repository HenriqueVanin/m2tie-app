# Guia de Configuração do MongoDB Charts

## Passo 1: Criar uma conta no MongoDB Atlas Charts

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Faça login ou crie uma conta
3. No painel lateral, clique em "Charts"

## Passo 2: Criar um Dashboard

1. Clique em "New Dashboard"
2. Nomeie seu dashboard (ex: "M2TIE Analytics")
3. Selecione a fonte de dados (seu cluster MongoDB)

## Passo 3: Criar os Gráficos

Crie os seguintes gráficos no MongoDB Charts:

### 1. Respostas por Instituição

- **Tipo**: Gráfico de Barras
- **Collection**: `responses`
- **Eixo X**: `userId.institution` (agregado)
- **Eixo Y**: Count de documentos
- **Ordenação**: Por contagem (descendente)
- **Limite**: Top 10

### 2. Formulários Mais Respondidos

- **Tipo**: Gráfico de Linha
- **Collection**: `responses`
- **Eixo X**: `submittedAt` (agrupado por dia)
- **Eixo Y**: Count de documentos
- **Série**: `formId.title`
- **Período**: Últimos 30 dias

### 3. Crescimento de Usuários

- **Tipo**: Gráfico de Área
- **Collection**: `users`
- **Eixo X**: `createdAt` (agrupado por mês)
- **Eixo Y**: Count acumulado de usuários
- **Período**: Últimos 12 meses

### 4. Status dos Formulários

- **Tipo**: Gráfico de Pizza
- **Collection**: `forms`
- **Label**: `isActive` (Ativo/Inativo)
- **Valor**: Count de documentos

### 5. Tempo Médio de Conclusão

- **Tipo**: Gráfico de Barras
- **Collection**: `responses`
- **Eixo X**: `formId.title`
- **Eixo Y**: Média de tempo entre criação do form e submissão
- **Agregação**: Pipeline customizado necessário

### 6. Taxa de Abandono por Etapa

- **Tipo**: Funil
- **Collection**: `responses`
- **Etapas**: Baseado em campos de progresso
- **Métrica**: Porcentagem de conclusão por etapa

### 7. Engajamento por Hora do Dia

- **Tipo**: Heatmap
- **Collection**: `responses`
- **Eixo X**: Hora do dia (extraída de `submittedAt`)
- **Eixo Y**: Dia da semana
- **Valor**: Count de respostas

## Passo 4: Obter IDs dos Gráficos

1. Para cada gráfico criado, clique em "..." (menu)
2. Selecione "Embed Chart"
3. Copie o **Chart ID** da URL ou do código de embed
4. O Chart ID tem o formato: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

## Passo 5: Configurar Base URL

1. No MongoDB Charts, clique em "Settings"
2. Na seção "Embedding", ative "Enable unauthenticated access" (para desenvolvimento)
3. Copie a **Base URL** que tem o formato:
   ```
   https://charts.mongodb.com/charts-project-0-xxxxx
   ```

## Passo 6: Atualizar o Código

No arquivo `StaffDashboardViewer.tsx`, atualize:

```typescript
// Substitua pela URL base do seu MongoDB Charts
const CHARTS_BASE_URL = "https://charts.mongodb.com/charts-project-0-xxxxx";

// Substitua pelos IDs reais dos seus gráficos
const CHART_IDS = {
  responsesByInstitution: "seu-chart-id-1",
  formsPopularity: "seu-chart-id-2",
  userGrowth: "seu-chart-id-3",
  formStatus: "seu-chart-id-4",
  completionTime: "seu-chart-id-5",
  abandonmentRate: "seu-chart-id-6",
  engagementHeatmap: "seu-chart-id-7",
};
```

## Passo 7: Segurança (Produção)

Para produção, configure autenticação:

1. No MongoDB Charts, desative "Enable unauthenticated access"
2. Configure "Verified Signature" ou "JWT Authentication"
3. Atualize o código para incluir autenticação:

```typescript
const sdk = new ChartsEmbedSDK({
  baseUrl: CHARTS_BASE_URL,
  getUserToken: async () => {
    // Retorne o token JWT do seu backend
    const response = await fetch("/api/charts-token");
    const { token } = await response.json();
    return token;
  },
});
```

## Recursos Adicionais

- [MongoDB Charts Documentation](https://docs.mongodb.com/charts/)
- [Charts Embed SDK](https://docs.mongodb.com/charts/embedding-sdk/)
- [Aggregation Pipeline Examples](https://docs.mongodb.com/manual/aggregation/)

## Troubleshooting

### Gráfico não aparece

- Verifique se o Chart ID está correto
- Confirme que "Enable unauthenticated access" está ativo (dev)
- Verifique o console do navegador para erros

### Erro de CORS

- Configure o domínio permitido no MongoDB Charts Settings
- Adicione `localhost:5173` (Vite dev server) à whitelist

### Dados não atualizam

- Ajuste `maxDataAge` para refresh mais frequente
- Verifique se `autoRefresh` está habilitado
