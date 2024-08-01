import { connection, authenticate } from './config/database.js'
import { Cliente } from './models/Cliente.js'
import { Endereco } from './models/Endereco.js'
import { Pet } from './models/Pet.js'
import express from 'express'

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

// Definir os endpoints do backend
// Métodos: GET (leotura), POST (inserção), PUT (alteração), DELETE (remoção)
app.get('/hello', (req, res) => { // função manipuladora de rota
  res.send('Hello, World!') // envio da resposta para quem solicitou
})


// CRUD: Create, Read, Update, Delete

// CREATE:
app.post('/clientes', async (req, res) => {
  // Extração de dados do corpo da requisição (enviados pelo usuário)
  const { nome, email, telefone, endereco } = req.body
  
  try {
    // Tentativa de criação de um novo cliente
    await Cliente.create(
      { nome, email, telefone, endereco },
      { include: [Endereco] }, // Inclui o model endereco na requisição
    )
    res.json({ message: 'Cliente criado com sucesso!' })
  } catch(err) {
    // Tratamento caso ocorra um erro
    // 500 = INTERNAL SERVER ERROR
    res.status(500).json({ message: 'Erro ao criar cliente!' })
  }
})


// READ:
// Listagem de todos os clientes
app.get('/clientes', async (req, res) => {
  const listaClientes = await Cliente.findAll() // = SELECT * FROM cliente
  res.json(listaClientes) // resposta em JSON
})

// Listagem de um cliente específico (ID = ?)
// :id = parâmetro de rota
app.get('/clientes/:id', async (req, res) => {
  const cliente = await Cliente.findOne({
    where: { id: req.params.id }, // = SELECT * FROM cliente WHERE id = ?
    include: [Endereco] // juntar os dados do cliente com seu endereco (JOIN)
  }) 
  if(cliente) {
    res.json(cliente)
  } else {
    res.status(404).json({ message: 'Cliente não encontrado!' })
  }
})


// UPDATE:
app.put('/clientes/:id', async (req, res) => {
  const idCliente = req.params.id
  const { nome, email, telefone, endereco } = req.body

  try {
    const cliente = await Cliente.findOne({ where: { id: idCliente } })
    if(cliente) {
      // Atualiza a linha de endereco onde o id do cliente for igual à chave estrangeira na tabela de endereços
      await Endereco.update(endereco, { where: { clienteId: idCliente } })
      await cliente.update( { nome, email, telefone })
      res.json({ message: 'Cliente atualizado com sucesso!' })
    } else {
      //404
      res.status(404).json({ message: 'Cliente não encontrado!' })
    }
  } catch(err) {
    res.status(500).json({ message: 'Erro ao atualizar cliente!' })
  }
})


// DELETE:
app.delete('/clientes/:id', async (req, res) => {
  const idCliente = req.params.id
  try {
    const cliente = await Cliente.findOne({ where: { id: idCliente }})

    if(cliente) {
      await cliente.destroy()
      res.json({ message: 'Cliente removido com sucesso!' })
    } else {
      res.status(404).json({ message: 'Cliente não encontrado!' })
    }
  } catch(err) {
    res.status(500).json({ message: 'Erro ao remover cliente!' })
  }
})


// CRUD PETS:
// CREATE:

//READ:
app.get('/pets', async (req, res) => {
  const listaPets = await Pet.findAll()
  res.json(listaPets)
})


app.get('/pets/:id', async (req, res) => {
  const pet = await Pet.findOne({
    where: { id: req.params.id },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [{model: Cliente, attributes: ['id', 'nome']}]
    // include: [{ model: Cliente, attributes: {exclude: ["senha"]} }] --- caso quisesse excluir um campo
  })
  if (pet) {
    res.json(pet)
  } else {
    res.status(404).json({ message: 'Pet não encontrado!' })
  }
})

// UPDATE:
app.put('/pets/:id', async (req, res) => {
  const { nome, tipo, porte, dataNasc } = req.body

  try {
    const pet = await Pet.findOne({where: { id: req.params.id }})
    if (pet) {
      await pet.update({ nome, tipo, porte, dataNasc })
      res.json({ message: 'Pet atualizado com sucesso!' })
    } else {
      res.status(404).json({ message: 'Pet não encontrado!' })
    }
  } catch(err) {
    console.log(err)
    res.status(500).json({ message: 'Erro ao atualizar pet!' })
  }
})

// DELETE:
app.delete('/pets/:id', async (req, res) => {
  try {
    const pet = await Pet.findOne({ where: {id: req.params.id }})
    if (pet) {
      await pet.destroy()
      res.json({ message: 'Pet removido com sucesso!' })
    } else {
      res.status(404).json({ message: 'Pet não encontrado!' })
    }
  } catch(err) {
    res.status(500).json({ message: 'Erro ao remover pet!' })
  }
})


// Rodar a aplicação backend
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000/')
})
