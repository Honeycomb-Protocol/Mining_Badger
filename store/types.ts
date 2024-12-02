export interface InventoryState {
  refreshInventory: boolean;
  cookingAddresses: {
    [key: string]: string;
  };
}

export type SignUpUserData = {
  username: string;
  name: string;
  bio: string;
  pfp: string | File;
};
