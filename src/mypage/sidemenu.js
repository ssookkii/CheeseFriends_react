import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { BrowserRouter, Route, Link } from 'react-router-dom'

import axios from "axios";


function Sidemenu(){


    return(
        <div>
            <div>
                <table border="1" align="center">
                    <colgroup>
                        <col width="150"/>
                    </colgroup>
                    <tr>
                        <td  style={{backgroundColor:"grey"}}>
                            <div>MyPage</div>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <Link to="changeme">개인정보 변경</Link>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <Link to="email">쪽지 관리</Link>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <label for="">출석확인</label>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <Link to="grademypage">성적표</Link>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <label for="">수강중인 학습</label>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <label for="">회원탈퇴</label>
                        </td>
                    </tr>
                </table>

                
            </div>
        </div>
        
    )

}

export default Sidemenu;
