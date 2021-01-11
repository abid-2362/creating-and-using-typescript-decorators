import { db } from '../app';
import { Request, Response } from 'express';
import { propertyKey } from '../types';

interface UserDetails {
  username: string;
  password: string;
}

interface UsersDBData {
  [ key: string ]: UserRecord
}

interface UserRecord {
  password: string,
  permissions: {
    people: string[]
  }
}

export function auth(requiredRole: string): MethodDecorator {
  return function (target: Object, propertyKey: propertyKey, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const req: Request = args[ 0 ] as Request;
      const res: Response = args[ 1 ] as Response;
      const url = req.url;
      const entity = req.baseUrl.replace('/', '');
      const authHeader = req.headers.authorization;
      // Did user pass in authentication
      if ( !authHeader ) {
        res.status(403).send('Not Authorized');
        return;
      }
      
      // Is this a valid user with a valid password
      if ( !isValidUser(authHeader) ) {
        res.status(403).send('Invalid User');
        return;
      }
      
      // Does user possess the correct role
      if ( !doesUserHavePermissions(entity, requiredRole, authHeader) ) {
        res.status(403).send('User does not have permission');
        return;
      }
      original.apply(this, args);
    }
  }
}


function getUserDetails(authHeader: string): UserDetails {
  const base64Auth: string = ( authHeader || '' ).split(' ')[ 1 ] || '';
  const strAuth: string = Buffer.from(base64Auth, 'base64').toString();
  const splitIndex: number = strAuth.indexOf(':');
  const username: string = strAuth.substring(0, splitIndex);
  const password: string = strAuth.substring(splitIndex + 1);
  
  return {
    username: username,
    password: password,
  };
}

function isValidUser(authHeader: string): boolean {
  const details = getUserDetails(authHeader);
  let users: UsersDBData;
  try {
    users = db.getData('/users');
  } catch (err) {
    console.error(err);
    return false;
  }
  
  if ( !users.hasOwnProperty(details.username) ) {
    return false;
  }
  // if ( users[ details.username ].password !== details.password ) {
  //   return false;
  // }
  // return true
  return users[ details.username ].password === details.password;
}

function doesUserHavePermissions(entityName: string, requiredRole: string, authHeader: string): boolean {
  const users: UsersDBData = db.getData(`/users`) as UsersDBData;
  const details = getUserDetails(authHeader);
  const userRoles = users[ details.username ].permissions[ entityName ];
  if ( !userRoles ) {
    return false;
  }
  // if ( userRoles && userRoles.indexOf(requiredRole) > -1 ) {
  //   return true;
  // }
  // return false;
  return !!( userRoles && userRoles.indexOf(requiredRole) > -1 );
}
