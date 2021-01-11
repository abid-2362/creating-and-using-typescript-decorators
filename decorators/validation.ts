import validator from 'validator';
import 'reflect-metadata';
import { propertyKey } from '../types';

type ValidationFunction = (target: any, propertyKey: string, validatorOptions?: any) => string | void;

interface ValidationRule {
  validationOptions?: any;
  validator: ValidationFunction;
}

export function validate(object: any) {
  const keys = Reflect.getMetadata("validation:properties", object) as string[];
  let errorMap = {};
  
  if (!keys || !Array.isArray(keys)) {
    return errorMap;
  }
  
  for ( const key of keys ) {
    const rules: ValidationRule[] = Reflect.getMetadata("validation:rules", object, key) || [] as ValidationRule[]
    if (!Array.isArray(rules)) {
      continue;
    }
  
    for ( const rule of rules ) {
      const errorMessage = rule.validator(object, key, rule.validationOptions);
      if (errorMessage) {
        errorMap[key] = errorMap[key] || [];
        errorMap[key].push(errorMessage);
      }
    }
  }
  return errorMap;
}

export const isEmail: PropertyDecorator = (target: any, propertyKey: propertyKey) => {
  addValidation(target, propertyKey, emailValidator);
}

export const required: PropertyDecorator = (target: any, propertyKey: propertyKey) => {
  addValidation(target, propertyKey, requiredValidator);
}

// factory decorator
export function length(minimum: Number, maximum: Number): PropertyDecorator {
  const options = {
    minimum,
    maximum,
  };
  return function (target: Object, propertyKey: propertyKey) {
    addValidation(target, propertyKey, lengthValidator, options);
  }
}

export const isPhone: PropertyDecorator = (target: any, propertyKey: propertyKey) => {
  addValidation(target, propertyKey, phoneValidator);
}

// factory decorator
export function isInteger(minimum: Number, maximum: Number): PropertyDecorator {
  const options = {
    minimum,
    maximum,
  };
  return function (target: Object, propertyKey: propertyKey) {
    addValidation(target, propertyKey, integerValidator, options);
  }
}

function addValidation(target: any, propertyKey: propertyKey, validator: ValidationFunction, validationOptions?) {
  // Make sure we have the list of all properties for the object
  let objectProperties: string[] = Reflect.getMetadata('validation:properties', target) || [];
  if ( !objectProperties.includes(String(propertyKey)) ) {
    objectProperties.push(String(propertyKey));
    Reflect.defineMetadata('validation:properties', objectProperties, target);
  }
  
  // Make sure we capture validation rule
  let validators: ValidationRule[] = Reflect.getMetadata('validation:rules', target, propertyKey) || [] as ValidationRule[];
  let validationRule = {
    validator: validator,
    validationOptions: validationOptions,
  };
  validators.push(validationRule);
  Reflect.defineMetadata('validation:rules', validators, target, propertyKey);
}

// VALIDATOR FUNCTIONS
function emailValidator(target: any, propertyKey: propertyKey): string | void {
  let value = target[ propertyKey ];
  if ( value == null ) {
    return;
  }
  const isValid = validator.isEmail(value);
  if ( !isValid ) {
    return `Property ${String(propertyKey)} must be a valid email`
  }
  return
}

function requiredValidator(target: any, propertyKey: propertyKey): string | void {
  let value = target[ String(propertyKey) ];
  if ( value ) {
    return;
  }
  return `Property ${String(propertyKey)} is required`;
}

function integerValidator(target: any, propertyKey: propertyKey, validatorOptions: any): string | void {
  let value = target[ String(propertyKey) ];
  if ( value == null ) {
    return;
  }
  
  const errorMessage = `Property ${String(propertyKey)} must be an integer between ${validatorOptions.minimum} and ${validatorOptions.maximum}`;
  if ( !Number.isInteger(value) ) {
    return errorMessage;
  }
  if ( value <= validatorOptions.maximum && value >= validatorOptions.minimum ) {
    return;
  }
  return errorMessage;
}

function lengthValidator(target: any, propertyKey: propertyKey, validatorOptions: any): string | void {
  const options = {
    min: validatorOptions.minimum,
    max: validatorOptions.maximum,
  };
  const isValid = validator.isLength(`${target[ String(propertyKey) ]}`, options);
  if ( !isValid ) {
    return `Property ${String(propertyKey)} must be a string between ${validatorOptions.minimum} and ${validatorOptions.maximum}`;
  }
  
  return;
}

function phoneValidator(target: any, propertyKey: propertyKey): void | string {
  let value: string | null = target[ String(propertyKey) ];
  if ( value == null ) {
    return;
  }
  const isValid = validator.isMobilePhone(value);
  if ( !isValid ) {
    return `Property ${String(propertyKey)} must be a valid phone number.`;
  }
  return;
}
