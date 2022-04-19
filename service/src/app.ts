import cors from "cors";
import { json, urlencoded } from "express";
import helmet from "helmet";
import Express from 'express';
import * as config from './config';
import { StatusCodes } from 'http-status-codes';


const app = Express();
app.use(cors());
app.use(json());
app.use(
  urlencoded({
    extended: true,
  }),
);
app.use(helmet());

//app.use('/playlistmanagerapi/api/v1', playlistRouter());

//app.use('/playlistmanagerapi/index.html', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
  (
    err: Error & { status: number },
    _request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction,
  ): void => {
    response.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR);
    response.json({
      error: config.SHOW_DETAILED_ERROR ? err.message : config.SERVER_ERROR,
    });
    next();
  },
);

export default app;