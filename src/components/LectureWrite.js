import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './asset/css/LectureWrite.css'
import { navigate, useNavigate } from 'react-router';
import axios from "axios";

function LectureWrite() {

    const [subject, setSubject] = useState('');
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');

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
       alert('성공적으로 등록되었습니다');
    })
    .catch(function(error){
       alert('강의 등록에 실패했습니다');
    });

    axios.post('http://localhost:3000/writeLecture', null, { params: {
                subject,
                title,
                writer,
                content
        }})
            .then( resp => {
            console.log(resp);
            navigate('/lecture/LectureList');
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
        navigate('/lecture/LectureList');
    }

    const SelectBox = () => {
        return (
            <select onChange={changeSelectOptionHandler} value={subject} style={{marginLeft:"170px", width:"190px", border:"none", borderBottom:"2px solid lightgray"}}>
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
            <div style={{margin:"30px 150px 50px 150px", padding:"15px", fontSize:"17px"}}>
                <h2>강의 업로드</h2>
                <hr/>
                <form name='frm' onSubmit={onSubmit} encType='multipart/form-data'>
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
                    <input type="file" name='uploadFile' accept='*' />
                    <hr/>
                   
                    <div className='btnwrapper'>
                        <button type='button' onClick={resetBtn}>취소</button>
                        <button type='submit' value='file upload'>등록</button>
                    </div>
                </form>
            </div>

        );
    }



export default LectureWrite;