export type V2 = readonly [number, number];

export type Plane = {
  origin: V2;
  normal: V2;
};

export type Ray = {
  origin: V2;
  dir: V2;
};

export function v2Add(a: V2, b: V2): V2 {
  return [a[0] + b[0], a[1] + b[1]];
}

export function v2Subs(a: V2, b: V2): V2 {
  return [a[0] - b[0], a[1] - b[1]];
}

export function v2Muls(a: V2, s: number): V2 {
  return [a[0] * s, a[1] * s];
}

export function v2Dot(a: V2, b: V2): number {
  return a[0] * b[0] + a[1] * b[1];
}

export function v2Mag2(a: V2): number {
  return v2Dot(a, a);
}

export function v2Mag(a: V2): number {
  return Math.sqrt(v2Mag2(a));
}

export function v2Finite(a: V2): boolean {
  return Number.isFinite(a[0]) && Number.isFinite(a[1]);
}

export function v2Unit(a: V2): undefined | V2 {
  const u = v2Muls(a, 1 / v2Mag(a));
  return v2Finite(u) ? u : undefined;
}
