const request = require("supertest")
const axios = require("axios")
const app = require("../src/app")
const { resetMissoes } = require("../src/data/missoes")

jest.mock("axios")

beforeEach(() => {
    resetMissoes()
    jest.clearAllMocks()
})


test("GET /status retorna status ok", async () => {
    const resposta = await request(app).get("/status")

    expect(resposta.status).toBe(200)
    expect(resposta.body.status).toBe("ok")
    expect(resposta.headers["content-type"]).toMatch(/json/)
})


test("GET /missoes retorna as missões cadastradas", async () => {
    const resposta = await request(app).get("/missoes")

    expect(resposta.status).toBe(200)
    expect(resposta.body.length).toBe(5)
    expect(resposta.headers["content-type"]).toMatch(/json/)
})


test("GET /missoes/:id retorna a missão encontrada", async () => {
    const resposta = await request(app).get("/missoes/1")

    expect(resposta.status).toBe(200)
    expect(resposta.body.id).toBe(1)
    expect(resposta.body.nome).toBe("Apollo 11")
    expect(resposta.headers["content-type"]).toMatch(/json/)
})


test("GET /missoes/:id retorna erro quando a missão não existe", async () => {
    const resposta = await request(app).get("/missoes/999")

    expect(resposta.status).toBe(404)
    expect(resposta.body.error).toBe("Missão não encontrada")
    expect(resposta.headers["content-type"]).toMatch(/json/)
})


test("POST /missoes cria uma nova missão", async () => {
    const resposta = await request(app).post("/missoes")
        .send({
            nome: "Artemis III",
            ano: 2027,
            agencia: "NASA",
            status: "Planejada"
        })

    expect(resposta.status).toBe(201)
    expect(resposta.body.id).toBe(6)
    expect(resposta.body.nome).toBe("Artemis III")
    expect(resposta.headers["content-type"]).toMatch(/json/)
})


test("POST /missoes retorna erro quando o nome não é informado", async () => {
    const resposta = await request(app).post("/missoes")
        .send({
            ano: 2027,
            agencia: "NASA",
            status: "Planejada"
        })

    expect(resposta.status).toBe(400)
    expect(resposta.body.error).toBe("Nome é obrigatório")
    expect(resposta.headers["content-type"]).toMatch(/json/)
})


test("POST /missoes retorna erro quando o ano é inválido", async () => {
    const resposta = await request(app).post("/missoes")
        .send({
            nome: "Artemis III",
            ano: "2027",
            agencia: "NASA",
            status: "Planejada"
        })

    expect(resposta.status).toBe(400)
    expect(resposta.body.error).toBe("Ano é obrigatório")
})


test("PUT /missoes/:id atualiza uma missão", async () => {
    const resposta = await request(app).put("/missoes/1")
        .send({
            nome: "Apollo 11 Atualizada",
            ano: 1969,
            agencia: "NASA",
            status: "Concluída"
        })

    expect(resposta.status).toBe(200)
    expect(resposta.body.id).toBe(1)
    expect(resposta.body.nome).toBe("Apollo 11 Atualizada")
    expect(resposta.body.status).toBe("Concluída")
    expect(resposta.headers["content-type"]).toMatch(/json/)
})


test("PUT /missoes/:id retorna erro quando a missão não existe", async () => {
    const resposta = await request(app).put("/missoes/999")
        .send({
            nome: "Missão inexistente",
            ano: 2027,
            agencia: "NASA",
            status: "Planejada"
        })

    expect(resposta.status).toBe(404)
    expect(resposta.body.error).toBe("Missão não encontrada")
    expect(resposta.headers["content-type"]).toMatch(/json/)
})


test("PUT /missoes/:id retorna erro quando os dados são inválidos", async () => {
    const resposta = await request(app).put("/missoes/1")
        .send({
            nome: "",
            ano: 2027,
            agencia: "NASA",
            status: "Planejada"
        })

    expect(resposta.status).toBe(400)
    expect(resposta.body.error).toBe("Nome é obrigatório")
    expect(resposta.headers["content-type"]).toMatch(/json/)
})


test("DELETE /missoes/:id remove a missão", async () => {
    const resposta = await request(app).delete("/missoes/5")

    expect(resposta.status).toBe(204)
    expect(resposta.body).toEqual({})
})


test("DELETE /missoes/:id retorna erro quando a missão não existe", async () => {
    const resposta = await request(app).delete("/missoes/999")

    expect(resposta.status).toBe(404)
    expect(resposta.body.error).toBe("Missão não encontrada")
    expect(resposta.headers["content-type"]).toMatch(/json/)
})


test("DELETE /missoes/:id remove a missão e ela não é mais encontrada", async () => {
    await request(app).delete("/missoes/1")

    const resposta = await request(app).get("/missoes/1")

    expect(resposta.status).toBe(404)
    expect(resposta.body.error).toBe("Missão não encontrada")
})


test("GET /apod retorna os dados da NASA", async () => {
    axios.get.mockResolvedValue({
        data: {
            date: "2024-01-15",
            title: "Foto do dia",
            explanation: "Explicação",
            media_type: "image",
            url: "https://exemplo.com/imagem.jpg"
        }
    })

    const resposta = await request(app).get("/apod")

    expect(resposta.status).toBe(200)
    expect(resposta.body.title).toBe("Foto do dia")
    expect(resposta.body.media_type).toBe("image")
    expect(resposta.headers["content-type"]).toMatch(/json/)
})


test("GET /apod envia a data para a NASA", async () => {
    axios.get.mockResolvedValue({
        data: {
            date: "2024-01-15",
            title: "Foto do dia",
            media_type: "image"
        }
    })

    await request(app).get("/apod?date=2024-01-15")

    expect(axios.get).toHaveBeenCalledWith(
        "https://api.nasa.gov/planetary/apod",
        expect.objectContaining({
            params: expect.objectContaining({ date: "2024-01-15" })
        })
    )
})


test("GET /apod retorna erro quando a data é inválida", async () => {
    const resposta = await request(app)
        .get("/apod?date=15-01-2024")

    expect(resposta.status).toBe(400)
    expect(resposta.body.erro).toBe("Data inválida")
    expect(axios.get).not.toHaveBeenCalled()
})


test("GET /apod retorna 502 quando ocorre erro na NASA", async () => {
    axios.get.mockRejectedValue(
        new Error("Erro de rede")
    )

    const resposta = await request(app).get("/apod")

    expect(resposta.status).toBe(502)
    expect(resposta.body.erro).toBe(
        "Falha ao consultar a NASA"
    )
})


test("GET /apod retorna 504 quando ocorre timeout", async () => {
    const erro = new Error("Timeout")
    erro.code = "ECONNABORTED"

    axios.get.mockRejectedValue(erro)

    const resposta = await request(app).get("/apod")

    expect(resposta.status).toBe(504)
    expect(resposta.body.erro).toBe(
        "Tempo limite excedido ao consultar a NASA"
    )
})