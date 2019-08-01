import { isObject } from './is';

export function shallowCompareObject(
  obj: { [ key: string ]: any },
  compareObj: { [ key: string ]: any },
) {
  if (!isObject(obj) || !isObject(compareObj)) {
    return false;
  }

  const objKeys = Object.keys(obj);
  const compareObjKeys = Object.keys(compareObj);

  if (objKeys.length !== compareObjKeys.length) {
    return false;
  }

  let index = objKeys.length;
  while (index--) {
    const key = objKeys[index];

    if (
      !Object.hasOwnProperty.call(compareObj, key)
      || compareObj[key] !== obj[key]
    ) {
      return false;
    }
  }

  return true;
}
