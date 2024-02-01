export function debounce<T>(func: Function, delay: number): (...args: T[]) => void {
  let timeoutId: NodeJS.Timeout;

  return function<T, V>(this: T, ...args: V[]) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
