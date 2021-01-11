import { propertyKey } from '../types';
import { Request, Response } from 'express';

export const logRoute: MethodDecorator = (target: Object, propertyKey: propertyKey, descriptor: PropertyDescriptor) => {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    let req = args[ 0 ] as Request;
    let res = args[ 1 ] as Response;
    original.apply(this, args);
    console.log(`${req.ip} [${new Date().toISOString()}] ${req.hostname} ${req.originalUrl} ${req.method} ${res.statusCode}`);
    if ( ['PUT', 'POST'].indexOf(req.method) > -1 ) {
      console.log(`\tBODY: ${JSON.stringify(req.body)}`);
    }
  }
}
