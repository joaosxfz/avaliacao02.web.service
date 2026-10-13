const express = require("express")
const { missoes, novoId } = require("../data/missoes")
const { buscarApod } = require("../services/nasa.service")

const router = express.Router()

/**
 * @openapi
 * /status:
 *   get:
 *     summary: Verifica o funcionamento da API
 *     responses:
 *       200:
 *         description: API funcionando corretamente
 */
router.get("/status", (req, res) => {
    res.status(200).json({
        status: "ok"
    })
})


/**
 * @openapi
 * /missoes:
 *   get:
 *     summary: Lista todas as missões
 *     responses:
 *       200:
 *         description: Lista de missões
 */
router.get("/missoes", (req, res) => {
    res.status(200).json(missoes)
})


/**
 * @openapi
 * /missoes/{id}:
 *   get:
 *     summary: Busca uma missão pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Missão encontrada
 *       404:
 *         description: Missão não encontrada
 */
router.get("/missoes/:id", (req, res) => {
    const id = Number(req.params.id)

    const missao = missoes.find(item => item.id === id)

    if (!missao) {
        return res.status(404).json({
            error: "Missão não encontrada"
        })
    }

    res.status(200).json(missao)
})


/**
 * @openapi
 * /missoes:
 *   post:
 *     summary: Cadastra uma nova missão
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - ano
 *               - agencia
 *               - status
 *             properties:
 *               nome:
 *                 type: string
 *               ano:
 *                 type: integer
 *               agencia:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Missão criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/missoes", (req, res) => {
    const corpo = req.body || {}
    const nome = corpo.nome
    const ano = corpo.ano
    const agencia = corpo.agencia
    const status = corpo.status

    if (!nome || typeof nome !== "string") {
        return res.status(400).json({
            error: "Nome é obrigatório"
        })
    }

    if (!ano || typeof ano !== "number") {
        return res.status(400).json({
            error: "Ano é obrigatório"
        })
    }

    if (!agencia || typeof agencia !== "string") {
        return res.status(400).json({
            error: "Agência é obrigatória"
        })
    }

    if (!status || typeof status !== "string") {
        return res.status(400).json({
            error: "Status é obrigatório"
        })
    }

    const novaMissao = {
        id: novoId(),
        nome: nome,
        ano: ano,
        agencia: agencia,
        status: status
    }

    missoes.push(novaMissao)

    res.status(201).json(novaMissao)
})


/**
 * @openapi
 * /missoes/{id}:
 *   put:
 *     summary: Atualiza uma missão pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - ano
 *               - agencia
 *               - status
 *             properties:
 *               nome:
 *                 type: string
 *               ano:
 *                 type: integer
 *               agencia:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Missão atualizada
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Missão não encontrada
 */
router.put("/missoes/:id", (req, res) => {
    const id = Number(req.params.id)

    const missao = missoes.find(item => item.id === id)

    if (!missao) {
        return res.status(404).json({
            error: "Missão não encontrada"
        })
    }

    const corpo = req.body || {}
    const nome = corpo.nome
    const ano = corpo.ano
    const agencia = corpo.agencia
    const status = corpo.status

    if (!nome || typeof nome !== "string") {
        return res.status(400).json({
            error: "Nome é obrigatório"
        })
    }

    if (!ano || typeof ano !== "number") {
        return res.status(400).json({
            error: "Ano é obrigatório"
        })
    }

    if (!agencia || typeof agencia !== "string") {
        return res.status(400).json({
            error: "Agência é obrigatória"
        })
    }

    if (!status || typeof status !== "string") {
        return res.status(400).json({
            error: "Status é obrigatório"
        })
    }

    missao.nome = nome
    missao.ano = ano
    missao.agencia = agencia
    missao.status = status

    res.status(200).json(missao)
})


/**
 * @openapi
 * /missoes/{id}:
 *   delete:
 *     summary: Remove uma missão pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Missão removida com sucesso
 *       404:
 *         description: Missão não encontrada
 */
router.delete("/missoes/:id", (req, res) => {
    const id = Number(req.params.id)

    const indice = missoes.findIndex(item => item.id === id)

    if (indice === -1) {
        return res.status(404).json({
            error: "Missão não encontrada"
        })
    }

    missoes.splice(indice, 1)

    res.status(204).send()
})


/**
 * @openapi
 * /apod:
 *   get:
 *     summary: Consulta a Foto Astronômica do Dia da NASA
 *     parameters:
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Data no formato YYYY-MM-DD
 *     responses:
 *       200:
 *         description: APOD retornado com sucesso
 *       400:
 *         description: Data inválida ou rejeitada pela NASA
 *       429:
 *         description: Limite de requisições atingido
 *       502:
 *         description: Falha ao consultar a NASA
 *       504:
 *         description: Tempo limite excedido
 */
router.get("/apod", async (req, res) => {
    const date = req.query.date

    if (date) {
        const formato = /^\d{4}-\d{2}-\d{2}$/

        if (!formato.test(date)) {
            return res.status(400).json({
                erro: "Data inválida"
            })
        }
    }

    try {
        const dados = await buscarApod(date)

        if (!dados || !dados.title) {
            return res.status(502).json({
                erro: "Falha ao consultar a NASA"
            })
        }

        res.status(200).json(dados)
    } catch (erro) {

        if (erro.code === "ECONNABORTED") {
            return res.status(504).json({
                erro: "Tempo limite excedido ao consultar a NASA"
            })
        }

        if (erro.response && erro.response.status === 429) {
            return res.status(429).json({
                erro: "Limite de requisições da NASA atingido"
            })
        }

        if (erro.response && erro.response.status === 400) {
            return res.status(400).json({
                erro: "Data rejeitada pela NASA"
            })
        }

        res.status(502).json({
            erro: "Falha ao consultar a NASA"
        })
    }
})

module.exports = router