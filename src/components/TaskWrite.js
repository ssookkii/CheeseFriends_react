import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
 import './asset/css/LectureWrite.css';

import axios from "axios";


function TaskWrite() {
    const [id, setId] = useState("");
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');
    const [subNames, setSubNames] = useState([]);
    const [currentUserId, setCurrentUserId] = useState('');
    const loginInfo = JSON.parse(localStorage.getItem("login"));
    const userId = loginInfo?.id;
    const userName = loginInfo?.name;
    const [eduCode, setEduCode] = useState([]);
    const [subCode, setSubCode] = useState("");
    const [userEdu, setUserEdu] = useState(
      localStorage.getItem("userEdu")
    );
    const [subject, setSubject] = useState(
        localStorage.getItem("subject")
    );

    const navigate = useNavigate();

     const onSubmit = (e) => {
        e.preventDefault();
     //   alert('onSubmit~~~');
        
      // file + form field -> 짐을 싼다        
      const formData = new FormData();
        formData.append("subject", subject);
        formData.append("title", title);
        formData.append("writer", userName);
        formData.append("content", content);
        formData.append("uploadFile", document.frm.uploadFile.files[0]);

        axios.post('http://localhost:3000/fileUpload', formData)
          .then(resp => {
            console.log(resp.data);
            alert('성공적으로 등록되었습니다');
            navigate('/cheesefriends/learning/TaskList');
          })
          .catch(err => {
            console.log(err);
        })
      }

      const resetBtn = () => {
          navigate('/cheesefriends/learning/TaskList');
      }    
            
      const [userSubjects, setUserSubjects] = useState([]);
      const [edu_code, setEdu_code] = useState("");

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
          
          
    return (
        <div  className='lecwritemain'>
            <h2 className='lecmainh2'>과제 제출</h2>

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
            내용
            </>
            <input type="file" name='uploadFile' className='inputfile' accept='*' />
            <br />
            <textarea id='content' className='lecontent' name='content'
                value={content} onChange={(e) => setContent(e.target.value)} />

            <div className='btnwrapper'>
                <button type='button' onClick={resetBtn} className='resetbtn'>취소</button>
                <button type='submit' value='file upload' className='submitbtn'>등록</button>
            </div>
            </form>
        </div>
    );
  }



export default TaskWrite;