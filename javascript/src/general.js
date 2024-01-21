/**
 * creates a "defaultdict" like that allows nested property
 * assignments without errors like
 * const dict = createDefault()
 * dict.value1.value2.value3 = 'something'
 * @param {Object} target usually
 * @returns {Proxy} object with specified behaviors
 */
const _DEFAULT_DICT_PROTECTED_PROPS = new Set(['toJSON']);
export function createDefault(target = {}) {
  if (new.target) {
    throw TypeError('this function should be called with new');
  }

  if (!isPlainObject(target)) {
    throw TypeError('default objects should be plain POJOs');
  }

  return new Proxy(target, {
    get(target, p) {
      if (!(p in target) && !_DEFAULT_DICT_PROTECTED_PROPS.has(p)) {
        target[p] = createDefault();
      }
      return Reflect.get(...arguments);
    },
  });
}

export function isPlainObject(obj) {
  return typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype;
}
