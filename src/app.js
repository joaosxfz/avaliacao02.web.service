import express from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import missoesRoutes from "./routes/missoes.routes.js"
import swaggerSpec from "./docs/swagger.js"

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

export default app