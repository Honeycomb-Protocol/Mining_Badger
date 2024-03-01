import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

interface AuthenticationWrapperProps {
  children?: ReactNode;
}

const CheckConnection: React.FC<AuthenticationWrapperProps> = ({
  children,
}) => {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!connected) {
      router.push("/");
    } else {
      router.push("/home");
    }
  }, [connected, router]);
  return <>{children}</>;
};

export default CheckConnection;
