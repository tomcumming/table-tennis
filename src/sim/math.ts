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

export function v2Sub(a: V2, b: V2): V2 {
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

/** values >0 indicate norm is pointing at point */
export function signedDistanceFromPlane(plane: Plane, point: V2): number {
  const dist = v2Sub(plane.origin, point);
  const normDist = v2Dot(plane.normal, dist);
  return normDist * -1;
}

/** Distance along ray closest to point */
export function rayClosestPoint(ray: Ray, point: V2): number {
  const distance = v2Sub(point, ray.origin);
  return v2Dot(ray.dir, distance);
}

/** Distance along ray to circle intersections */
export function rayCircle(
  ray: Ray,
  circleOrigin: V2,
  radius: number
): undefined | [number, number] {
  const tClosestPoint = rayClosestPoint(ray, circleOrigin);
  const closestPoint = v2Add(ray.origin, v2Muls(ray.dir, tClosestPoint));
  const len2 = v2Mag2(v2Sub(closestPoint, circleOrigin));
  const extraDist = Math.sqrt(radius * radius - len2);
  if (extraDist >= 0)
    return [tClosestPoint - extraDist, tClosestPoint + extraDist];
}
