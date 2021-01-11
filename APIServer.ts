import * as http from 'http';
import express, { Request, Response, Express } from 'express';
import bodyParser from 'body-parser';
import BaseEntity from './entities/BaseEntity';
import EntityRouter from './EntityRouter';

export default class APIServer {
  private _app: Express;
  
  get app(): Express {
    return this._app;
  }
  
  private _server: http.Server;
  
  get server(): http.Server {
    return this._server;
  }
  
  constructor() {
    this._app = express();
    
    // Set port
    this._app.set('port', process.env.PORT || 8000);
    
    // Add middleware
    this.configureMiddleware();
  }
  
  public configureMiddleware() {
    // Setup body parsing - required for POSt requests
    this._app.use(bodyParser.json());
    this._app.use(bodyParser.urlencoded({ extended: true }));
    
    // Setup CORS
    this._app.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methords', 'GET,HEAD,OPTIONS,POST,PUT');
      res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin,Access-Control-Allow-Credentials,Access-Control-Allow-Methords');
      next();
    });
  }
  
  public addEntity<T extends BaseEntity>(clazz) {
    const name = Reflect.getMetadata('entity:name', clazz);
    let entityRouter = new EntityRouter<T>(name, clazz);
    this._app.use(`/${name}`, entityRouter.router);
  }
  
  public start() {
    this._server = this._app.listen(this._app.get('port'), () => {
      console.log(`Server is running on port ${this._app.get('port')}`);
    })
  }
}
