import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate  } from "react-router-dom";
import axios from 'axios';

import styles from "./asset/css/home.module.css"

function Home(){
    return(
        <>
        <div className={styles.keyVisual}>
            <div className={styles.mypageBox}>
                <p>안녕하세요!<br/><span>홍길동</span>님</p>
                <div className={styles.cboxWrap}>
                    <div className={styles.cbox}>
                        <span></span>
                        <span>출석체크</span>
                    </div>
                    <div className={styles.cbox}>
                        <span></span>
                        <span>성적관리</span>
                    </div>
                    <div className={styles.cbox}>
                        <span></span>
                        <span>쪽지</span>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default Home