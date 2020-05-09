export type V2 = readonly [number, number];

export type Plane = {
  origin: V2;
  normal: V2;
};

export function v2Add(a: V2, b: V2): V2 {
  return [a[0] + b[0], a[1] + b[1]];
}

export function v2Muls(a: V2, s: number): V2 {
  return [a[0] * s, a[1] * s];
}
