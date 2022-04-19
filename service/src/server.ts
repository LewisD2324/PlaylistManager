import * as http from 'http';
import * as config from './config';
import app from './app';

let server: http.Server;

process.on('uncaughtException', (e) => console.log(e));

async function startServer() : Promise<void> {
     
    server = http.createServer(app);
    server.listen(config.PORT, () => {
      console.info(`App is running at http://localhost:${config.PORT} in ${config.NODE_ENV} mode`);
      console.info('  Press CTRL-C to stop\n');
    });
  
  }
  
  startServer();
  
  export { server };