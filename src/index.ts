// Require the framework and instantiate it
import fastify, { FastifyRequest } from 'fastify';
import prisma from './services/prisma.services';
import { ICreateProduct } from './interfaces/createProduct.interface';
const app = fastify({ logger: true });
// Declare a route
app.post('/create', async function handler(request, reply) {
    const product = request.body as ICreateProduct;
    try {
        const novoProduto = await prisma.produto.create({
            data: {
                nome: product.nome,
                descricao: product.descricao,
                preco: product.preco,
                estoque: product.estoque,
            },
        });

        reply.code(201).send(novoProduto);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'Erro ao criar um novo produto' });
    }
});

app.get("/products", async function handler(req, res) {
    try {
        const allProducts = await prisma.produto.findMany();
        res.code(201).send(allProducts);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Erro ao consultar produtos" })
    }
})
app.get("/product", async function handler(req: FastifyRequest<{ Querystring: { name: string } }>, res) {
    const { name } = req.query;
    try {
        const products = await prisma.produto.findMany(
            {
                where: {
                    nome: name
                }
            }
        );

        res.code(201).send(products);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Erro ao consultar produtos" })
    }
})
// Run the server!
app
    .listen({ port: 8080 })
    .then(() => console.log(`🚀 HTTP server running on http://localhost:8080/`))
    .catch(err => console.error(err));