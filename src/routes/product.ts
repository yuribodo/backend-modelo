import { FastifyInstance, FastifyRequest } from "fastify";
import { ICreateProduct } from "../interfaces/createProduct.interface";
import verifyName from "../controllers/products/find.name";
import prisma from "../services/prisma.services";
import products from "../controllers/products/read.products";

const productRoutes = async (fastify: FastifyInstance) => {
    fastify.post('/product/create', async function handler(request, reply) {
        const product = request.body as ICreateProduct;
        try {
            const products = await verifyName(product.nome);
            if (products.length = 0) {

                reply.status(500).send({ message: "Produto informado já cadastrado, atualize as informações ou crie um novo." })
            } else {
                const novoProduto = await prisma.produto.create({
                    data: {
                        nome: product.nome,
                        dataFabricacao: new Date(product.dataFabricacao),
                        dataVencimento: new Date(product.dataVencimento),
                        quantidade: product.quantidade,
                        quantidadeInicial: product.quantidade,
                        valorUnitario: product.valorUnitario,
                        valorTotal: (product.quantidade * product.valorUnitario),
                        valorTotalInicial: (product.quantidade * product.valorUnitario),
                        perecivel: product.perecivel,
                    },
                });

                reply.code(201).send(novoProduto);
            }
        } catch (error) {
            console.error(error);
            reply.status(500).send({ message: 'Erro ao criar um novo produto' });
        }
    });

    fastify.put("/product/update", async function handler(req, res) {
        const updateProducts = req.body as ICreateProduct;
        try {
            const products = await prisma.produto.updateMany(
                {
                    where: {
                        nome: updateProducts.nome,
                    },
                    data: {
                        nome: updateProducts.nome,
                        dataFabricacao: new Date(updateProducts.dataFabricacao),
                        dataVencimento: new Date(updateProducts.dataVencimento),
                        quantidade: updateProducts.quantidade,
                        valorUnitario: updateProducts.valorUnitario,
                        valorTotal: (updateProducts.quantidade * updateProducts.valorUnitario),
                        perecivel: updateProducts.perecivel,
                    },
                });
        } catch (err) {
            console.log(err);
        }
    });

    fastify.get("/products",products
    );
    fastify.get("/product/findBySell", async function handler(req: FastifyRequest<{ Querystring: { nome: string } }>, res) {
        const { nome } = req.query;
        const nomeLowerCase = nome.toLowerCase();
        try {
            const products = await prisma.produto.findMany(
                {
                    where: {
                        nome: {
                            contains: nomeLowerCase,
                        },
                    },
                    select: { 
                        nome: true, 
                        dataFabricacao: true, 
                        dataVencimento: true,
                        quantidade: true,
                        valorUnitario:true,
                     },

                },
            );
            if (products.length > 0)
                res.code(201).send(products);
            else
                return;
        } catch (err) {
            console.error(err);
            res.status(500).send({ message: "Erro ao consultar produtos" })
        }
    });
    fastify.get("/product/find", async function handler(req: FastifyRequest<{ Querystring: { nome: string } }>, res) {
        const { nome } = req.query;
        const nomeLowerCase = nome.toLowerCase();
        try {
            const products = await prisma.produto.findMany(
                {
                    where: {
                        nome: {
                            contains: nomeLowerCase,
                        },
                    },
                },
            );
            if (products.length > 0)
                res.code(201).send(products);
            else
                return;
        } catch (err) {
            console.error(err);
            res.status(500).send({ message: "Erro ao consultar produtos" })
        }
    })

    fastify.put('/product/update/:productId', async function handler(req: FastifyRequest<{ Params: { productId: string } }>, res) {
        const { productId } = req.params;
        const updateProduct = req.body as ICreateProduct;
      
        try {
          const updatedProduct = await prisma.produto.update({
            where: {
              id: parseInt(productId),
            },
            data: {
              nome: updateProduct.nome,
              dataFabricacao: new Date(updateProduct.dataFabricacao),
              dataVencimento: new Date(updateProduct.dataVencimento),
              quantidade: updateProduct.quantidade,
              valorUnitario: updateProduct.valorUnitario,
              valorTotal: updateProduct.quantidade * updateProduct.valorUnitario,
              perecivel: updateProduct.perecivel,
            },
          });
      
          res.code(200).send(updatedProduct);
        } catch (err) {
          console.error(err);
          res.status(500).send({ message: 'Erro ao atualizar o produto' });
        }
      });
    
      fastify.delete("/product/delete/:productId", async function handler(req, res) {
        const { productId } = req.params as { productId: string };
        try {
          const deletedProduct = await prisma.produto.delete({
            where: {
              id: parseInt(productId),
            },
          });
      
          res.code(200).send(deletedProduct);
        } catch (err) {
          console.error(err);
          res.status(500).send({ message: 'Erro ao excluir o produto' });
        }
      });
}
export default productRoutes;