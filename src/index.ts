// Require the framework and instantiate it
import fastify from 'fastify';
const app = fastify({ logger: true });
// Declarando as rotas dos produtos
app.register(require("./routes/product"))

// Run the server!
app
    .listen({ port: 8080 })
    .then(() => console.log(`🚀 HTTP server running on http://localhost:8080/`))
    .catch(err => console.error(err));