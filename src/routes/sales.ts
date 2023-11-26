import { FastifyInstance, FastifyRequest } from "fastify";
import prisma from "../services/prisma.services";
import { ISalesCreate } from "../interfaces/createSales.interface";

const salesRoutes = async (fastify: FastifyInstance) => {
    fastify.get("/sales", async (req, res) => {
        const sales = await prisma.vendas.findMany();
        res.code(201).send(sales);
    });
    fastify.post("/sales/create", async (req, res) => {
        try {
            const { produtosVendidos, valorTotal, cpfComprador } = req.body as ISalesCreate;
            let vendaId;
            if (Array.isArray(produtosVendidos)) {
                const novaVendaData: any = {
                    valorTotal,
                    produtosVendidos: {
                        create: produtosVendidos.map(produto => ({
                            quantidade: produto.quantidade,
                            produto: { connect: { id: produto.id } }
                        }))
                    }
                };

                if (cpfComprador) {
                    novaVendaData.cpfComprador = cpfComprador.replace(/\D/g, '');
                }

                const novaVenda = await prisma.vendas.create({
                    data: novaVendaData
                });
                vendaId = novaVenda.id;


            } else {
                console.error('produtosVendidos não é um array.');
                res.code(400).send({ error: 'produtosVendidos deve ser um array' });
                return;
            }
            produtosVendidos.map(async produtos => {
                const quantidadeAtual = await prisma.produto.findMany(
                    {
                        where: {
                            id: produtos.id
                        },
                        select: {
                            quantidade: true
                        }
                    }
                );
                await prisma.produto.updateMany(
                    {
                        where: {
                            id: produtos.id
                        },
                        data: {
                            quantidade: quantidadeAtual[0].quantidade - produtos.quantidade
                        }
                    }
                );
            });
            res.code(201).send({ message: 'Venda realizada com sucesso', vendaId: vendaId });
        } catch (error) {
            console.error('Erro ao processar venda:', error);
            res.code(500).send({ error: 'Erro ao processar venda' });
        }
    });
    fastify.get("/sales/receipt", async function handler(req: FastifyRequest<{ Querystring: { vendaId: number } }>, res) {
        const {vendaId} = req.query;
        try {
            const infoNotaFiscal = await prisma.vendas.findMany(
                {
                    where: {
                        id: vendaId,
                    },
                    select: {
                        id: true,
                        produtosVendidos: true,
                        cpfComprador: true,
                        createdAt: true,
                        valorTotal: true
                    }
                }
            )
            res.code(201).send(infoNotaFiscal);
        } catch (error) {
            console.log(error)
        }
    })
};
export default salesRoutes;