const {Pokemon, Type} = require('../db/db.js')
const axios = require ('axios')
const {Op} = require ('sequelize')
const {API, IMAGE3D, POKE} = process.env

let totalPokemon ={}

async function getTotalPokemon(req, res){
    res.status(200).send(totalPokemon)
}

async function getList(init, final, base){
    let pokeCollection = []
    let indexes = []   
    for(let i = init; i<=final; i++)indexes.push(i)
    try{
        if (base==='server'){
            console.log(base,indexes)
            for await (let index of indexes){
                if(index<=totalPokemon[base]){
                    const response = await Pokemon.findOne({where:{ id_pokemon: 'A'+index},include: Type})
                    const poke ={
                        name: response.name,
                        imageIcon: response.imageIcon, 
                        types: response.types.map(e=>e.name),
                        bigImage: response.imageFront
                    }
                    pokeCollection.push(poke)
                }            
            }
            return(pokeCollection)
        }else{
            let search = []
            for (let index= init; index<=final;index++){
                if(index<=totalPokemon[base]){
                    const id = index
                    console.log(`${API}${POKE}${id}`)
                    search[index-init] = axios(`${API}${POKE}${id}`)
                    .then(response=>{
                        const poke ={
                            index:index,
                            name: response.data.species.name,
                            imageIcon: response.data.sprites['front_default'], 
                            types: response.data.types.map(e=>e.type.name),
                            bigImage: `${IMAGE3D}${response.data.species.name}.png` 
                        }
                        pokeCollection.push(poke)
                    })
                }else{
                    colLength= (index-1)-init+1
                }  
            }
            await Promise.all(search)
            return pokeCollection.sort((a,b)=>a.index-b.index)

        }
    }catch(e){
        console.log(e.message)
        throw new Error(e.message)
    }
}

async function getPokemonList(req,res){
    if (req.query.name){
        try{
            const poke= await getPokemonByName(req.query.name)
            res.status(200).send(poke)
        }catch(e){
            console.error(e)
            res.status(404).send({error: 'Pokemon not found. Try another name'})
        }
    }else{
        try{
            base=req.query.base || 'api'
            let initial = req.query.initial || 1
            let final = req.query.final || 12
            const pokemonCollection = await getList(initial, final, base)
            res.status(200).send(pokemonCollection)
        }catch(e){
            console.log(e.message)
            res.status(404).send({error: 'No Pokemon found'})
        }
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
        const poke={}
            poke.id = base? response.id_pokemon : response.data.id
            poke.name = base? response.name.toUpperCase() : response.data.species.name.toUpperCase()
            poke.imageIcon = base? response.imageIcon : response.data.sprites['front_default']
            poke.bigImage = base? response.imageFront : `${IMAGE3D}${response.data.species.name}.png` 
            poke.types = base? response.types.map(e=>e.name) : response.data.types.map(e=>e.type.name)
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
            //si hay respuesta, construye el pokemon por id.
            poke.id=base? response.id_pokemon : response.data.id
            poke.name= base? response.name.toUpperCase() : response.data.species.name.toUpperCase()
            poke.imageFront= base? response.imageFront : response.data.sprites.other['official-artwork']['front_default']        
            poke.imageBack= base? response.imageBack : response.data.sprites['back_default']
            poke.imageIcon= base? response.imageIcon : response.data.sprites['front_default']
            poke.bigImage= base? response.imageFront : `${IMAGE3D}${response.data.species.name}.png` 
            poke.types= base? response.types.map(e=>e.name) : response.data.types.map(e=>e.type.name)
            poke.stats= base?
                [
                    {name: "Height", value: response.height/100+'m.'},
                    {name: "Weight", value: response.weight+'kg.'},
                    {name: "Health Points", value: response.hp},
                    {name: "Attack", value: response.attack},
                    {name: "Special attack", value: response['special-attack']},
                    {name: "Speed", value: response.speed},
                    {name: "Defense", value: response.defense},
                    {name: "Special defense", value: response['special-defense']}
                ]
                : response.data.stats.map(e => {
                    return {name: e.stat.name[0].toUpperCase()+e.stat.name.slice(1).replace("-"," "), value : e.base_stat}
                    })
                if(!poke.stats.filter(e=>e.name=="Height")[0]){
                    poke.stats.unshift(
                        {name: "Height", value: response.data.height*10+'m.'},
                        {name: "Weight", value: response.data.weight/10+'kg.'})
                }
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
            res.status(400).send({error: 'Name', detail:'This pokemon name already exists. Try another'})
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

            res.status(200).send({
                message: 'pokemon created successfully',
                id: 'A'+id,
                pokemon: await Pokemon.findOne( { where: {name: name} } )
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