import * as React from "react";

export type Tabs = "Upload" | "Calculator";

type Props = {
  onTabPress: (tab: Tabs) => void;
  activeTab: Tabs;
};

const Nav: React.FC<Props> = (props) => {
  return (
    <nav>
      <ul className="flex flex-row gap-4">
        <li>
          <NavButton {...props} tab="Upload" />
        </li>
        <li>
          <NavButton {...props} tab="Calculator" />
        </li>
      </ul>
    </nav>
  );
};

export default Nav;

const NavButton: React.FC<Props & { tab: Tabs }> = ({
  tab,
  onTabPress,
  activeTab,
}) => {
  return (
    <button
      className={`font-bold border p-1 ${
        activeTab === tab ? "bg-gray-400" : ""
      }`}
      disabled={activeTab === tab}
      onClick={() => onTabPress(tab)}
    >
      {tab}
    </button>
  );
};
