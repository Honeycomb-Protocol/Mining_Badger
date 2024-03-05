import type { AsyncActions } from './types';
import { default as honeycombFactory } from '../honeycomb/actions';
import { default as authFactory } from '../auth/actions';

const actions: AsyncActions = {} as any;

export const honeycomb = (actions.honeycomb = honeycombFactory(actions));
export const auth = (actions.auth = authFactory(actions));
