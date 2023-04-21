import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import axios from "axios";


function Idsearch(){

    

    return(
        <div>
            <h1>아이디찾기</h1>
            <br/><br/><br/>
            <table border="1" align="center">
                <colgroup>
                    <col width="150"/><col width="150"/>
                </colgroup>
                <tr>
                    <td>아이디찾기</td>
                    <td>비밀번호찾기</td>
                </tr>
            </table>
        </div>
    )

}

export default Idsearch;
