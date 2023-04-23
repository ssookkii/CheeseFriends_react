import React, { useState } from 'react';
import { navigate, useNavigate } from 'react-router';
// import './asset/css/LectureWrite.css';

import axios from "axios";


function TaskWrite() {

    const [subject, setSubject] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
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
        formData.append("subjectCode", subjectCode);
        formData.append("title", title);
        formData.append("writer", writer);
        formData.append("content", content);
    
        formData.append("uploadFile", document.frm.uploadFile.files[0]);
    
        // 보내자!
        axios.post("http://localhost:3000/fileUpload", formData)
        .then(res=>{
           console.log(res.data);
           alert('file upload에 성공했습니다');
        })
        .catch(function(error){
           alert('file upload에 실패했습니다');
        });

        axios.post('http://localhost:3000/writeTask', null, { params: {
                subject,
                subjectCode,
                title,
                writer,
                content
        }})
        .then( resp => {
            console.log(resp);
            navigate('/learning/TaskList');
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
                navigate('/learning/TaskList');
            }


   
        return (
            <div style={{margin:"30px 150px 50px 150px", padding:"15px", fontSize:"17px"}}>
                <h2>과제 제출</h2>
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
                <input type="text" id='subject' className='subject' name='subject'
                    value={subject} onChange={(e) => setSubject(e.target.value)} />
                </>
                <hr/>
                <>
                과목코드
                <input type="text" id='subjectCode' className='subjectCode' name='subjectCode'
                    value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} />
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
                <input type="file" name='uploadFile' accept='*'/>
                <hr/>

                <div className='btnwrapper'>
                <button type='button' onClick={resetBtn}>취소</button>
                <button type='submit' value='file upload'>등록</button>
                </div>
                </form>
            </div>
        );
    }



export default TaskWrite;