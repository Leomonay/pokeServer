const {Type} = require('../db/db.js')
const axios = require('axios')
const {API} = process.env

async function getTypes(){
    const typesJson = await axios(API+'type')
    let types = typesJson.data.results.map(e=>e.name).filter(e=>e!=='unknown' && e!=='shadow')
    
    types.map(async (type, index)=>{
        await Type.create({
            id_type: index,
            name: type,
        })
    })
}

async function sendTypes(req, res){
    try{
        const types = await Type.findAll();
        res.status(200).send(types.map(e=>e.name))
    }catch(e){
        console.error(e.message)
        res.status(400).send(e.message)
    }
}

module.exports = {sendTypes, getTypes}