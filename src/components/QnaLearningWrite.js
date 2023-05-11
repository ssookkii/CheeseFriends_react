import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import './asset/css/LectureWrite.css';

import axios from "axios";


export default function QnaLearningWrite() {

    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');

    const login = JSON.parse(localStorage.getItem("login"));
    const userName = login.name;

    const [subject, setSubject] = useState(
        localStorage.getItem("subject")
    );

    const navigate = useNavigate();
   
    const resetBtn = () => {
        navigate('/cheesefriends/learning/QnaLearningList');
    }

    const [userSubjects, setUserSubjects] = useState([]);
    const [edu_code, setEdu_code] = useState("");

    useEffect (()=>{
        axios.post("http://localhost:3000/eduselect", null, { params:{ "id":login.id}})
        .then(function(resp){   
            console.log(resp.data); 

            setEdu_code(resp.data.educode);

            axios.post("http://localhost:3000/subselect", null, { params:{ "id":login.id, "educode":resp.data.educode}})
            .then(function(resp){   
                console.log(resp.data); 
                setUserSubjects(resp.data);
            })
            .catch(function(err){
                console.log(err);
                alert('err')
            })
            
        })
        .catch(function(err){
            console.log(err);
            alert('err')
        })

    },[]);

    const SelectBox = () => {
        return (
            <select onChange={changeSelectOptionHandler} value={subject} className='inputsubject'>
                {userSubjects.map((subject)=> (
                    <option key={subject.subCode} value={subject.subname}>{subject.subname}</option>
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



