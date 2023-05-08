import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import './asset/css/ServiceWrite.css'

export default function ServiceWrite() {

    const [topic, setTopic] = useState('');
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');

    const login = JSON.parse(localStorage.getItem("login"));
    const userName = login.name;

    const navigate = useNavigate();

    const resetBtn = () => {
        navigate('/service/ServiceList');
    }

    const SelectBox = () => {
        return (
            <select onChange={changeSelectOptionHandler} value={topic} style={{marginLeft:"26px", width:"190px", border:"none", borderBottom:"2px solid lightgray"}}>
                <option key="frequently" value="frequently">자주묻는질문</option>
                <option key="userInfo" value="userInfo">개인정보</option>
                <option key="useLect" value="useLect">강의이용</option>
                <option key="player" value="player">학습플레이어</option>
                <option key="mobile" value="mobile">모바일/기타</option>
            </select>
        );
    };

    const changeSelectOptionHandler = (e) => {
        setTopic(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append("topic", topic);
        formData.append("title", title);
        formData.append("writer", writer);
        formData.append("content", content);

        
        axios.post('http://localhost:3000/writeService', formData)

        .then(resp => {
            console.log(resp);
            alert('성공적으로 등록되었습니다');

            navigate('/cheesefriends/service/ServiceList');
        })
        .catch(function(error){
            alert('게시물 등록에 실패했습니다');
         });

         axios.post('http://localhost:3000/writeService', null, { params: {
            topic,
            title,
            writer:userName,
            content
    }})
        .then( resp => {
        console.log(resp);
        navigate('/cheesefriends/service/ServiceList');
        })
        .catch(err => console.log(err));


    
    }
    return (
        <div style={{margin:"-8px 370px 0px", textAlign:"left", padding:"15px", fontSize:"17px"}}>
            <h2>고객센터 문의하기</h2>
            <hr/>
            <form name="frm" onSubmit={onSubmit} encType="multipart/form-data">
            <>
            제목
            <input type="text" id='title' className='title' name='title'
                value={title} onChange={(e) => setTitle(e.target.value)} />
            </>
            <hr/>
            <>
            카테고리
            <SelectBox />
            </>
            <hr/>
            <>
            작성자
            <input type="text" id='writer' className='writer' name='writer'
                value={userName} onChange={(e) => setWriter(e.target.value)} />
            </>
            <hr/>
            <>
            내용
            </>
            <br />
            <textarea id='content' className='content' name='content'
                value={content} onChange={(e) => setContent(e.target.value)} />

            <div className='btnwrapper'>
            <button type='button' onClick={resetBtn} style={{marginRight:"17px"}}>취소</button>
            <button type='submit'>등록</button>
            </div>
            </form>
        </div>
    )
  }

