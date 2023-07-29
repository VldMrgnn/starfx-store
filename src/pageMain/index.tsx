import { Switch, Case, CaseElse } from "react-context-switch";
import { useSelector } from "starfx/react";
import { fx } from "../state/rootStore";
import {
  selectAppDefs,
  selectUserList,
  setAppValue,
  loadUser,
  loadPath,
  loadUserTable,
} from "../state";
import { Button } from "devextreme-react";
import "./page-main.scss";
import "./validation.scss";

type TUser = {
  id: number;
  name: string;
};
export const MainPage = () => {
  const { sidebarid } = useSelector(selectAppDefs);
  const userList = useSelector(selectUserList) as TUser[];
  const fetchUser = () => {
    fx.dispatch(loadUser());
  };
  const fetchPath = () => {
    fx.dispatch(loadPath());
  };
  const fetchUsers = () => {
    fx.dispatch(loadUserTable());
  };
  return (
    <div id="main-page">
      <Switch value={sidebarid}>
        <Case when={0}>
          <div className="not-main-content">
            <div className="main-content__command">
              <Button
                width={600}
                className="main-content__command__button"
                text="Fetch user name and assign value"
                icon="user"
                onClick={fetchUser}
              />
            </div>
            <div className="main-content__command">
              <Button
                width={600}
                className="main-content__command__button"
                text="Fetch path name and assign value"
                icon="folder"
                onClick={fetchPath}
              />
            </div>
          </div>
        </Case>
        <Case when={1}>
          <div className="main-content">
            <div className="main-content__command">
              <Button
                width={600}
                className="main-content__command__button"
                text="Fetch multiple values and assign to state as a table"
                icon="user"
                onClick={fetchUsers}
              />
            </div>
            <Switch value={userList.length}>
              <Case when={0}>
                <div>No users found</div>
              </Case>
              <CaseElse>
                <div className="main-list">
                  <div className="main-text">
                    {userList.map((user, index) => (
                      <div key={user.id}>{user?.name || ""}</div>
                    ))}
                  </div>
                </div>
              </CaseElse>
            </Switch>
          </div>
        </Case>
        <Case when={2}>
          <div className="main-content">
          <ul className="main-list">
            <h2>Suggestions</h2>

            <li>open the react-console-emulator using the upper button <span > <i className="dx-icon dx-icon-panelleft"></i></span>. Then type "help" for a list of available commands.</li>
            <li>Run the "similo" commands and watch the canges in the store. by opening the viewer using <span > <i className="dx-icon dx-icon-favorites"></i></span></li>

            <li>Run the "test" commands</li>
            <li>Reload the page and the terminal emulator history will persist</li>
            
          </ul>
          </div>
        </Case>
        <CaseElse>
          <div />
        </CaseElse>
      </Switch>
    </div>
  );
};