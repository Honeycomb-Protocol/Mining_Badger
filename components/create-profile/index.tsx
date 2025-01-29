import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useHoneycombAuth } from "@honeycomb-protocol/profile-hooks";

import CustomInput from "../common/input";
import CustomTextArea from "../common/textarea";
import Button from "../common/button";

const CreateProfilePage = () => {
  const router = useRouter();
  const { authenticate } = useHoneycombAuth();
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    pfp: "https://www.arweave.net/qR_n1QvCaHqVTYFaTdnZoAXR6JBwWspDLtDNcLj2a5w?ext=png",
  });

  useEffect(() => {
    document.body.style.backgroundImage =
      "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/assets/images/main-bg.jpg')";
    document.body.style.backgroundSize = "100vw 100vh";
    document.body.style.backgroundRepeat = "no-repeat";
  }, []);

  const onInputChange = (e: any) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <main>
      <h1 className="text-2xl font-bold text-center mt-10">
        CREATE YOUR PROFILE
      </h1>

      <div className="mt-16 flex justify-center items-center w-full gap-28">
        <div className="w-[40%] px-5 md:px-10 lg:px-14 xl:px-20">
          <div className="flex flex-col justify-center items-center mb-8 rounded-xl">
            <Image
              width={250}
              height={0}
              src="/assets/images/profile-picture.png"
              alt="profile"
            />
          </div>

          <div className="flex justify-evenly items-center">
            <Image
              src="/assets/svgs/cnft-1.svg"
              alt="cnft-1"
              width={100}
              height={100}
            />
            <Image
              src="/assets/svgs/cnft-2.svg"
              alt="cnft-2"
              width={100}
              height={100}
            />

            <Image
              src="/assets/svgs/cnft-3.svg"
              alt="cnft-3"
              width={100}
              height={100}
            />
          </div>
          <p className="text-sm italic opacity-70">
            As you get experience and level up, new skins/weapons get unlock
            which you can trade with extra resources and cNFTs
          </p>
        </div>
        <div className="w-[40%] flex flex-col justify-center gap-6 px-3">
          <CustomInput
            name="name"
            styles="h-12 placeholder-white"
            value={profile.name}
            placeholder="Enter Name"
            type="text"
            onChange={onInputChange}
          />

          <CustomTextArea
            name="bio"
            styles="h-32 placeholder-white"
            value={profile.bio}
            placeholder="Enter Bio"
            onChange={onInputChange}
          />

          <Button
            loading={loading}
            styles="h-12 text-white mt-5 rounded-2xl"
            btnText="Create Account"
            disable={!profile.name || !profile.bio}
            onClick={async () => {
              try {
                setLoading(true);
                const data = await authenticate(
                  profile.name,
                  profile.bio,
                  profile.pfp
                );
                setLoading(false);
                if (data.success) {
                  toast.success(data.message || "User & Profile created successfully");
                  return router.push("/home");
                } else {
                  return toast.error(
                    data.message || "An error occured while creating profile"
                  );
                }
              } catch (e) {
                console.log(e);
                toast.error(
                  e.toString() ||
                    e.message ||
                    "An error occured while creating profile"
                );
              }
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default CreateProfilePage;
