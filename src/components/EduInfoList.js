import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import { createRoot } from "react-dom/client";
import { useNavigate, Link } from 'react-router-dom';
import './asset/css/eduInfoList.css';

export default function EduInfoList() {

    const [eduInfoList, setEduInfoList] = useState([]);

    const movePage = useNavigate();

    function learnlist() {
        movePage('/learning');
    }

    function infolist() {
        movePage('/learning/EduInfoList');
    }

    function eduwrite() {
        movePage('/learning/EduInfoWrite');
    }

    function getEduInfoList() {
        axios.get("http://localhost:3000/eduInfoList")
        .then(function(resp){
            setEduInfoList(resp.data);
            console.log(resp.data);
            
        })
        .catch(function(err){
            // alert(err);
        })

    }


    useEffect(function(){
        getEduInfoList();
    },[]);

    const [subList, setSubList] = useState([]);
 

    function getSubList(){
        axios.get("http://localhost:3000/eduInfoList")
        .then(function(resp) {
            // 데이터가 있을 경우에만 subList 상태를 업데이트
            if (resp.data.list) {
                setSubList(resp.data.list);
            }
        })
        .catch(function(err){
            alert(err);
        })
    }

    useEffect(function(){
        getSubList("", "", 0);
    }, []);

    
 


    return (

    <div style={{display:"flex", marginTop:"116px", marginLeft:"100px"}} className='eduinfolist'>
        <div style={{width:"280px", height:"630px", borderRadius:"16px"}}>
            <a href="/" style={{color:"black", textDecoration:"none"}}>
                <h1 className='eduinfotitle'>교육 정보</h1>
                <p>최신 교육 정보를 제공하고 있습니다.</p>
            </a>
            
            <div className="dropdown">
                <button type="button" className="eduwritebtn" onClick={eduwrite} style={{width:"248px"}}>
                    작성하기
                </button>
            </div>
        </div>
    

        {/* 목록 */}
        <div style={{display:"block", width:"1000px", marginTop:"25px", marginLeft:"100px"}}>
            <div className='navwrapper'>
                <div className='eduinfonav-1' onClick={learnlist} ><h3>학습용 자료실</h3></div>
                <div className='eduinfonav-2' onClick={infolist} ><h3>교육 정보</h3></div>
                <div className='eduinfonav-3' ><h3>고객센터</h3></div>
            </div>
        </div>

            <div className='contentwrapper'>
                {
                    subList && subList.map(function(list, i){
                return (
                    <div key={i}  className={`item-${i}`}
                        style={{display:"inline-block", border:"1px solid lightgray", textAlign:"left", width:"218px", height:"218px"}}>
                        <p>교육 제목 : {list.title}</p>
                        <p>교육 과목 : {list.subject}</p>
                        <p>작성일 : {list.regdate}</p>
                        <button type="button"><Link style={{textDecoration:"none"}} to={`/learning/EduInfoDetail/${list.seq}`}>확인하기</Link></button>
                    </div>
                )
            })
            }
            </div>
     
       </div>
    )
};
