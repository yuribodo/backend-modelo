
import fastify from 'fastify';
import products from "./routes/product";
import sales from "./routes/sales";
import report from './routes/report';
const app = fastify({ logger: true });

// Declarando as rotas dos produtos
app.register(products);
app.register(sales);
app.register(report);

// Run the server!
app
    .listen({ port: 8080 })
    .then(() => console.log(`🚀 HTTP server running on http://localhost:8080/`))
    .catch(err => console.error(err));