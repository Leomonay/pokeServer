const express = require('express')
const server = express()
const {getPokemon, createPokemon, getTotalPokemon, getPokemonById} = require('../controllers/pokemonController')
const {sendTypes} = require ('../controllers/typeController')

server.get('/',(req,res)=>{
    res.send("Leo Monay's Pokemon DataBase")
})

server.get('/pokemons',getPokemon)
server.get('/pokemon/:id',getPokemonById)
server.get('/totalpokemon',getTotalPokemon)
server.get('/types',sendTypes)
server.post('/pokemon',createPokemon)
module.exports = server