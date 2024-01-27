import { hypotenuse, normalizeOnRange, round } from '../src/math';

describe('hypotenuse', () => {
  it('should return hypotenuse for a square triangle', () => {
    expect(hypotenuse(2, 2)).toEqual(2.83);
  });

  it('should return hypotesnuse for a random triangle', () => {
    expect(hypotenuse(3, 4)).toEqual(5);
  });

  it('should return more numbers as decimals', () => {
    expect(hypotenuse(4, 4, { decimals: 5 })).toEqual(5.65685);
  });
});

describe('normalizeOnRange', () => {
  it('should normalize a number to minRange if value is 0', () => {
    expect(normalizeOnRange(0, 10, 5, 20)).toEqual(5);
  });

  it('should normalize to maxRange if number reaches maxValue', () => {
    expect(normalizeOnRange(10, 10, 5, 20)).toEqual(20);
  });

  it('should return ranges if number extrapolate ranges', () => {
    expect(normalizeOnRange(-10, 10, 100, 1000)).toEqual(100);
    expect(normalizeOnRange(2000, 10, 100, 1000)).toEqual(1000);
  });
});

describe('round', () => {
  it('should round a number without decimals', () => {
    expect(round(3.32)).toEqual(3);
  });

  it('should round a number to 2 decimals even if "decimals" is defined as 3', () => {
    expect(round(3.32, 3)).toEqual(3.32);
  });

  it('should round to 0.2 if value is 0.199 even "decimals" being 3', () => {
    expect(round(0.1999, 3)).toEqual(0.2);
    expect(round(0.1999, 4)).toEqual(0.1999);
  });
});
