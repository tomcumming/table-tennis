import { Subscription } from "rxjs";

export type Cleanup = {
  subs?: Subscription;
};

export type SubsNode = Element & Cleanup;
