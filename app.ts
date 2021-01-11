import APIServer from './APIServer';
import { Request, Response } from 'express';

const server = new APIServer();

// ENUMS
enum methods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

class APIRoutes {
  
  @logRoute()
  @route(methods.GET, '/')
  public indexRoute(req: Request, res: Response) {
    return {
      'Hello': 'World',
    };
  }
}

function route(method: methods, path: string): MethodDecorator {
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    server.app[method](path, (req: Request, res: Response) => {
      res.status(200).json(descriptor.value(req, res));
    });
  }
}

function logRoute(): MethodDecorator {
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      let req = args[0] as Request;
      console.log(`${req.url} ${req.method} called`);
      return original.apply(this, args);
    }
  }
}

server.start();
