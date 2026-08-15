const http = require('http')
const express = require('express')
const app = express()



app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    const testJson = [{id: "1", words: "Hello"},{id:"2", words: "World"}]
    response.writeHead(200, { 'Content-Type': 'text/json' })
    response.end(JSON.stringify(testJson))
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)