import { propertyKey } from '../types';
import 'reflect-metadata';

// class decorator implemented as a decorator factory
export function entity(name: string): ClassDecorator {
  return function (constructor: Function) {
    Reflect.defineMetadata('entity:name', name, constructor);
  }
}

// PropertyDecorator within a class
export const persist: PropertyDecorator = (target: any, propertyKey: propertyKey) => {
  let objectProperties: string[] = Reflect.getMetadata('entity:properties', target) || [];
  if ( !objectProperties.includes(propertyKey as string) ) {
    objectProperties.push(propertyKey as string);
    Reflect.defineMetadata('entity:properties', objectProperties, target);
  }
}

// export function id(target: any, propertyKey: propertyKey) {
//   Reflect.defineMetadata('entity:id', propertyKey, target);
// }
export const id: PropertyDecorator = (target: Object, propertyKey: propertyKey) => {
  Reflect.defineMetadata('entity:id', propertyKey, target);
}
