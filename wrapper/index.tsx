import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { Spinner } from "@nextui-org/react";

import { useHoneycombInfo } from "@honeycomb-protocol/profile-hooks";

interface AuthenticationWrapperProps {
  children?: ReactNode;
}

const CheckConnection: React.FC<AuthenticationWrapperProps> = ({
  children,
}) => {
  const { currentUser, currentProfile, currentWallet } = useHoneycombInfo();

  const router = useRouter();

  useEffect(() => {
    if (currentWallet?.connected && !currentProfile && !currentUser) {
      router.push("/create-profile");
    }
  }, [currentUser, currentProfile, currentWallet?.connected]);

  return (
    <>
      {/* TODO: EXPORT THESE LOADERS FROM THE HOOKS PACKAGE AND ADD HERE AND ALSO SEE PREVIOUS COMMIT AND ADD THERE AS WELL WHICH HAS BEEN REMOVED NOW */}

      {/* {authLoader || fetchingProfile || fetchingUser ? (
        <div className="flex justify-center items-center mt-10">
          <Spinner color="white" />
        </div>
      ) : ( */}
      {children}
      {/* )} */}
    </>
  );
};

export default CheckConnection;
