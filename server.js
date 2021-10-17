const express = require('express')
require('dotenv').config()
const server = express()
const { conn } = require('./src/db/db');
const routes = require('./src/routes/index')
const {HOST,PORT} = process.env
const {getTypes} = require('./src/controllers/typeController')
const cors = require('cors')

const {precharge} = require('./src/db/precharge')

server.use(express.json())
server.use(cors())
server.use('/', routes)

async function startServer(){
await conn.sync({ force: true })
server.listen(PORT, () => {
        console.log(`Server listening at at ${HOST}:${PORT}`)
    })

try{
    await conn.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

try{
    (async()=>{
        await getTypes();
        precharge();
    })()
    console.log('Types successfully loaded')
} catch (error) {
    console.error('Unable to load types', error);
}
}

startServer()
