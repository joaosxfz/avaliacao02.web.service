const axios = require("axios")
const dotenv = require("dotenv")

dotenv.config()

async function buscarApod(date) {

    const parametros = {
        api_key: process.env.NASA_API_KEY || "DEMO_KEY"
    }

    if (date) {
        parametros.date = date
    }

    const resposta = await axios.get("https://api.nasa.gov/planetary/apod",
        {
            params: parametros,
            timeout: 5000
        }
    )

    return resposta.data
}

module.exports = {
    buscarApod
}