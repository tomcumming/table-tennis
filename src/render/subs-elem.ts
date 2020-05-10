import { Subscription } from "rxjs";

export type Cleanup = {
  subs?: Subscription;
};

export type SubsElem = Element & Cleanup;
