import { useState } from "react";
import "./App.css";
import DamageCalculator from "./DamageCalculator";
import Nav, { Tabs } from "./components/Nav";

function App() {
  const [activeTab, setActiveTab] = useState<Tabs>("Upload");

  return (
    <div>
      <Nav activeTab={activeTab} onTabPress={setActiveTab} />
      <Tab tab="Calculator" activeTab={activeTab}>
        <DamageCalculator />
      </Tab>
      <Tab tab="Upload" activeTab={activeTab}>
        <p>'asdflkjasdf</p>
      </Tab>
    </div>
  );
}

export default App;

const Tab = ({
  children,
  tab,
  activeTab,
}: React.PropsWithChildren<{ tab: Tabs; activeTab: Tabs }>) => (
  <div className={activeTab !== tab ? "hidden" : ""}>{children}</div>
);
