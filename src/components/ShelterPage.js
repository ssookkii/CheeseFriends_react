import React, {useState, useEffect} from "react";
import { Link, Outlet } from "react-router-dom";

import './asset/css/ShelterPage.css'

function ShelterPage() {

  return (
    <div className="shelterPageWrap">
      <nav className="sideMenu">
        <ul>
          <li>
            <Link to="/shelterpage/playgame">Prop 2 Sky</Link>
          </li>
          <li>
            <Link to="/shelterpage/playgame1">Hang Man</Link>
          </li>
          <li>
            <Link to="/shelterpage/playgame2">Speed Typing</Link>
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