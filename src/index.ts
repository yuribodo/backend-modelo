import fastify from 'fastify';
import products from "./routes/product";
import sales from "./routes/sales";
import report from './routes/report';

const app = fastify({ logger: true });

// Middleware para lidar com CORS
app.addHook('onRequest', (request, reply, done) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    reply.header('Access-Control-Allow-Headers', 'Content-Type');
    reply.header('Access-Control-Allow-Credentials', 'true');
  
    // Verificar se é uma solicitação OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
      return reply.status(200).send(); // Responder com OK para solicitações OPTIONS
    }
  
    done();
  });

// Declarando as rotas dos produtos
app.register(products);
app.register(sales);
app.register(report);

// Iniciar o servidor
app
  .listen({
    port: 8080,
    host: '0.0.0.0', // Permite que o servidor seja acessado externamente
  })
  .then(() => console.log(`🚀 HTTP server running on http://0.0.0.0:8080/`))
  .catch(err => console.error(err));
