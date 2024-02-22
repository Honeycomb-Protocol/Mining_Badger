import React from "react";
import CustomTabs from "../common/custom-tabs";

const tabData = [
  { name: "Shop", notifications: 0, tabComponent: <div>General Store 1</div> },
  { name: "Mine", notifications: 0, tabComponent: <div>General Store 2</div> },
  {
    name: "Refine",
    notifications: 0,
    tabComponent: <div>General Store 3</div>,
  },
  { name: "Craft", notifications: 0, tabComponent: <div>General Store 4</div> },
  {
    name: "General Store",
    notifications: 4,
    tabComponent: <div>General Store</div>,
  },
];

const HomePage = () => {
  return (
    <main className="w-full flex justify-center items-start mt-12">
      <div className="w-[30%]">12 ka 4</div>
      <div className="w-[50%]">
        <CustomTabs tabData={tabData} />
      </div>
    </main>
  );
};

export default HomePage;
