import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate  } from "react-router-dom";
import axios from 'axios';
import Slider from "react-slick";

import styles from "./asset/css/home.module.css"

import "./asset/css/slick.css";
import "./asset/css/slick-theme.css";

function Home(){
    const login = JSON.parse(localStorage.getItem("login"));
    const userName = login.name;

    const [unreducedMail, setUnreducedMail] = useState("");



    function getUnreducedMail(){
        axios.get("http://localhost:3000/unreducedMail", { params:{ "id":login.id }})
        .then(function(resp){
            console.log(resp.data);
            setUnreducedMail(resp.data);
        })
        .catch(function(err){
            alert(err);
            console.log(err);
        })
    }

    useEffect(function(){
        getUnreducedMail();
    },[login.id]);

    const eduSettings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true
        };
    return(
        <>
        <div className={styles.keyVisual}>
            <div className={styles.mypageBoxBg}>
                <div className={styles.mypageBox}>
                    <p>안녕하세요!<br/><span>{userName}</span>님</p>
                    <div className={styles.cboxWrap}>
                        {
                            login.auth === "teacher" || login.auth === "main" ?
                            <Link to="/cheesefriends/attendance" className={styles.cbox} onClick={()=>localStorage.setItem("mypageBtnActive", "attendance")}>
                                <span></span>
                                <span>출석체크</span>
                            </Link>
                        : <Link to="/cheesefriends/testmain/DataAnalysis" className={styles.cbox}  onClick={()=>localStorage.setItem("mypageBtnActive", "DataAnalysisTeacher")}>
                            <span></span>
                            <span>출결분석</span>
                        </Link>
                        }
                        {
                            login.auth === "teacher" || login.auth === "main" ?
                            <Link to="/cheesefriends/testmain/grademanage" className={styles.cbox} onClick={()=>localStorage.setItem("mypageBtnActive", "grademanage")}>
                                <span></span>
                                <span>성적관리</span>
                            </Link> :
                            <Link to="/cheesefriends/testmain/grademypage" className={styles.cbox} onClick={()=>localStorage.setItem("mypageBtnActive", "grademypage")}>
                                <span></span>
                                <span>성적관리</span>
                            </Link>
                        }
                        <Link to="/cheesefriends/testmain/email" className={styles.cbox} onClick={()=>localStorage.setItem("mypageBtnActive", "email")}>
                            <span></span>
                            <span>쪽지</span>
                            <span>{unreducedMail}</span>
                        </Link>
                    </div>
                </div>
                <div className={styles.keyVisualIcon}></div>
            </div>
        </div>
        <div className={styles.container}>
            <div className={styles.TitleBox}>
                <h2>교육정보</h2>
                <p>궁금해하는 교육정보 모아모아 한 눈에!</p>
            </div>
            <Slider {...eduSettings}>
                    <div><Link className={styles.slideContent}><img src={`${process.env.PUBLIC_URL}/img/thumbEx.jpg`}  style={{width:'100%'}} alt=""/></Link></div>
                    <div><Link className={styles.slideContent}><img src={`${process.env.PUBLIC_URL}/img/thumbEx.jpg`}  style={{width:'100%'}} alt=""/></Link></div>
                    <div><Link className={styles.slideContent}><img src={`${process.env.PUBLIC_URL}/img/thumbEx.jpg`}  style={{width:'100%'}} alt=""/></Link></div>
                    <div><Link className={styles.slideContent}><img src={`${process.env.PUBLIC_URL}/img/thumbEx.jpg`}  style={{width:'100%'}} alt=""/></Link></div>
                    <div><Link className={styles.slideContent}><img src={`${process.env.PUBLIC_URL}/img/thumbEx.jpg`}  style={{width:'100%'}} alt=""/></Link></div>
                    <div><Link className={styles.slideContent}><img src={`${process.env.PUBLIC_URL}/img/thumbEx.jpg`}  style={{width:'100%'}} alt=""/></Link></div>
                    <div><Link className={styles.slideContent}><img src={`${process.env.PUBLIC_URL}/img/thumbEx.jpg`}  style={{width:'100%'}} alt=""/></Link></div>
                    <div><Link className={styles.slideContent}><img src={`${process.env.PUBLIC_URL}/img/thumbEx.jpg`}  style={{width:'100%'}} alt=""/></Link></div>
            </Slider>
        </div>
        <div className={styles.containerBg}>
            <div className={styles.container}>
                <div className={styles.TitleBox}>
                    <h2>쉼터</h2>
                    <p>열심히 공부한 당신! 옹달샘에서 잠시 쉬어가요~</p>
                </div>
                <div className={styles.playBox}>
                    <Link to="/cheesefriends/shelterpage/playgame"><img src={`${process.env.PUBLIC_URL}/img/game1.jpg`}  style={{width:'100%'}} alt="playgame1"/></Link>
                    <Link to="/cheesefriends/shelterpage/playgame1"><img src={`${process.env.PUBLIC_URL}/img/game2.jpg`}  style={{width:'100%'}} alt="playgame2"/></Link>
                    <Link to="/cheesefriends/shelterpage/playgame2"><img src={`${process.env.PUBLIC_URL}/img/game3.jpg`}  style={{width:'100%'}} alt="playgame3"/></Link>
                </div>
            </div>
        </div>
        </>
    )
}
export default Home