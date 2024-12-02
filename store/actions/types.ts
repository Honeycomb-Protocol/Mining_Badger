import type { default as inventoryFactory } from "../inventory/actions";

export type AsyncActions = {
  inventory: ReturnType<typeof inventoryFactory>;
};
