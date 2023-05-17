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
    const [imgBase64, setImgBase64] = useState(""); // 파일 base64
    const [uploadFile, setUploadFile] = useState(null);	//파일	
    

    const login = JSON.parse(localStorage.getItem("login"));
    const userName = login.name;

    const handleChangeFile = (event) => {
        let reader = new FileReader();
    
        reader.onloadend = () => {
          // 2. 읽기가 완료되면 아래코드가 실행됩니다.
          const base64 = reader.result;
          if (base64) {
            setImgBase64(base64.toString()); // 파일 base64 상태 업데이트
          }
        }
        if (event.target.files[0]) {
          reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
          setUploadFile(event.target.files[0]); // 파일 상태 업데이트
        }
      }
      

    // const handleFileSelect = (event) => {
    //     const file = event.target.files[0];
    //     setSelectedFile(URL.createObjectURL(file));
    //   };

    const navigate = useNavigate();

   
    const resetBtn = () => {
        navigate('/cheesefriends/learning/EduInfoList');
    }
    const SelectBox = () => {
    return (
        <select onChange={changeSelectOptionHandler} value={subject}  className='inputsubject' style={{width:"315px"}}>
            <option key="" value=""></option>
            <option key="kor" value="국어">국어</option>
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
                <input type="text" id='title' className='inputtitle' name='title' style={{width:"315px"}} value={title} onChange={(e) => setTitle(e.target.value)}
                />
            </>
            <br/>
            <>
            과목
            <SelectBox />
            </>
            <br/>
            <>
                작성자<input type="text" id='writer' className='inputwriter' name='writer' value={userName} onChange={(e) => setWriter(e.target.value)}/>
            </>
            <br/>
            <div className='efile'>
                <>
                내용
                <input type="file" name="uploadFile" className='inputfile' accept="*" onChange={handleChangeFile} />
                <div style={{"backgroundColor": "#efefef", "width":"300px", "height" : "280px"}}>
                    {imgBase64 && <img src={imgBase64} alt="미리보기" style={{ width: "100%", height: "100%" }} />}
                </div>
                </>
            </div>
            <br />
            
            <textarea
                id='content'
                className='lecontent'
                name='content'
                style={{maxWidth:"733px", marginTop:"-316px", marginLeft:"307px", border:"none"}}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            
            <div className='btnwrapper'>
                <button type='button' onClick={resetBtn} className='resetbtn'>취소</button>
                <button type='submit' value='file upload' className='submitbtn'>등록</button>
            </div>
            </form>
        </div>
        )

}



