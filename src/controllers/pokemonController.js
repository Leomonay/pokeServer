const {Pokemon, Type} = require('../db/db.js')
const axios = require ('axios')
const {Op} = require ('sequelize')
const {API, IMAGE3D, POKE} = process.env

const info = {list:'To List', card:'To Card', detail:'To Detail'}
let totalPokemon ={}

async function getTotalPokemon(req, res){
    res.status(200).send(totalPokemon)
}

async function BuildPokemon(response,database,data){
    let poke={}
    base=database==='server'

    if(data!==info.list) poke.id=base? response.id_pokemon : response.data.id

    poke.name= base? response.name.toUpperCase() : response.data.species.name.toUpperCase()
    poke.types= base? response.types.map(e=>e.name) : response.data.types.map(e=>e.type.name)
    poke.imageIcon= base? response.imageIcon : response.data.sprites['front_default']

    if(data!==info.detail)poke.bigImage= base? response.imageFront : `${IMAGE3D}${response.data.species.name}.png` 

    if(data===info.detail){
        poke.imageFront= base? response.imageFront : response.data.sprites.other['official-artwork']['front_default']        
        poke.imageBack= base? response.imageBack : response.data.sprites['back_default']
        poke.stats= base?[
            {name: "Height", value: response.height/100+'m.'},
            {name: "Weight", value: response.weight+'kg.'},
            {name: "Health Points", value: response.hp},
            {name: "Attack", value: response.attack},
            {name: "Special attack", value: response['special-attack']},
            {name: "Speed", value: response.speed},
            {name: "Defense", value: response.defense},
            {name: "Special defense", value: response['special-defense']}
        ]
        : response.data.stats.map(e =>{
            return{name: e.stat.name[0].toUpperCase()+e.stat.name.slice(1).replace("-"," "), value : e.base_stat}
        })
        if(!poke.stats.filter(e=>e.name=="Height")[0]){
                poke.stats.unshift(
                    {name: "Height", value: response.data.height*10+'m.'},
                    {name: "Weight", value: response.data.weight/10+'kg.'})
            }
    }
    return(poke)
}


async function getList(init, final, base){
    let pokeCollection = []
    let indexes = []
   
    for(let i = init; i<=final; i++)indexes.push(i)
    try{
        let search = []
        for (let index= init; index<=final;index++){
            if(index<=totalPokemon[base]){
                //set inmutable id
                const id = index
                //create Promise in respective database
                search[index-init] = (base==='server' ?
                    Pokemon.findOne({where:{ id_pokemon: 'A'+id},include: Type})
                    : axios(`${API}${POKE}${id}`)
                    )
                //apply BuildPokemon
                .then(response=> BuildPokemon(response,base,info.list))
                //push into array
                .then(response=>pokeCollection.push({'index':index,'pokemon': response}))
            }
        }
        //promise all
        await Promise.all(search)
        //sort array
        pokeCollection.sort((a,b)=>a.index-b.index)
        //sort delete index
        pokeCollection.map(poke=>delete poke.index)
        //send just pokemon
        return pokeCollection.map(e=>e.pokemon)
    }catch(e){
        console.log(e.message)
        throw new Error(e.message)
    }
}

async function getPokemonByName(pokeName){
    let response=null
    let base = null
    try{
        response = await Pokemon.findOne({where:{ name: pokeName},include: Type})
        if (response) base='server'
        if(!response && pokeName !=parseInt(pokeName)){
            response = await axios(`${API}${POKE}${pokeName}`)
        }
        if(!response) throw new Error({error: 'Pokemon not found. Try a valid name'})

        const poke = BuildPokemon(response,base,info.card)

        return(poke)
    }catch(e){
        console.error(e.message)
        return {error: e.message}
    }
}

async function getPokemonById(req, res){
    const {id} = req.params
    let response={}
    let poke={}
    let base = null
    console.log('Byid', id)
    try{
        response = await Pokemon.findOne({where:{ id_pokemon: id},include: Type})  
        if(response){
            base='server'
        }else{
            response = await axios(`${API}${POKE}${id}`)
        }
        //si no hay respuesta envía 404
        if(!response){
            res.status(404).send({error: 'Pokemon not Found'})
        }else{
            poke = await BuildPokemon(response,base,info.detail)
            res.status(200).send(poke)
        }
    }catch(e){
        res.status(400).send({error: e.message})
    }  
}

async function getPokemon(req, res){
    const {name} = req.query
    try{
        //si hay nombre lo busca por nombre
        if (name){
            const poke = await getPokemonByName(name)
            res.status(200).send(poke)
        }else{
            //si no ha nombre se trae la lista
            const init = parseInt(req.query.init) || 1,
                final = parseInt(req.query.final) || 12,
                base = req.query.base || 'api'
            const pokeCollection = await getList(init,final,base)
            res.status(200).send(pokeCollection)
        }
    }catch(error){
        console.log(error)
        res.status(400).send({error: error.message})
    }
}

async function createPokemon(req,res){
    const {name, types} = req.body
    try{
        const checkName = await Pokemon.findOne({where:{name: name}})
        if (checkName){
            res.status(400).send({error: {Name: 'This pokemon name already exists. Try another'}})
        }else{
            const id = ( await Pokemon.findAll() ).length+1
            const pokemon = await Pokemon.create({
                id_pokemon: 'A'+id,
                name: name,
                imageFront: req.body.images.front,
                imageBack: req.body.images.backIcon,
                imageIcon: req.body.images.icon?req.body.images.icon:req.body.images.front,
                height: req.body.stats.Height,
                weight: req.body.stats.Weight,
                hp: req.body.stats.Hp,
                attack: req.body.stats.Attack,
                'special-attack': req.body.stats['Special Attack'],
                defense: req.body.stats.Defense,
                'special-defense': req.body.stats['Special Defense'],
                speed: req.body.stats.Speed
            })

            const dbTypes = await Type.findAll({
                where:{name: types}
            });
            
            await pokemon.setTypes(dbTypes);
            const newPokemon = await Pokemon.findOne( { where: {name: name},include: Type})

            res.status(200).send({
                message: 'pokemon created successfully',
                pokemon: {
                    id: newPokemon.id_pokemon,
                    name: newPokemon.name,
                    imageIcon: newPokemon.imageIcon,
                    types: newPokemon.types.map(e=>e.name)
                }
            } )
        }
    }catch(e){
        res.status(500).send({error: e.message})
    }
    getTotalQuantity()
}

async function getTotalQuantity(){
    length=50
    let sum =0
    let check=true
    while (check){
        let response = await axios(`https://pokeapi.co/api/v2/pokemon?offset=${sum}&limit=${length}`)
        let results = response.data.results 
        length = results.length
        sum+= length

        let indexArray = results.map(element=>{
            return parseInt(element.url.split('/')[6])
        })
        for (let i=0; i<indexArray.length-1; i++){
            if(indexArray[i+1]-indexArray[i]!==1){
                sum=indexArray[i]
                check=false
            }
        }
    }
    let local = ( await Pokemon.findAll() ).length
    totalPokemon = {api: sum, server: local}
    console.log('totals', totalPokemon)
}
getTotalQuantity()

module.exports = {getPokemon, createPokemon, getTotalPokemon, getPokemonById}