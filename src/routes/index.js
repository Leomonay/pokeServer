const express = require('express')
const server = express()
const {getPokemon, createPokemon, getTotalPokemon, getPokemonList} = require('../controllers/pokemonController')
const {sendTypes} = require ('../controllers/typeController')

server.get('/',(req,res)=>{
    res.send("Leo Monay's Pokemon DataBase")
})

server.get('/pokemon',getPokemonList)
server.get('/pokemon/:id',getPokemon)
server.get('/totalpokemon',getTotalPokemon)
server.get('/types',sendTypes)
server.post('/pokemon',createPokemon)
module.exports = server