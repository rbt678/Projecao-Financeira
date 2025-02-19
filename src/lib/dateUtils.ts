// lib/dateUtils.ts

// Retorna o nome do mês com o ano, baseado no índice (0 = mês atual)
export const obterMesString = (n: number): string => {
    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth();
    const anoAtual = dataAtual.getFullYear();

    let novoMes = mesAtual + n;
    let novoAno = anoAtual;

    if (novoMes > 11) {
        novoAno += Math.floor(novoMes / 12);
        novoMes = novoMes % 12;
    } else if (novoMes < 0) {
        novoAno += Math.ceil(novoMes / 12) - 1;
        novoMes = (novoMes % 12 + 12) % 12;
    }

    const nomesDosMeses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    return `${nomesDosMeses[novoMes]} de ${novoAno}`;
};