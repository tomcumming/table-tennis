/** Solve monotonic functions */
export function solve(
  testFn: (time: number) => number,
  allowedError = 0.00001,
  iterations = 20,
  currentTime = 1,
  low?: number,
  high?: number,
): undefined | number {
  const currentValue = testFn(currentTime);

  if (iterations === 0) {
    return Math.abs(currentValue) <= allowedError ? currentTime : undefined;
  }

  if (currentValue > 0) {
    const nextTime = low ? (currentTime + low) / 2 : Math.abs(currentTime) * -2;
    return solve(
      testFn,
      allowedError,
      iterations - 1,
      nextTime,
      low,
      currentTime,
    );
  } else if (currentValue < 0) {
    const nextTime = (currentTime + (high || (currentTime * 2))) / 2;
    return solve(
      testFn,
      allowedError,
      iterations - 1,
      nextTime,
      currentTime,
      high,
    );
  } else {
    return currentTime;
  }
}
