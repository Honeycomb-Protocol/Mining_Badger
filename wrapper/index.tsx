import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useHoneycomb } from "@/hooks";


interface AuthenticationWrapperProps {
  children?: ReactNode;
}

const CheckConnection: React.FC<AuthenticationWrapperProps> = ({
  children,
}) => {
  const {user} = useHoneycomb();

  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!connected) {
      router.push("/");
    } else if (!user) {
      router.push("/create-profile");
    } else {
      router.push("/home");
    }
  }, [connected, user]);

  return <>{children}</>;
};

export default CheckConnection;
