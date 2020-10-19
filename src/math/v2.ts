export type V2 = readonly [number, number];

export const ZERO: V2 = [0, 0];

export function add(...vs: V2[]): V2 {
  return vs.reduce(([x1, y1], [x2, y2]) => [x1 + x2, y1 + y2], ZERO);
}

export function mul(...vs: (number | V2)[]): V2 {
  return vs.reduce<V2>(
    ([x1, y1], other) => {
      if (typeof other === "number") {
        return [x1 * other, y1 * other];
      } else {
        const [x2, y2] = other;
        return [x1 * x2, y1 * y2];
      }
    },
    [1, 1],
  );
}

export function sub(v1: V2, v2: V2): V2 {
  return add(v1, mul(v2, -1));
}

export function dot([x1, y1]: V2, [x2, y2]: V2): number {
  return x1 * x2 + y1 * y2;
}

export function mag2(v: V2): number {
  return dot(v, v);
}

export function mag(v: V2): number {
  return Math.sqrt(mag2(v));
}

export function isFinite(v: V2): undefined | V2 {
  return Number.isFinite(v[0]) && Number.isFinite(v[1]) ? v : undefined;
}

export function norm(v: V2): undefined | V2 {
  return isFinite(mul(v, 1 / mag(v)));
}

export function project(v: V2, unit: V2): number {
  return dot(v, unit);
}

export function roughlyEq(
  v1: V2,
  v2: V2,
  error = 0.00001,
): boolean {
  return Math.abs(v1[0] - v2[0]) <= error && Math.abs(v1[1] - v2[1]) <= error;
}
