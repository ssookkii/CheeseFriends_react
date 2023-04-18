import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import teacher from './teacher.jpg';

function Regiselect(){

    return(
        <div>
            <h1>회원가입</h1>
            <img src={teacher}/>

        </div>
    )
}

export default Regiselect;