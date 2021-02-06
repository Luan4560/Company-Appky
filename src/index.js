const express = require('express')
const cors = require('cors')
const app = express();
const { uuid, isUuid } = require('uuidv4')


const companys = [];

app.use(express.json())
app.use(cors())

function validateProjecId(request, response, next) {
  const {id} = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({error: 'Invalid project ID.'})
  }

  return next()
}

app.get('/companys', (request, response) => {
  const {name} = request.query;

  const results = name
  ? companys.filter(company => company.name.includes(name))
  : companys

  return response.json(results)
})

app.post('/companys', (request, response) => {
  const {name, url} = request.body;

  const company = {id: uuid(), name, url}

  companys.push(company)

  return response.json(company)
})

app.put('/companys/:id', (request, response) => {
  const {id} = request.params;
  const {name, url} = request.body;

  const companyIndex = companys.findIndex(company => company.id === id)

  if(companyIndex < 0) {
    return response.status(400).json({error: 'Project not found'})
  }

  const company = {
    id,
    name,
    url,
  }

  companys[companyIndex] = company;

  return response.json(company);

})

app.delete('/companys/:id', validateProjecId, (request, response) => {
  const {id} = request.params;

  const companyIndex = companys.findIndex(project => project.id === id)

  if(companyIndex < 0) {
    return response.status(400).status({error: 'Company not found'})
  }

  companys.splice(companyIndex, 1)

  return response.status(204).send()

})
,
app.listen(3333, () => {
  console.log('Backend Company works 😎')
})
