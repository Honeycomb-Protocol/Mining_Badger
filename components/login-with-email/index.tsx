import axios from "axios";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { Spinner } from "@nextui-org/react";

import { API_URL } from "@/config/config";
import { useMetakeep } from "@/context/metakeep-context";

const MetakeepLogin = () => {
  const { setMetakeepCache } = useMetakeep();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_URL}metakeep/loginWithMetakeep/${email}`
      );
      if (data?.result) {
        setMetakeepCache({
          email,
          publicKey: data?.result,
        });
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-[calc(100vh-30vh)]`}
    >
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-5">Login with Email</h1>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-96 h-12 p-4 mt-4 rounded-xl"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="w-96 h-12 mt-4 bg-yellow-500 text-white font-bold rounded-xl"
          disabled={
            email?.match(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/)
              ? false
              : true || loading
          }
          onClick={handleLogin}
        >
          {loading ? <Spinner color="white" /> : "Login"}
        </button>
      </div>
    </div>
  );
};

export default MetakeepLogin;
