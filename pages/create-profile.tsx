import Image from "next/image";
import React, { useEffect, useState } from "react";

import CustomTextArea from "@/components/common/textarea";
import Button from "@/components/common/button";
import CustomInput from "@/components/common/input";

const CreateProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
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

      <div className="mt-16 flex justify-center items-start w-full gap-28">
        <div className="w-[30%]">
          <div className="flex flex-col justify-center items-center">
            <Image
              width={250}
              height={0}
              src="/assets/images/nftprofile.png"
              alt="profile"
            />
            <p className=" my-6">Your NFT Profile Picture</p>
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
          <p className="text-sm italic opacity-70 px-3">
            As you get experience and level up, new skins/weapons get unlock
            which you can trade with extra resources and cNFTs
          </p>
        </div>
        <div className="w-[50%] flex flex-col justify-center gap-6 ">
          <CustomInput
            name="name"
            styles="w-96 h-12 placeholder-white"
            value={profile.name}
            placeholder="Enter Name"
            type="text"
            onChange={onInputChange}
          />

          <CustomInput
            name="email"
            styles="w-96 h-12 placeholder-white"
            value={profile.email}
            placeholder="Enter Email Address"
            type="text"
            onChange={onInputChange}
          />

          <CustomTextArea
            name="bio"
            styles="w-96 h-32 placeholder-white"
            value={profile.bio}
            placeholder="Enter Bio"
            onChange={onInputChange}
          />

          <Button
            loading={false}
            styles="w-96 h-12 bg-gradient-to-r from-[#E7CB5F] to-[#CD6448] text-white mt-5 rounded-2xl"
            btnText="Create Account"
            onClick={() => console.log(profile)}
          />
        </div>
      </div>
    </main>
  );
};

export default CreateProfile;
