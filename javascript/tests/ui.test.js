import { getCursorCenterDistance, moveTagToCursorPosition } from '../src/ui';

describe('getCursorCenterDistance', () => {
  function setup(cursorPosition, size) {
    const mousemove = new MouseEvent('mousemove', {
      clientX: cursorPosition,
      clientY: cursorPosition,
    });
    const div = document.createElement('div');
    Object.defineProperties(div, {
      offsetHeight: { value: size },
      offsetWidth: { value: size },
    });
    return { mousemove, div };
  }
  it('should recognize a cursor at the center as 0', () => {
    const { mousemove, div } = setup(500, 1000);

    const { handler } = getCursorCenterDistance(div);
    const { x, y, maxDistance, distance, normalizedDistance } = handler(mousemove);
    expect(x).toEqual(0);
    expect(y).toEqual(0);
    // max distance from the center is always half of the hypotenuse
    expect(maxDistance).toEqual(707.105);
    expect(distance).toEqual(0);
    expect(normalizedDistance).toEqual(0);
  });

  it('should recognize a cursor a little bit at left not at the center', () => {
    const { mousemove, div } = setup(400, 1000);

    const { handler } = getCursorCenterDistance(div);
    const { x, y, maxDistance, distance, normalizedDistance } = handler(mousemove);
    expect(x).toEqual(-100);
    expect(y).toEqual(-100);
    // max distance from the center is always half of the hypotenuse
    expect(maxDistance).toEqual(707.105);
    expect(distance).toEqual(141.42);
    expect(normalizedDistance).toEqual(0.2);
  });
});

describe('moveTagToCursorPosition', () => {
  it('should transform tag position based on mouse movement', () => {
    const tag = document.createElement('div');
    Object.defineProperties(tag, {
      offsetHeight: { value: 40 },
      offsetWidth: { value: 40 },
    });
    const { handler } = moveTagToCursorPosition(tag);
    const mousemove = new MouseEvent('mousemove', {
      clientX: 500,
      clientY: 500,
    });
    expect(tag.style.transform).toEqual('');
    handler(mousemove);
    expect(tag.style.transform).toEqual('translate3d(480px, 480px, 0px)');
  });
});
