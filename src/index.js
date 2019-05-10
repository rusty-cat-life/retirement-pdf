const express = require('express')
const createPdf = require('./api/pdf')

const app = express()

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html')
})

app.get('/api/createPdf', createPdf)

const port = 8080

app.listen(port, () => console.log(`app listening on port ${port}!`))
