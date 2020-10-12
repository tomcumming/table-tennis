import { assert } from "https://deno.land/std@0.74.0/testing/asserts.ts";

import * as v2 from "./v2.ts";

export function assertRoughlyEq(
  v: v2.V2,
  u: v2.V2,
  error?: number,
): void {
  assert(
    v2.roughlyEq(v, u, error),
    `${JSON.stringify(v)} ~= ${JSON.stringify(u)}`,
  );
}
