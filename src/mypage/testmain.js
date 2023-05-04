import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Outlet, Routes, useNavigate } from "react-router-dom";
import { BrowserRouter, Route, Link } from 'react-router-dom'

import axios from "axios";
import Sidemenu from "./sidemenu";
import Changeme from "./changeme";
import Email from "./receiveemaillist";

import styles from "../components/asset/css/mypage.module.css"

function Testmain(){



    return(
        <div className={styles.mypageWrap}>
            <Sidemenu/>
            <div className={styles.mypageContent}>
                <Outlet/>
            </div>
        </div>
        
    )

}

export default Testmain;
