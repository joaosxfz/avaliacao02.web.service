import swaggerJsdoc from "swagger-jsdoc"

const opcoes = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Missões Espaciais",
            version: "1.0.0"
        }
    },

    apis: ["./src/routes/missoes.routes.js"]
}

export default swaggerJsdoc(opcoes)