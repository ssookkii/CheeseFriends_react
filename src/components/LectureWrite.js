import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './LectureWrite.css';
import axios from "axios";

function LectureWrite() {

    const [subject, setSubject] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [title, setTitle] = useState('');
    const [writer, setWriter] = useState('');
    const [content, setContent] = useState('');
 
    const submitBtn = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/writeLecture', null, { params: {
                subject,
                subjectCode,
                title,
                writer,
                content
        }})
            .then(resp => console.log(resp))
            .catch(err => console.log(err));

    };

   
        return (
            <div style={{margin:"30px 150px 50px 150px", padding:"15px", fontSize:"17px"}}>
                <h2>강의 업로드</h2>
                <hr/>
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
                <div style={{marginTop:"10px"}}>
                    <CKEditor
                        data={ content }
                        onBlur={ (event, editor) => {
                            const conts = editor.getData();

                            setContent(conts);
                        }}
                        editor={ ClassicEditor }
                        config={{
                            placeholder: "내용을 입력하세요.",

                        }}
                        onReady={ editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log( 'Editor is ready to use!', editor );
                        } }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            console.log( { event, editor, data } );
                        } }
                        onFocus={ ( event, editor ) => {
                            console.log( 'Focus.', editor );
                        } }
                    />
                </div>
                <div className='btnwrapper'>
                <button type='reset'>취소</button>
                <button type='submit' onClick={submitBtn}>등록</button>
                </div>
            </div>
        );
    }



export default LectureWrite;