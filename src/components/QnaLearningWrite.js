import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './asset/css/LectureWrite.css';

import axios from "axios";


export default function QnaLearningWrite() {

    const [subject, setSubject] = useState('');
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');

    const navigate = useNavigate();

   
    const resetBtn = () => {
        navigate('/learning/QnaLearningList');
    }

    const SelectBox = () => {
        return (
            <select onChange={changeSelectOptionHandler} value={subject} style={{marginLeft:"60px", width:"190px", border:"none", borderBottom:"2px solid lightgray"}}>
                <option key="kor" value="국어">국어</option>
                <option key="math" value="수학">수학</option>
                <option key="eng" value="영어">영어</option>
                <option key="social" value="사회">사회</option>
                <option key="sci" value="과학">과학</option>
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

        
        axios.post('http://localhost:3000/writeQna', formData)

        .then( resp => {
            console.log(resp);
            alert('성공적으로 등록되었습니다');

            navigate('/learning/QnaLearningList');
            })
            .catch(err => console.log(err));
            alert('게시물 등록에 실패했습니다');
        }
    

   
    return (
        <div style={{margin:"30px 150px 50px 150px", textAlign:"left", padding:"15px", fontSize:"17px"}}>
            <h2>수업 질문 등록</h2>
            <hr/>
            <form name="frm" onSubmit={onSubmit} encType="multipart/form-data">
            <>
            제목
            <input type="text" id='title' className='title' name='title'
                value={title} onChange={(e) => setTitle(e.target.value)} />
            </>
            <hr/>
            <>
            과목
            <SelectBox />
            </>
            <hr/>
            <>
            작성자
            <input type="text" id='writer' className='writer' name='writer'
                value={writer} onChange={(e) => setWriter(e.target.value)} />
            </>
            <hr/>
            <>
            내용
            </>
            <br />
            <textarea id='content' className='content' name='content'
                value={content} onChange={(e) => setContent(e.target.value)} />

            <div className='btnwrapper'>
            <button type='button' onClick={resetBtn}>취소</button>
            <button type='submit' value='file upload'>등록</button>
            </div>
            </form>
        </div>
    )
}



