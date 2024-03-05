import type { default as honeycombFactory } from '../honeycomb/actions';
import type { default as authFactory } from '../auth/actions';

export type AsyncActions = {
  honeycomb: ReturnType<typeof honeycombFactory>;
  auth: ReturnType<typeof authFactory>;
};
