const missoes = [
    {
        id: 1,
        nome: "Apollo 11",
        ano: 1969,
        agencia: "NASA",
        status: "Concluída"
    },
    {
        id: 2,
        nome: "Voyager 1",
        ano: 1977,
        agencia: "NASA",
        status: "Em operação"
    },
    {
        id: 3,
        nome: "Artemis II",
        ano: 2026,
        agencia: "NASA",
        status: "Planejada"
    },
    {
        id: 4,
        nome: "Apollo 13",
        ano: 1970,
        agencia: "NASA",
        status: "Concluída"
    },
    {
        id: 5,
        nome: "Mars Pathfinder",
        ano: 1997,
        agencia: "NASA",
        status: "Concluída"
    }
]

let proximoId = 6

function novoId() {
    const id = proximoId
    proximoId++
    return id
}

function resetMissoes() {
    missoes.length = 0

    missoes.push(
        {
            id: 1,
            nome: "Apollo 11",
            ano: 1969,
            agencia: "NASA",
            status: "Concluída"
        },
        {
            id: 2,
            nome: "Voyager 1",
            ano: 1977,
            agencia: "NASA",
            status: "Em operação"
        },
        {
            id: 3,
            nome: "Artemis II",
            ano: 2026,
            agencia: "NASA",
            status: "Planejada"
        },
        {
            id: 4,
            nome: "Apollo 13",
            ano: 1970,
            agencia: "NASA",
            status: "Concluída"
        },
        {
            id: 5,
            nome: "Mars Pathfinder",
            ano: 1997,
            agencia: "NASA",
            status: "Concluída"
        }
    )

    proximoId = 6
}

module.exports = {
    missoes,
    novoId,
    resetMissoes
}