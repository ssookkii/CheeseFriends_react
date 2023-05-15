import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './asset/css/LectureWrite.css';
import axios from "axios";

export default function EduInfoWrite() {

    const [subject, setSubject] = useState('');
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const login = JSON.parse(localStorage.getItem("login"));
    const userName = login.name;

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        setSelectedFile(URL.createObjectURL(file));
      };

    const navigate = useNavigate();

   
    const resetBtn = () => {
        navigate('/cheesefriends/learning/EduInfoList');
    }
    const SelectBox = () => {
    return (
        <select onChange={changeSelectOptionHandler} value={subject}  className='inputsubject' style={{width:"315px"}}>
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
              navigate('/cheesefriends/learning/EduInfoList');
            })
            .catch(err => {
              console.log(err);
          })
      }
    
   
    return (
        <div className='lecwritemain'>
            <h2 className='lecmainh2'>교육 정보 작성</h2>
            <form name="frm" onSubmit={onSubmit} encType="multipart/form-data">
            <>
            제목
            <input type="text" id='title' className='inputtitle' name='title' style={{width:"315px"}}
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
                value={userName} onChange={(e) => setWriter(e.target.value)} />
            </>
            <br/>
            <>
            내용
            </>
            <input type="file" name="uploadFile" className='inputfile' accept="*" onChange={handleFileSelect} />
            <br />
            <div className='efile'>
            {selectedFile && <img src={selectedFile} id="previewImage" alt="미리보기" style={{ maxWidth: "300px", marginTop:"13px", maxHeight:"310px" }} />}
            <textarea id='content' className='lecontent' name='content' style={{maxWidth:"733px"}}
                value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div className='btnwrapper'>
            <button type='button' onClick={resetBtn} className='resetbtn'>취소</button>
            <button type='submit' value='file upload' className='submitbtn'>등록</button>
            </div>
            </form>
        </div>
    )
}



