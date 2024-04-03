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
  const { user, profile } = useHoneycomb();
  const { authLoader } = useSelector((state: RootState) => state.auth);

  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!connected) {
      router.push("/");
    } else if (!user || !profile) {
      router.push("/create-profile");
    } else {
      router.push("/home");
    }
  }, [connected, user, profile]);

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
