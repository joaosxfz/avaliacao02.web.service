const express = require("express")
const cors = require("cors")
const swaggerUi = require("swagger-ui-express")
const missoesRoutes = require("./routes/missoes.routes")
const swaggerSpec = require("./docs/swagger")

const app = express()

app.use(express.json())
app.use(cors())
app.use(missoesRoutes)

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
)

app.use((req, res) => {
    res.status(404).json({
        error: "Rota não encontrada"
    })
})

module.exports = app