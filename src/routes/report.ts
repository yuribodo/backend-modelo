import { FastifyInstance } from "fastify";
import { IMateriais, IRelatorioEntradaMateriais, IRelatorioFinanceiro } from "../interfaces/reportRoutes.interfaces";
import prisma from "../services/prisma.services";

const reportRoutes = async (fastify: FastifyInstance) => {
    fastify.get("/report", async function handler(req, res) {
        try {


            const vendas = await prisma.vendas.findMany(
                {
                    select: {
                        valorTotal: true,
                    }
                }
            );
            let somaVendas: number = 0;
            vendas.forEach(
                vendas => {
                    somaVendas += vendas.valorTotal;
                }
            );
            const estoque = await prisma.produto.findMany(
                {
                    select: {
                        valorTotal: true
                    }
                }
            );
            let somaEstoque: number = 0;
            estoque.forEach(
                estoque => {
                    somaEstoque += estoque.valorTotal;
                }
            );
            const valorInicialEstoque = somaEstoque + somaVendas;

            const relatorioFinanceiro: IRelatorioFinanceiro = {
                totalVendas: somaVendas,
                totalEstoque: somaEstoque,
                valorInicialEstoque,
            };
            res.code(201).send({ message: "Relatório emitido com sucesso!", relatorioFinanceiro });
        } catch (error) {
            res.code(500).send({ message: "Erro ao emitir relatório financeiro" })
        }
    });
    fastify.get("/report/materials/input", async function handler(req, res) {
        try {

            const entradasEstoque = await prisma.produto.findMany(
                {
                    select: {
                        id: true,
                        nome: true,
                        quantidadeInicial: true,
                        valorTotalInicial: true,
                    }
                }
            );
            let somaQuantidadeInicial: number = 0;
            let somaValorTotalInicial: number = 0;
            entradasEstoque.forEach(entradas => {
                somaQuantidadeInicial += entradas.quantidadeInicial;
                somaValorTotalInicial += entradas.valorTotalInicial;
            });
            const relatorioEntradaMateriais: IRelatorioEntradaMateriais = {
                quantidadeDeEstoqueDeMateriais: somaQuantidadeInicial,
                valorTotalDeEstoqueDeMateriais: somaValorTotalInicial,
                materiais: entradasEstoque,
            };
            res.code(201).send(relatorioEntradaMateriais);
        } catch (error) {
            res.send({ message: "Falha na emissão do relátorio." })
        }

    });
    fastify.get("/report/materials/output", async function handler(req, res) {
        try {
            const saidas = await prisma.produtoVendido.findMany({
                select: {
                    quantidade: true,
                    venda: true
                }
            });
            let somaSaidas: number = 0;
            let somaVendas: number = 0;
            saidas.forEach((saidas) => {
                somaSaidas += saidas.quantidade;
                somaVendas += saidas.venda.valorTotal;
            });
            const produtos = await prisma.produto.findMany({
                select: {
                    quantidade: true,
                    valorTotal: true,
                }
            });
            let somaProdutos: number = 0;
            let somaValorTotal: number = 0;
            produtos.forEach((produto) => {
                somaProdutos += produto.quantidade;
                somaValorTotal += produto.valorTotal;
            });
            const produtosVendidos = await prisma.produtoVendido.findMany(
                {
                    select:{
                        id:true,
                        produto:true,
                        quantidade:true,
                        vendaId:true,
                    }
                }
            );
            const retornarProdutosVendidos = produtosVendidos.map(produto => ({
                id: produto.id,
                nomeProduto: produto.produto.nome,
                quantidade: produto.quantidade,
                vendaId: produto.vendaId
              }));
              

            const relatorioSaidaMaterial = {
                quantidadeGeralSaidas: {
                    quantitativoProdutos: somaSaidas,
                    totalVendas: somaVendas,
                },
                quantidadeGeralProdutos: {
                    quantitativoProdutosRestantes: somaProdutos,
                    totalValoresRestantes: somaValorTotal,
                },
                retornarProdutosVendidos,
            }
            res.code(201).send(relatorioSaidaMaterial);

        } catch (error) {
            res.send({ message: "Falha na emissão do relátorio." })
        }
    });
};
export default reportRoutes;