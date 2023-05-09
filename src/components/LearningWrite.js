import React, { useState } from 'react';
import './asset/css/LectureWrite.css'

import axios from "axios";
import { useNavigate } from 'react-router';


function LearningWrite() {

    const [subject, setSubject] = useState('');
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');

    const login = JSON.parse(localStorage.getItem("login"));
    const userName = login.name;

    const navigate = useNavigate();

    const onSubmit = (e) => {
    e.preventDefault();
    // alert('onSubmit');

    // file + form field -> 짐을 싼다
    let formData = new FormData();
    formData.append("subject", subject);
    formData.append("title", title);
    formData.append("writer", writer);
    formData.append("content", content);

    formData.append("uploadFile", document.frm.uploadFile.files[0]);

    // 보내자!
    axios.post("http://localhost:3000/fileUpload", formData)
    .then(res=>{
       console.log(res.data);
       alert('자료 업로드에 성공했습니다');
       navigate('/cheesefriends/learning');
    })
    .catch(function(error){
       alert('자료 업로드에 실패했습니다');
    });

    axios.post('http://localhost:3000/writeLearning', null, { params: {
                subject,
                title,
                writer:userName,
                content
        }})
            .then( resp => {
            console.log(resp);
            navigate('/cheesefriends/learning');
            })
            .catch(err => console.log(err));

  }

  // download
  const download = async () => {
    let filename = "zoom.txt";

    const url = "http://localhost:3000/fileDownload?filename=" + filename;

    // a tag 를 생성 + 자동실행
    /*
    const download = document.createElement('a');   // <a href='' 
    download.setAttribute('href', url);
    download.setAttribute('download', filename);
    download.setAttribute('type', 'application/json');
    download.click();
    */

    // react에서 window를 붙여줘야 한다
    window.location.href = url;
  }

    const resetBtn = () => {
        navigate('/cheesefriends/learning');
    }
    
    const SelectBox = () => {
        return (
            <select onChange={changeSelectOptionHandler} value={subject} className='inputsubject'>
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

   
        return (
            <div className='lecwritemain'>
                <h2 className='lecmainh2'>수업자료 등록</h2>
                
                <form name="frm" onSubmit={onSubmit} encType="multipart/form-data" style={{textAlign:"left"}}>
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
                        value={userName}  onChange={(e) => setWriter(e.target.value)} readOnly />
                    </>
                    <br/>
                    <>
                    내용
                    </>
                    <input type="file" name="uploadFile" className='inputfile' accept="*"  />
                    <br/>
                    <textarea id='content' className='lecontent' name='content'
                        value={content} onChange={(e) => setContent(e.target.value)} />

                    <div className='btnwrapper'>
                        <button type='button' className='resetbtn' style={{borderRadius:"4px"}} onClick={resetBtn}>취소</button>
                        <button type='submit' className='submitbtn' style={{marginLeft:"15px"}} value='file upload'>등록</button>
                    </div>
                </form>
            </div>
        );
    }



export default LearningWrite;