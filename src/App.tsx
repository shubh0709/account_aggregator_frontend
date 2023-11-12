import "./App.css";
import Task1 from "./Task1";
import Task2 from "./Task2";
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

export default function App() {
  return <Tabs />;
}

function Tabs() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Task 1" value="1" />
            <Tab label="Task 2" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Task1 />
        </TabPanel>
        <TabPanel value="2">
          <Task2 />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
