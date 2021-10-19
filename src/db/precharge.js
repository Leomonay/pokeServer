const {createPokemon} = require('../controllers/pokemonController')

const createdPokes=[
    // {
    //     "name": "jiminicricket",
    //     "types": [ "bug", "psychic" ],
    //     "images": {
    //         "icon": "https://pa1.narvii.com/6467/6eeaaf30234f850eb234cbdafcaa936cdbfa807c_hq.gif",
    //         "front": "https://i.pinimg.com/originals/25/d6/69/25d66915e7647b64a86198be5b89539e.png",
    //         "backIcon": "https://2img.net/r/ihimizer/img197/8240/pinocho20.gif"
    //     },
    //     "stats": {
    //         "Hp": 75,
    //         "Height": 65,
    //         "Weight": 15,
    //         "Attack": 55,
    //         "Special Attack": 100,
    //         "Defense": 75,
    //         "Special Defense": 120,
    //         "Speed": 95
    //     },
    // },
    {
        "name": "jengi",
        "types": [ "normal", "fairy" ],
        "images": {
        "front": "https://i.ibb.co/FBFdSsd/Gingy.png",
        "backIcon":'',
        "icon":'',
        },
        "stats": {
        "Hp": 80,
        "Height": 120,
        "Weight": 30,
        "Attack": 80,
        "Special Attack": 70,
        "Defense": 90,
        "Special Defense": 70,
        "Speed": 80
        },
    },
    {
        name: "bipolarbear",
        types: ["ice"],
        images: {
            front: "https://i.postimg.cc/j2pvMvS4/Bipolar-Bear.png",
            backIcon: '',
            icon:''
        },
        stats:{
            'Hp': 120,
            'Height': 200,     
            'Weight': 200,
            'Attack': 100,
            'Special Attack':100,
            'Defense': 80,
            'Special Defense': 95,
            'Speed': 80,
        },
    },
    {
        name: 'gumgolem',
        types: [ 'normal', 'fairy' ],
        images: {
          front: 'https://i.postimg.cc/cHJDCrzw/Gum-Gollem.png',
          backIcon: '',
          icon: ''
        },
        stats: {
          Hp: 80,
          Height: 400,
          Weight: 300,
          Attack: 110,
          'Special Attack': 80,
          Defense: 130,
          'Special Defense': 100,
          Speed: 55
        }
    },
    {
        "name": "stitch",
        "types": [ "dark", "electric" ],
        "images": {
            "icon": "https://www.pnguniverse.com/wp-content/uploads/2020/10/Stitch.png",
            "front": "https://1.bp.blogspot.com/-wGkDh9SVEBc/Xqg4U3Heu_I/AAAAAAAAU-I/SKVmrARUHT8n8LyhF_C52aDaIboCwfxowCLcBGAsYHQ/s1600/L%2526S%2Bclipart%2B%252317.png",
            "backIcon": "https://i.ibb.co/pKFhsHR/stich-back.png"
        },
        "stats": {
            "Hp": 80,
            "Height": 100,
            "Weight": 60,
            "Attack": 110,
            "Special Attack": 85,
            "Defense": 95,
            "Special Defense": 75,
            "Speed": 110
        },
    },
    {
        name: 'harpy',
        types: [ 'flying', 'electric' ],
        images: {
          front: 'https://i.postimg.cc/h4NBFBJp/Harpy.png',
          backIcon: '',
          icon: ''
        },
        stats: {
          Hp: 75,
          Height: 40,
          Weight: 60,
          Attack: 90,
          'Special Attack': 70,
          Defense: 90,
          'Special Defense': 65,
          Speed: 110
        }
      },
      {
        name: 'hippogriff',
        types: [ 'dark', 'flying' ],
        images: {
          front: 'https://i.postimg.cc/cCgX7P0J/Hipopogrifo.png',
          backIcon: '',
          icon: ''
        },
        stats: {
          Hp: 90,
          Height: 350,
          Weight: 400,
          Attack: 80,
          'Special Attack': 90,
          Defense: 90,
          'Special Defense': 75,
          Speed: 80
        }
    },
    {
        "name": "grogu",
        "types": [ "fighting", "psychic" ],
        "images": {
            "icon": "https://www.pnguniverse.com/wp-content/uploads/2021/03/Grogu-the-child.png",
            "front": "https://i.ibb.co/g3YLgMW/Grogu-main.png",
            "backIcon": "https://i.ibb.co/N1ZDXs7/Grogu-back.png"
        },
        "stats": {
            "Hp": 80,
            "Height": 60,
            "Weight": 60,
            "Attack": 80,
            "Special Attack": 130,
            "Defense": 75,
            "Special Defense": 100,
            "Speed": 75
        },
    },
    {
        name: 'mantychorhynchus',
        types: [ 'psychic', 'dragon' ],
        images: {
          front: 'https://i.postimg.cc/DysKnMLF/Manticorrinco.png',
          backIcon: '',
          icon: ''
        },
        stats: {
          Hp: 100,
          Height: 240,
          Weight: 130,
          Attack: 95,
          'Special Attack': 110,
          Defense: 85,
          'Special Defense': 105,
          Speed: 110
        }
    },
    {
        "name": "nemo",
        "types": [ "water" ],
        "images": {
            "icon": "",
            "front": "https://i.ibb.co/FDCC0ZG/58f37974a4fa116215a92420.png",
            "backIcon": ""
        },
        "stats": {
            "Hp": 80,
            "Height": 35,
            "Weight": 25,
            "Attack": 85,
            "Special Attack": 105,
            "Defense": 95,
            "Special Defense": 60,
            "Speed": 85
        },
    },
    {
        "name": "22",
        "types": [ "ghost" ],
        "images": {
            "icon": "https://i.ibb.co/LQB1gpg/soul-22.png",
            "front": "https://vkclub.su/_data/stickers/soul22/sticker_vk_soul22_022.png",
            "backIcon": ""
        },
        "stats": {
            "Hp": 80,
            "Height": 60,
            "Weight": 5,
            "Attack": 25,
            "Special Attack": 125,
            "Defense": 60,
            "Special Defense": 130,
            "Speed": 70
        },
    },
    {
        "name": "chimuelo",
        "types": [ "dragon", 'dark' ],
        "images": {
            "icon": "https://i.ibb.co/4JT6Gv3/Chimuelo-Icon.png",
            "front": "http://pngimg.com/uploads/night_fury/night_fury_PNG58.png",
            "backIcon": ""
        },
        "stats": {
            "Hp": 100,
            "Height": 6000,
            "Weight": 250,
            "Attack": 120,
            "Special Attack": 90,
            "Defense": 100,
            "Special Defense": 80,
            "Speed": 110
        },
    }
]

async function precharge(){
    for await (let poke of createdPokes){
        const req={body:poke}
        res={}
        try{
            await createPokemon(req,res)
        }catch(e){
            //ignore errors
        }
    }
}

module.exports = {precharge}