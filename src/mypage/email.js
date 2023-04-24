import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import axios from "axios";



function Email(){

  

    return(
        <div>
            <div>
                <h1>쪽지</h1>
                <br/>
                <table border="1" align="center">
                    <colgroup>
                        <col width="150"/><col width="150"/><col width="150"/>
                    </colgroup>
                    <tr>
                        <td style={{backgroundColor:"grey"}}>받은 쪽지함</td>
                        <td>
                            <Link to="sendemaillist">보낸 쪽지함</Link>
                        </td>
                        <td>
                            <Link to="/testmain/sendemail">쪽지 보내기</Link>
                        </td>
                    </tr>
                </table>
            

                <br/>
                <table align="center">
                    <colgroup>
                        <col width="100" /><col width="100" /><col width="100" />
                    </colgroup>
                    <tr>
                        <td>
                            <select></select>
                        </td>
                        <td>
                            <input></input>
                        </td>
                        <td>
                            <button>검색</button>
                        </td>
                    </tr>
                </table>

                <br/><br/>

                <table border="1" align="center">
                    <colgroup>
                        <col width="50" /><col width="50" /><col width="100" /><col width="100" /><col width="100" /><col width="100" />
                    </colgroup>
                    <tr>
                        <th>체크</th><th>번호</th><th>제목</th><th>보낸사람</th><th>날짜</th><th>보기</th>
                    </tr>
                </table>

            </div>
        </div>
    )

}

export default Email;
