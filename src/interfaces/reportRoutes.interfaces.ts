export interface IMateriais{
    id:number;
    nome:string;
    quantidadeInicial: number,
    valorTotalInicial: number,

}

export interface IRelatorioFinanceiro {
    totalVendas: number,
    totalEstoque: number,
    valorInicialEstoque: number,
}
export interface IRelatorioEntradaMateriais {
    quantidadeDeEstoqueDeMateriais: number,
    valorTotalDeEstoqueDeMateriais: number,
    materiais: IMateriais[]
}