import axios from "axios";
import { useHoneycombInfo } from "@honeycomb-protocol/profile-hooks";

import { MineData } from "@/interfaces";

const Faucet = () => {
  const { currentUser, currentWallet } = useHoneycombInfo();

  const claimFaucet = async (resourceId: string) => {
    try {
      console.log("1 coming here");

      const { data } = await axios.post<{ result: MineData }>(
        "/api/claim-faucet",
        {
          currentUser,
          resourceId,
          currentWallet,
        }
      );
      console.log("2 coming here", data);
      return data.result;
    } catch (error) {
      console.error("Error while faucet claim", error);
      throw new Error(
        error?.response?.data?.error || // Correct property from API
          error?.message ||
          "Something went wrong"
      );
    }
  };

  return {
    claimFaucet,
  };
};

export default Faucet;
