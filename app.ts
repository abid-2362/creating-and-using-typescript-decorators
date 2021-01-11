function logClass(message: string): ClassDecorator {
  console.log(`${message} evaluated`);
  return function (constructor: Function): void {
    console.log(`${message} called`);
  }
}

function logProperty(message: string): PropertyDecorator {
  console.log(`${message} evaluated`);
  return function (target: Object, propertyKey: string | symbol): void {
    console.log(`${message} called`);
  }
}

function logMethod(message: string): MethodDecorator {
  console.log(`${message} evaluated`);
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor): void {
    console.log(`${message} called`);
  }
}

function logParamerer(message: string): ParameterDecorator {
  console.log(`${message} evaluated`);
  return function (target: Object, propertyKey: string | symbol, parameterIndex: number): void {
    console.log(`${message} called`);
  }
}

@logClass('Class Decorator')
class Person {
  private _directReports: Person[];
  
  @logProperty('Property Decorator')
  public emailAddress: string;
  
  constructor(public firstName: string, public lastName: string) {
    this._directReports = [];
  }
  
  @logMethod('Method Decorator 1')
  @logMethod('Method Decorator 2')
  public addDirectReport(@logParamerer('Parameter Decorator') person: Person) {
    this._directReports.push(person);
  }
}

const person = new Person('David', 'Tucker');
