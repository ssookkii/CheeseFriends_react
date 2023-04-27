import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Outlet, Routes, useNavigate } from "react-router-dom";
import { BrowserRouter, Route, Link } from 'react-router-dom'

import axios from "axios";
import Sidemenu from "./sidemenu";
import Changeme from "./changeme";
import Email from "./receiveemaillist";


function Testmain(){



    return(
        <div>
            <h1>main 페이지</h1>
            <table border="1" align="center">
                <colgroup>
                    <col width="150"/><col width="1000"/>
                </colgroup>
                <tr>
                    <td rowSpan="2" valign="top">
                        <div>
                            <Sidemenu />
                        </div>
                    </td>
                    <td align="left" >
                        <div>홈</div>
                    </td>
                </tr>
                <tr>
                    <td style={{height: "600px"}}>
                        <div className="container">
                            <Outlet/>                        
                        </div>
                    </td>
                </tr>
            </table>
            
        </div>
        
    )

}

export default Testmain;
