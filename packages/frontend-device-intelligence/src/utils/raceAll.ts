type DelayedPromise<T> = Promise<T>;

function delay<T>(t: number, val: T): DelayedPromise<T> {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(val), t);
  });
}

export function raceAll<T>(
  promises: Promise<T>[],
  timeoutTime: number,
  timeoutVal: T,
): Promise<(T | undefined)[]> {
  return Promise.all(
    promises.map((p) => {
      return Promise.race([p, delay(timeoutTime, timeoutVal)]);
    }),
  );
}
