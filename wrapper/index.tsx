import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSelector } from "react-redux";
import { Spinner } from "@nextui-org/react";

import { useHoneycomb } from "@/hooks";
import { RootState } from "@/store";

interface AuthenticationWrapperProps {
  children?: ReactNode;
}

const CheckConnection: React.FC<AuthenticationWrapperProps> = ({
  children,
}) => {
  const {
    user,
    profile,
    fetchingUser,
    fetchingProfile,
    userApiCalled,
    profileApiCalled,
  } = useHoneycomb();
  const { authLoader } = useSelector((state: RootState) => state.auth);

  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (
      connected &&
      !fetchingProfile &&
      !fetchingUser &&
      userApiCalled &&
      profileApiCalled &&
      !profile
    ) {
      router.push("/create-profile");
    }
  }, [user, profile, connected]);

  return (
    <>
      {authLoader || fetchingProfile || fetchingUser ? (
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
