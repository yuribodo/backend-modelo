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

      // Verifica se produtosVendidos é um array
      if (!Array.isArray(produtosVendidos)) {
        console.error('produtosVendidos não é um array.');
        res.code(400).send({ error: 'produtosVendidos deve ser um array' });
        return;
      }

      // Verifica a disponibilidade de estoque para cada produto
      for (const produto of produtosVendidos) {
        const produtoExistente = await prisma.produto.findUnique({
          where: {
            id: produto.id
          },
          select: {
            quantidade: true
          }
        });

        if (!produtoExistente || produtoExistente.quantidade < produto.quantidade) {
          res.code(400).send({ error: `Produto '${produto.nome}' não possui estoque suficiente` });
          return;
        }
      }

      // Se todos os produtos possuem estoque suficiente, realiza a venda
      const novaVenda = await prisma.vendas.create({
        data: {
          valorTotal,
          produtosVendidos: {
            create: produtosVendidos.map(produto => ({
              quantidade: produto.quantidade,
              produto: { connect: { id: produto.id } }
            }))
          },
          cpfComprador: cpfComprador ? cpfComprador.replace(/\D/g, '') : undefined
        }
      });



      // Atualiza o estoque após a venda
      produtosVendidos.forEach(async (produto, index) => {
        const valorUnitario = await prisma.produto.findUnique({
          where: {
            id: produto.id
          },
          select: {
            valorUnitario: true
          }
        })
        if (typeof valorUnitario == "number") {

          await prisma.produto.update({
            where: {
              id: produto.id
            },
            data: {
              quantidade: {
                decrement: produto.quantidade
              },
              valorTotal: {
                decrement: produto.quantidade * valorUnitario
              }
            }
          });
        }
      })

      res.code(201).send({ message: 'Venda realizada com sucesso', vendaId: novaVenda.id });
    } catch (error) {
      console.error('Erro ao processar venda:', error);
      res.code(500).send({ error: 'Erro ao processar venda' });
    }
  });

  fastify.get("/sales/receipt", async function handler(req: FastifyRequest<{ Querystring: { vendaId: number } }>, res) {
    const { vendaId } = req.query;
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
      if (!infoNotaFiscal) {
        res.code(404).send({ error: 'Venda não encontrada' });
        return;
      }
      res.code(201).send(infoNotaFiscal);
    } catch (error) {
      console.log(error)
    }
  })
};
export default salesRoutes;