const {Pokemon, Type} = require('../db/db.js')
const axios = require ('axios')
const {Op} = require ('sequelize')
const {API, IMAGE3D, POKE} = process.env

let totalPokemon ={}

async function getTotalPokemon(req, res){
    res.status(200).send(totalPokemon)
}

async function getPokemonList(req,res){

    let indexes=[]
    let initial = parseInt(req.query.start) || 1
    let limit = parseInt(req.query.limit) || 12
    for (let i=initial; i<=limit; i++)indexes.push(i)
    let pokeData=[]
    let base = req.query.base || null

    try{
        for await (let index of indexes){
            let response ={}
                base?
                    response = await Pokemon.findOne({where:{ id_pokemon: 'A'+index},include: Type})
                    : response = await axios(`${API}${POKE}${index}`)
            const poke={
                name: base? response.name : response.data.species.name,
                imageIcon: base? response.imageIcon: response.data.sprites['front_default'], 
                types: base? response.types.map(e=>e.name) : response.data.types.map(e=>e.type.name),
                bigImage: base? response.imageFront : `${IMAGE3D}${response.data.species.name}.png` 
            }
            pokeData.push(poke)
        }
    }catch(e){
        console.error(e.message)
        res.status(400).send({error: e.message})
    }
    res.status(200).send(pokeData)
}

async function getPokemon(req, res){
    const id = req.query.name? req.query.name : req.params.id
    let poke ={}
    let response = {}
    let base=null
    try{
        if (req.query.name){
            response = await Pokemon.findOne({where:{ name: id},include: Type})
            base='server'  
        }else{
            response = await Pokemon.findOne({where:{ id_pokemon: id},include: Type})  
            base='server'  
        }
        if(!response && ( (req.query.name && !parseInt(id))  || ( !req.query.name) ) ){
            response = await axios(`${API}${POKE}${id}`)
            base=null  
        }

        if( !(response.id_pokemon || response.data.id) ) res.status(404).send({error: 'pokemon not found'})

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
    totalPokemon = {api: sum, created: local}
    console.log('totals', totalPokemon)
}
getTotalQuantity()

module.exports = {getPokemon, createPokemon, getTotalPokemon, getPokemonList}