import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { Spinner } from "@nextui-org/react";

import {
  useHoneycombAuth,
  useHoneycombInfo,
} from "@honeycomb-protocol/profile-hooks";

interface AuthenticationWrapperProps {
  children?: ReactNode;
}

const CheckConnection: React.FC<AuthenticationWrapperProps> = ({
  children,
}) => {
  const { currentUser, currentProfile, currentWallet } = useHoneycombInfo();
  const { authLoader } = useHoneycombAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentWallet?.connected && !currentProfile && !currentUser) {
      router.push("/create-profile");
    }
  }, [currentUser, currentProfile, currentWallet?.connected]);

  return (
    <>
      {authLoader ? (
        <div className="flex justify-center items-center mt-10">
          <Spinner color="white" />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default CheckConnection;
