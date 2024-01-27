export interface IgetCursorCenterDistanceHandler {
  x: number;
  y: number;
  maxDistance: number;
  distance: number;
  normalizedDistance: number;
}

export function getCursorCenterDistance(
  box: HTMLElement,
  options?: { addListener?: boolean }
): {
  handler: (e: Event) => getCursorCenterDistanceHandlerModel;
  container: HTMLElement;
  removeListeners: () => void;
};

export function moveTagToCursorPosition(
  tag: HTMLElement,
  box?: HTMLElement,
  options?: { addListener: boolean }
): {
  handler: (e: Event) => void;
  container: HTMLElement;
  removeListeners: () => void;
};
