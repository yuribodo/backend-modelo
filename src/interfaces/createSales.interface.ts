interface IProdutosVendidos{
    id: number;
    nome: string,
    quantidade: number,
}

export interface ISalesCreate{
    produtosVendidos: IProdutosVendidos[],
    valorTotal: number,
    cpfComprador?: string,
}