import React, { useEffect } from "react";

const CreateProfile = () => {
  useEffect(() => {
    document.body.style.backgroundImage =
      "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/assets/images/main-bg.jpg')";
    document.body.style.backgroundSize = "100vw 100vh";
    document.body.style.backgroundRepeat = "no-repeat";
  }, []);

  return (
    <main>
      <h1 className="text-xl font-bold text-center mt-10">
        CREATE YOUR PROFILE
      </h1>
      <div className="mt-5 flex justify-center items-start w-full">
        <div className="w-[30%]">s</div>
        <div className="w-[60%]">d</div>
      </div>
    </main>
  );
};

export default CreateProfile;
