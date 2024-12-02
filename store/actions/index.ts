import type { AsyncActions } from './types';
import { default as inventoryFactory } from '../inventory/actions';

const actions: AsyncActions = {} as any;

export const inventory = (actions.inventory = inventoryFactory(actions));
