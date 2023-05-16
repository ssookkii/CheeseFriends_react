import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import './asset/css/LectureWrite.css';

import axios from "axios";


export default function QnaLearningWrite() {
    const [id, setId] = useState("");
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');

    const loginInfo = JSON.parse(localStorage.getItem("login"));
    const userId = loginInfo?.id;
    const userName = loginInfo?.name;
    const [currentUserId, setCurrentUserId] = useState('');
    const [subject, setSubject] = useState(
        localStorage.getItem("subject")
    );
    const [eduCode, setEduCode] = useState([]);
    const [subCode, setSubCode] = useState("");
    const [userEdu, setUserEdu] = useState(
      localStorage.getItem("userEdu")
    );
    const navigate = useNavigate();
   
    const resetBtn = () => {
        navigate('/cheesefriends/learning/QnaLearningList');
    }

    const [userSubjects, setUserSubjects] = useState([]);
    const [edu_code, setEdu_code] = useState("");

    const [subNames, setSubNames] = useState([]);

    function getEduCode(){
      axios.get("http://localhost:3000/homeEduCode", { params:{ "id":userId }})
      .then(function(resp){
          console.log(resp.data);
          setEduCode(resp.data);
      })
      .catch(function(err){
          alert("err");
          console.log(err);
      })
    }
    useEffect(function(){
      getEduCode();
    },[id]);
    
    // 과목 받아오기
    function subcodereceive(){
      setSubCode("");
      axios.get("http://localhost:3000/subselect", { params:{ "id":userId, "eduCode":userEdu}})
      .then(function(resp){

        console.log(resp.data);
        setSubNames(resp.data);
          
      })
      .catch(function(err){
          console.log(err);
          alert('err');
      }) 
    }
   useEffect(()=>{
    if(eduCode !== ""){
        subcodereceive();
        return;
    }
     }, [eduCode]) 

     const SelectBox = () => {
      return (
        <select onChange={changeSelectOptionHandler} value={subject} className='inputsubject'>
          {Array.isArray(subNames) && subNames.map((sub) => (
            <option key={sub.seq} value={sub.subname}>{sub.subname}</option>
          ))}
        </select>
      );
    };
    const changeSelectOptionHandler = (e) => {
        setSubject(e.target.value);
    };


    const onSubmit = (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append("subject", subject);
        formData.append("title", title);
        formData.append("writer", writer);
        formData.append("content", content);

      
        axios.post('http://localhost:3000/writeQna', null, { params: {
            subject,
            title,
            writer:userName,
            content
        }})
        .then( resp => {
            console.log(resp);
            alert('성공적으로 등록되었습니다');
            navigate('/cheesefriends/learning/QnaLearningList');
        })
        .catch(
            err => console.log(err))   
    }
      
    return ( 
        <div className='lecwritemain'>
            <h2 className='lecmainh2'>수업 질문 등록</h2>
            <form name="frm" onSubmit={onSubmit} encType="multipart/form-data">
                <>
                제목
                <input type="text" id='title' className='inputtitle' name='title'
                    value={title} onChange={(e) => setTitle(e.target.value)} />
                </>
                <br/>
                <>
                과목
                <SelectBox />
                </>
                <br/>
                <>
                작성자
                <input type="text" id='writer' className='inputwriter' name='writer'
                    value={userName} onChange={(e) => setWriter(e.target.value)} readOnly />
                </>
                <br/>
                <>
                <textarea id='content' className='lecontent' name='content'
                    value={content} onChange={(e) => setContent(e.target.value)} />
                </>
                <div className='btnwrapper'>
                    <button type='button' onClick={resetBtn} className='resetbtn'>취소</button>
                    <button type='submit' className='submitbtn'>등록</button>
                </div>
            </form>
        </div>
    )
}



