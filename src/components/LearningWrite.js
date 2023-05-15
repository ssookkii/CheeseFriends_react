import React, { useState, useEffect } from 'react';
import './asset/css/LectureWrite.css'

import axios from "axios";
import { useNavigate } from 'react-router';


function LearningWrite() {

    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState("");
    const [newfilename, setNewfilename] = useState("");
    const [inputref, setInputRef] = useState("");


    const login = JSON.parse(localStorage.getItem("login"));
    const userName = login.name;

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
              navigate('/cheesefriends/learning');
            })
            .catch(err => {
              console.log(err);
          })
      }


    const resetBtn = () => {
        navigate('/cheesefriends/learning');
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
                    <input type="file" name="uploadFile" className='inputfile' accept="*" />
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