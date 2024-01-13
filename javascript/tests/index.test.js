import { createDefault, isPlainObject } from '../index';

describe('isPlainObject', () => {
  it('should return true for plain objects', () => {
    expect(isPlainObject({})).toEqual(true);
    expect(isPlainObject(new Object())).toEqual(true);
  });

  it('should return false for no plain objects', () => {
    expect(isPlainObject([])).toEqual(false);
    expect(isPlainObject(new Date())).toEqual(false);
    expect(isPlainObject(new Map())).toEqual(false);
    expect(isPlainObject(function () {})).toEqual(false);
  });
});

describe('createDefault', () => {
  it('should behave properly as an object and allow asignments on undefined properties', () => {
    const dict = createDefault();
    dict.value1.value2.value3 = 10;
    dict.value4 = 4;
    dict.value = function () {};
    expect(dict.value1.value2.value3).toEqual(10);
    expect(typeof dict.value).toEqual('function');
  });

  it('should allow serialization of the object', () => {
    const dict = createDefault();
    dict.value1.value2 = 'value2';
    expect(JSON.parse(JSON.stringify(dict)).value1.value2).toEqual('value2');
  });

  it('should allow normal operations on the object', () => {
    const dict = createDefault();

    dict.value1.value2 = 10;
    dict.value4 = function () {};
    expect(Object.keys(dict)).toContain('value1');
    expect(Object.keys(dict)).toContain('value4');
    expect(Object.keys(dict)).not.toContain('value2');
    delete dict.value1;
    expect(Object.keys(dict)).not.toContain('value1');
  });

  it('should not allow the usage of new', () => {
    expect(() => new createDefault()).toThrow();
  });

  it('should not allow the usage of non-POJOs', () => {
    expect(() => createDefault(new Map())).toThrow();
    expect(() => createDefault(new Array())).toThrow();
  });
});
