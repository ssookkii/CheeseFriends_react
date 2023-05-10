import React, {useState, useEffect} from "react";
import { Link, Outlet } from "react-router-dom";

import './asset/css/ShelterPage.css'

function ShelterPage() {

  let [btnActive, setBtnActive] = useState(
    localStorage.getItem("btnActive") || "playgame"
  );

  useEffect(() => {
    localStorage.setItem("btnActive", btnActive);
  }, [btnActive]);

  return (
    <div className="shelterPageWrap">
      <nav className="sideMenu">
        <ul>
          <li className={btnActive === "playgame" ? "btnActive" : ""}>
            <Link to="/shelterpage/playgame" onClick={() => {setBtnActive('playgame');}} style={{ textDecoration: "none" }}>Prop 2 Sky</Link>
          </li>
          <li className={btnActive === "playgame1" ? "btnActive" : ""}>
            <Link to="/shelterpage/playgame1" onClick={() => {setBtnActive('playgame1');}} style={{ textDecoration: "none" }}>Hang Man</Link>
          </li>
          <li className={btnActive === "playgame2" ? "btnActive" : ""}>
            <Link to="/shelterpage/playgame2" onClick={() => {setBtnActive('playgame2');}} style={{ textDecoration: "none" }}>Speed Typing</Link>
          </li>
        </ul>
      </nav>
      <main className="shelterContentWrap">
          <Outlet />
      </main>
    </div>
  );
}

export default ShelterPage;