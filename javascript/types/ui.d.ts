export interface IgetCursorCenterDistanceHandler {
  x: number;
  y: number;
  maxDistance: number;
  distance: number;
  normalizedDistance: number;
}

export function getCursorCenterDistance(options?: {
  addListener?: boolean;
  box?: HTMLElement;
  normalizedDistanceDecimals?: number;
}): {
  handler: (e: Event) => getCursorCenterDistanceHandlerModel;
  container: HTMLElement;
  removeListeners: () => void;
};

export function moveTagToCursorPosition(
  tag: HTMLElement,

  options?: { addListener?: boolean; box?: HTMLElement }
): {
  handler: (e: Event) => void;
  container: HTMLElement;
  removeListeners: () => void;
};
