import { hypotenuse, round } from './math';

/**
 * Function to get the distance between the cursor (mouse) and the center of a html tag
 * @param {HTMLElement} box where the mouse would be navigating inside. It's an optional
 * parameter that if not passed is the html tag
 * @param {{ addlistener: boolean }} options . If addListener is false we don't
 * create the handler itself. Usually we do that if we want to operate multiple
 * things on the same container event so we just build the handler and add it later
 * like:
 * const { handler: centerHandler } = getCursorCenterDistance(container, { addListener: false });
 * ...
 * function masterHandler(e: Event) {
 *  handler(e)
 * ... (do other things)
 * }
 * container.addEventListener('mousemove', masterHandler);
 * });
 * @returns {{
 *  handler: (e: Event) => {
 *      x: number,
 *      y: number,
 *      maxDistance: number,
 *      distance: number,
 *      normalizedDistance: number,
 *  },
 * container: HTMLElement,
 * removeListeners: () => void,
 * }}
 */
export function getCursorCenterDistance(
  box,
  { addListener = true, normalizedDistanceDecimals = 5 } = {}
) {
  const container = box || document.querySelector('html');

  const handler = (e) => {
    const x = e.clientX - container.offsetWidth / 2;
    const y = e.clientY - container.offsetHeight / 2;
    // calculating the hypotenuse we can get the max distance from two points
    // inside our container, being this value the max distance crossing our box
    // H = square(a^2 + b^2). h divided by 2 is our radious
    const maxDistance = hypotenuse(container.offsetWidth, container.offsetHeight) / 2;
    const distance = hypotenuse(x, y);
    const normalizedDistance = round(distance / maxDistance, normalizedDistanceDecimals);
    return { x, y, maxDistance, distance, normalizedDistance };
  };

  if (addListener) {
    container.addEventListener('mousemove', handler);
  }

  return {
    handler,
    container,
    removeListeners: () => {
      container.removeEventListener('mousemove', handler);
    },
  };
}

/**
 * Function to make some HTML element move with the cursor (mouse)
 * @param {HTMLElement} tag that will navigate across the screen when the mouse moves
 * @param {HTMLElement} box where the mouse would be navigating inside. It's an optional
 * parameter that if not passed is the html tag
 * @param {{ addlistener: boolean }} options
 * @returns {{
 *  handler: (e: Event) => void,
 * container: HTMLElement,
 * removeListeners: () => void,
 * }}
 */
export function moveTagToCursorPosition(tag, box, { addListener = true } = {}) {
  const container = box || document.querySelector('html');
  const handler = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const newPosX = x - tag.offsetWidth / 2;
    const newPosY = y - tag.offsetHeight / 2;
    tag.style.transform = 'translate3d(' + newPosX + 'px, ' + newPosY + 'px, 0px)';
  };

  if (addListener) {
    container.addEventListener('mousemove', handler);
  }

  return {
    handler,
    container,
    removeListeners: () => {
      container.removeEventListener('mousemove', handler);
    },
  };
}
