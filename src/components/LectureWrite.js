import React, { useState, useEffect } from 'react';
import './asset/css/LectureWrite.css'
import { useNavigate } from 'react-router';
import axios from "axios";

function LectureWrite() {

    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');

    const login = JSON.parse(localStorage.getItem("login"));
    const userName = login.name;

    const [subject, setSubject] = useState(
        localStorage.getItem("subject")
    );

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
                writer:userName,
                content
        }})
            .then( resp => {
            console.log(resp);
            navigate('/cheesefriends/lecture');
            })
            .catch(err => console.log(err));
  }

  // download
  const download = async () => {
    let filename = "zoom.txt";

    const url = "http://localhost:3000/fileDownload?filename=" + filename;

    window.location.href = url;
  }

    const resetBtn = () => {
        navigate('/cheesefriends/lecture');
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
                <h2 className='lecmainh2'>강의 업로드</h2>
                
                <form name='frm' onSubmit={onSubmit} encType='multipart/form-data' style={{textAlign:"left", marginTop:"20px"}}>
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
                        value={userName} onChange={(e) => setWriter(e.target.value)} readOnly/>
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


export default LectureWrite;