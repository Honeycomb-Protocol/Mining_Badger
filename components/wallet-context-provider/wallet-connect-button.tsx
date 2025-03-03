import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import Button from "@/components/common/button";
import { useMetakeep } from "@/context/metakeep-context";
import CustomWalletConnectButton from "../custom-wallet-button";

const WalletConnectButton = () => {
  const router = useRouter();
  const wallet = useWallet();
  const [email, setEmail] = useState("");
  const { authenticated, user, ready } = usePrivy();
  const { metakeepCache } = useMetakeep();
  const emailRef = useRef("");

  useEffect(() => {
    emailRef.current = email;
  }, [email]);

  const handlePrivySubmit = async () => {
    try {
      const currentEmail = emailRef.current;
      if (!currentEmail) {
        throw new Error("User email address is missing.");
      }
      await axios.post("/api/privy-user", {
        email: currentEmail,
      });
    } catch (e) {
      console.error(
        "Error while creating user:",
        e.response?.data.error || e.message
      );
    }
  };

  useEffect(() => {
    const observePrivyUI = () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            const emailInput = document.querySelector("input[type='email']");
            if (emailInput) {
              emailInput.removeEventListener("input", handleInputChange);
              emailInput.addEventListener("input", handleInputChange);

              emailInput.removeEventListener("keydown", handleEnterPress);
              emailInput.addEventListener("keydown", handleEnterPress);
            }

            const privyButton = Array.from(
              document.querySelectorAll("button")
            ).find(
              (btn) =>
                btn.querySelector("span")?.textContent?.trim() === "Submit"
            );

            if (privyButton) {
              privyButton.removeEventListener("click", handlePrivySubmit);
              privyButton.addEventListener("click", handlePrivySubmit);
            }
          }
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        // Cleanup: Remove event listeners and disconnect observer
        observer.disconnect();
        const emailInput = document.querySelector("input[type='email']");
        emailInput?.removeEventListener("input", handleInputChange);
        emailInput?.removeEventListener("keydown", handleEnterPress);
        const privyButton = Array.from(
          document.querySelectorAll("button")
        ).find(
          (btn) => btn.querySelector("span")?.textContent?.trim() === "Submit"
        );
        privyButton?.removeEventListener("click", handlePrivySubmit);
      };
    };

    const handleInputChange = (e) => {
      setEmail(e.target.value);
    };

    const handleEnterPress = (e) => {
      if (e.key === "Enter" || e.keyCode === 13) {
        e.preventDefault();
        handlePrivySubmit();
      }
    };

    observePrivyUI();
  }, []);

  const { login } = useLogin({
    onComplete: async () => {
      router.push("/create-profile");
    },
  });
  const disableLogin = !ready || (ready && authenticated);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 mt-4">
        {wallet?.publicKey?.toString() ? (
          <WalletMultiButton
            style={{
              height: "40px",
              borderRadius: "15px",
              backgroundColor: "transparent",
              color: "#ffffff",
              width: "174px",
              display: "flex",
              justifyContent: "center",
              border: "2px solid #8E8B77",
              fontSize: "12px",
            }}
          />
        ) : metakeepCache?.publicKey ||
          (authenticated && ready && user?.wallet?.address) ? (
          <CustomWalletConnectButton />
        ) : null}
      </div>

      {wallet?.publicKey ||
      metakeepCache?.publicKey ||
      (authenticated && user?.wallet?.address) ? (
        <Button
          styles="w-96 text-lg"
          btnText="Let's Create an Account"
          loading={false}
          onClick={() => {
            router.push("/create-profile");
          }}
        />
      ) : (
        <>
          <WalletMultiButton
            style={{
              padding: "8px 16px",
              borderRadius: "12px",
              backgroundImage:
                "linear-gradient(to right, #E7CB5F -80%, #CD6448 150%)",
              color: "#ffffff",
              width: "384px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <p>Connect Wallet</p>
          </WalletMultiButton>
          <p className="py-4 font-bold">----- Or -----</p>
          <button
            className="w-[384px] !py-3 !px-4 rounded-xl font-bold"
            onClick={() => router.push("/login-with-email")}
          >
            Login with Metakeep
          </button>
          <p className="py-4 font-bold">----- Or -----</p>
          <button
            disabled={disableLogin}
            onClick={login}
            className="w-[384px] !py-3 !px-4 rounded-xl font-bold"
          >
            Login with Privy
          </button>
        </>
      )}
    </div>
  );
};

export default WalletConnectButton;
