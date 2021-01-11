import BaseEntity from './BaseEntity';
import { entity, id, persist } from '../decorators';

@entity("people")
export default class Person extends BaseEntity {
  @id
  id: string;
  
  @persist
  firstName: string;
  
  @persist
  lastName: string;
  
  @persist
  email: string;
  
  @persist
  department: string;
  
  @persist
  mobileNumber: string;
  
  @persist
  age: number;
}
