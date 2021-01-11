import APIServer from './APIServer';
import { Request, Response } from 'express';

const server = new APIServer();

type propertyKey = string | symbol;

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
  
  @logRoute()
  @route(methods.GET, '/people')
  @authenticate('123456')
  public peopleRoute(req: Request, res: Response) {
    return {
      people: [
        {
          'firstName': 'David',
          'lastName': 'Tucker',
        },
        {
          'firstName': 'Abid',
          'lastName': 'Ali',
        },
      ],
    }
  }
}

function route(method: methods, path: string): MethodDecorator {
  return function (target: Object, propertyKey: propertyKey, descriptor: PropertyDescriptor) {
    server.app[ method ](path, (req: Request, res: Response) => {
      res.status(200).json(descriptor.value(req, res));
    });
  }
}

function logRoute(): MethodDecorator {
  return function (target: Object, propertyKey: propertyKey, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      let req = args[ 0 ] as Request;
      console.log(`${req.url} ${req.method} called`);
      return original.apply(this, args);
    }
  }
}

function authenticate(key: string): MethodDecorator {
  return function (target: Object, propertyKey: propertyKey, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const req = args[ 0 ] as Request;
      const res = args[ 1 ] as Response;
      const headers = req.headers;
      if ( headers.hasOwnProperty('apikey') && headers.apikey === key ) {
        return original.apply(this, args);
      }
      res.status(403).json({ error: 'Not authorized' })
    }
  }
}

server.start();
