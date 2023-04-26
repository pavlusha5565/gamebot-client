export function trottle<F extends Function = (...arg: any[]) => {}>(
  cb: F,
  delay: number
) {
  let timeoutRef: NodeJS.Timeout | null = null;
  return (...arg: any[]) => {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }

    timeoutRef = setTimeout(() => {
      cb(...arg);
    }, delay);
  };
}
