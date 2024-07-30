import { connection, authenticate } from './config/database.js'
import { Cliente } from './models/Cliente.js'
import { Endereco } from './models/Endereco.js'
import { Pet } from './models/Pet.js'

authenticate(connection).then(() => {
  connection.sync() // Sincroniza os Models no banco de dados
  
  // OBS.: connection.sync({force: true}) 
  // force: true -> irá dropar tudo e criar do zero novamente. Deixar ativa na fase de desenvolvimento é útil, mas é perigoso deixar sempre ativa. RECOMENDADO APENAS DURANTE O DESENVOLVIMENTO!!!
})
