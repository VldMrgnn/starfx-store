import { useSelector } from "starfx/react";
import Balancer from "react-wrap-balancer";
import { fx } from "@app/state/rootStore";
import { selectAppDefs, setAppValue } from "@app/state";
import { swsterm } from "@app/context/terminal/instructions";
import "./commontree.scss";

const buttons = [
  {
    id: 0,
    title: "Assign",
    detail: `fetch some data and set to createAssign. Inspect the results using the stateViewer window by clicking the star  button`,
  },
  { id: 1, title: "Table", detail: "fetch a dataset and set to createTable" },
  {
    id: 2,
    title: "Other",
    detail: `toggle the stateViewer window and the terminal window for further testing.`,
  },
];
export const SideBar = () => {
  const { sidebarid } = useSelector(selectAppDefs);
  const sidebarClick = (idx: number) => {
    {
      swsterm.writelines(
        `\n${buttons.find((b) => b.id === idx)?.title} clicked\n`,
      );
      fx.dispatch(setAppValue({ sidebarid: idx }));
    }
  };
  return (
    <div id={"main-tree-list"}>
      {buttons.map((item, index) => (
        <div
          key={`side-bar-${index}`}
          className={`dxx-maintree-row ${
            sidebarid === item.id ? "dx-selection" : ""
          }`}
          onClick={() => sidebarClick(item.id)}
        >
          <div className="dxx-icon dx-icon dx-icon-none"></div>
          <div className="dxx-title">{item.title}</div>
          <div className="dxx-subtitle">
            <Balancer>{item.detail}</Balancer>
          </div>
          <div className="dxx-buttons"></div>
        </div>
      ))}
    </div>
  );
};
