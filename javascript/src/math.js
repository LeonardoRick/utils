/**
 * calculate hypotenuse based on two cathetus
 * @param {number} cat1
 * @param {number} cat2
 * @returns {number} hypotenuse value
 */
export function hypotenuse(cat1, cat2, { decimals = 2 } = {}) {
  return round(Math.sqrt(Math.pow(cat1, 2) + Math.pow(cat2, 2)), decimals);
}

/**
 * normalize a value based on another.
 * @param {number} value that we want to normalized based on another
 * @param {number} maxValue that our current value can reach. This is important so we can
 * first normalize it between 0 and 1 (const normalized)
 * @param {number} minRange minimum value on range that we want to clamp the real value. If
 * if the real value can reach 0 and or minRange is 100, when real value is 0 our minRange will
 * be 100
 * @param {number} maxRange maximum value on range that we want to clamp the real value. If
 * if the real value can reach 100 and maxRange is 1000, when real value is 100 our maxRange
 * will be 1000
 * @param {{inverted: boolean}} options . When inverted is true we invert the logic. Usually
 * our value and maxValue are distances. And in case of distances, as variable value is smaller
 * (which means our distance is lower to our point of reference) we want to emphasize somehting,
 * so when inverted is true, as 'value' tends to 0,the returned value is closer to maxRange
 * @returns {number} normalized value
 */
export function normalizeOnRange(value, maxValue, minRange, maxRange, { inverted = false } = {}) {
  // Calculate the normalized value as a proportion of max
  const normalized = value / maxValue;
  // Interpolate between minRange and maxRange
  const offset = 1 - normalized;
  const min = inverted ? maxRange : minRange;
  const max = inverted ? minRange : maxRange;
  const interpolated = offset * min + normalized * max;
  // Clamp to ensure the result is within the desired range
  return Math.min(Math.max(interpolated, minRange), maxRange);
}

/**
 * Round a number
 * @param {number} n
 * @param {number} decimals
 * @returns number rounded with 'decimals' being the number of decimals
 */
export function round(n, decimals) {
  const h = +'1'.padEnd(decimals + 1, '0'); // 10 or 100 or 1000 or etc
  return Math.round(n * h) / h;
}
