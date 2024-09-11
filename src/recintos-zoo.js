class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, biomas: ['savana'], total: 10, ocupados: 3, especies: ['MACACO'] },
            { numero: 2, biomas: ['floresta'], total: 5, ocupados: 0, especies: [] },
            { numero: 3, biomas: ['savana', 'rio'], total: 7, ocupados: 2, especies: ['GAZELA'] },
            { numero: 4, biomas: ['rio'], total: 8, ocupados: 0, especies: [] },
            { numero: 5, biomas: ['savana'], total: 9, ocupados: 3, especies: ['LEAO'] }
        ];

        this.animais = {
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {
        if (!this.animais[animal]) {
            return { erro: "Animal inválido", recintosViaveis: false };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: false };
        }

        const { tamanho, biomas: biomasAnimal, carnivoro } = this.animais[animal];

        const recintosViaveis = this.recintos
            .filter(recinto => {
                const biomaCompativel = recinto.biomas.some(bioma => biomasAnimal.includes(bioma));
                const espacoNecessario = quantidade * tamanho + (recinto.especies.length > 0 && recinto.especies.some(especie => animal !== especie) ? 1 : 0);
                const espacoDisponivel = recinto.total - recinto.ocupados;

                const carnivorosNoRecinto = recinto.especies.some(e => this.animais[e].carnivoro && e !== animal);
                const naoPodeConviver = carnivoro && recinto.especies.length > 0 && !recinto.especies.includes(animal);

                // Regras adicionais para hipopótamos e macacos
                const isHipopotamo = animal === "HIPOPOTAMO";
                const isMacaco = animal === "MACACO";

                if (isHipopotamo && recinto.especies.length > 0 && (!recinto.biomas.includes('rio') || !recinto.biomas.includes('savana'))) {
                    return false; // Hipopótamos só convivem com outros se o recinto tiver rio
                }

                if (isMacaco && recinto.especies.length === 0 && quantidade === 1) {
                    return false; // Macacos precisam de pelo menos um outro animal
                }

                return biomaCompativel && espacoDisponivel >= espacoNecessario && !carnivorosNoRecinto && !naoPodeConviver;
            })
            .map(recinto => {
                const espacoLivre = recinto.total - (recinto.ocupados + quantidade * tamanho + (recinto.especies.length > 0 && recinto.especies.some(especie => animal !== especie) ? 1 : 0));
                return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.total})`;
            });

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: false };
        }

        return {
            erro: false,
            recintosViaveis: recintosViaveis.sort((a, b) => {
                const numeroA = parseInt(a.match(/Recinto (\d+)/)[1]);
                const numeroB = parseInt(b.match(/Recinto (\d+)/)[1]);
                return numeroA - numeroB;
            })
        };
    }
}

export { RecintosZoo as RecintosZoo };
