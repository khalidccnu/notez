import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Notes from "../components/Notes.jsx";
import Categories from "../components/Categories.jsx";

const Dashboard = () => {
  return (
    <Tabs>
      <TabList className="tabs tabs-boxed w-fit mx-auto mt-10">
        <Tab
          className="tab hover:text-mordant-red focus:outline-0"
          selectedClassName="bg-barn-red text-white btn-disabled"
        >
          Notes
        </Tab>
        <Tab
          className="tab hover:text-mordant-red focus:outline-0"
          selectedClassName="bg-barn-red text-white btn-disabled"
        >
          Categories
        </Tab>
      </TabList>
      <TabPanel>
        <Notes />
      </TabPanel>
      <TabPanel>
        <Categories />
      </TabPanel>
    </Tabs>
  );
};

export default Dashboard;
