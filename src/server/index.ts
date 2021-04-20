import 'dotenv/config';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import express, {NextFunction, Request, Response} from 'express';
import cors, {CorsOptions} from 'cors';
import cookieParser from 'cookie-parser';
import StatusCodes from 'http-status-codes';
import {isDevEnv, logger} from '../utils';

const {PORT, NODE_ENV} = process.env;

type Error = {
  stack: any;
  status: number;
};

const corsOptions: CorsOptions = {
  origin: true,
  credentials: true,
};

const app = express();
const appPort = parseInt(PORT || '3001', 10);

const initApp = async () => {
  try {
    app.use(helmet());
    app.use(
      morgan(isDevEnv ? 'dev' : 'combined', {
        skip: (_req: Request, res: Response) => res.statusCode < 400,
      })
    );
    app.set('trust proxy', 1);
    app.use(cors(corsOptions));
    app.use(cookieParser());
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use(compression());
    app.disable('x-powered-by');

    app.get('/', (_req: Request, res: Response) => {
      res.set('Content-Type', 'text/html');
      res.status(StatusCodes.OK).send('API');
    });

    app.listen(appPort, () => {
      logger.info(`> Ready at http://localhost:${appPort}`);
      logger.info(`> Successfully started App`);
      logger.info(`> NODE_ENV: ${NODE_ENV}`);
      logger.info('> Press CTRL-C to stop\n');
    });

    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      logger.error(err);
      res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).send(err.stack);
    });
  } catch (error) {
    logger.error('Error starting App', {error});
    process.exit(1);
  }
};

initApp();

export default app;