import { isClass, isSameNodeType } from './../src/shared/is';
import { shallowCompareObject } from './../src/shared/shallowCompare';

describe('shared tool', () => {
  it('isClass', () => {
    expect(isClass(false)).toBe(false);
    expect(isClass(undefined)).toBe(false);
    expect(isClass(null)).toBe(false);
    expect(isClass(0)).toBe(false);
    expect(isClass('0')).toBe(false);
    expect(isClass([])).toBe(false);
    expect(isClass(function Demo () {})).toBe(false);
    expect(isClass({})).toBe(false);
    expect(isClass(class Demo {})).toBe(true);
  });

  it('isSameNodeType', () => {
    expect(isSameNodeType(document.createElement('div'), 0)).toBe(false);
    expect(isSameNodeType(document.createElement('div'), { type: 'div', props: {} })).toBe(true);
  });

  it('shallowCompareObject', () => {
    expect(shallowCompareObject(0 as any, 0 as any)).toBe(false);  // use fake type
    expect(shallowCompareObject({ x: 0 }, { x: 0, y: 0 })).toBe(false);
    expect(shallowCompareObject({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(true);
    expect(shallowCompareObject({ x: 0, y: [1] }, { x: 0, y: [1] })).toBe(false);
  });
});
