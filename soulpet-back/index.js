import { connection, authenticate } from './config/database.js'
import express from 'express'
import { petsRouter } from './routes/pets.js'
import { clientesRouter } from './routes/clientes.js'
import cors from 'cors'

authenticate(connection).then(() => {
  connection.sync() // Sincroniza os Models no banco de dados
  
  // OBS.: connection.sync({force: true}) 
  // force: true -> irá dropar tudo e criar do zero novamente. Deixar ativa na fase de desenvolvimento é útil, mas é perigoso deixar sempre ativa. RECOMENDADO APENAS DURANTE O DESENVOLVIMENTO!!!
})

// Definir a aplicação backend em Express
// Já tem recursos pré-configurados
const app = express()

// Garante que todas as requisições que têm body sejam lidas como JSON
app.use(express.json())

// Configuração do CROS
app.use(cors({origin: 'http://localhost:5173'}))

// Definir as rotas da aplicação backend
app.use(petsRouter)
app.use(clientesRouter)

// Rodar a aplicação backend
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000/')
})
