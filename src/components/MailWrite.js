import React, {useState} from "react";
import axios from 'axios';

function MailWrite(){
    const [receiver, setReceiver] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const sender = localStorage.getItem("login");

    const receiverChange = (e) => setReceiver(e.target.value.split(','));
    const titleChange = (e) => setTitle(e.target.value);
    const contentChange = (e) => setContent(e.target.value);

    // upload
    const onSubmit = (e) => {
        e.preventDefault();
        // alert('onSubmit')

        // file + form field -> 짐을 싼다
        let formData = new FormData();
        formData.append("receiver", receiver);
        formData.append("title", title);
        formData.append("content", content);

        formData.append("fileload", document.frm.fileload.files[0]); /* 여기 이름은 스프링의 @Request param의 이름과 동일해야함 */

        // 보내자
        axios.post("http://localhost:3000/adminMailWrite", formData)
        .then(res=>{
            // 성공했을 떄 여기로 들어옴 
            console.log(res.data);
            alert('file upload에 성공했습니다');
        })
        .catch(function(error){
        // 실패하면 여기로 들어옴
        alert('file upload에 실패했습니다');
        });
    }

    

    return (
        <div>
        <form name="frm" onSubmit={onSubmit} encType="multipart/form-data">
            <div>
                <span>수신인</span>
                <input value={receiver.join(',')} onChange={receiverChange} placeholder='수신인 여러명일 경우 쉼표(,)로 구분'/>
                <input type="hidden" value={sender.id}/>
            </div>
            <div>
                <span>제목</span>
                <input value={title} onChange={titleChange} placeholder='제목'/><br></br>
            </div>
            <div>
                <span>첨부파일</span>
                <input type="file" name="fileload" accept="*"/>
            </div>
            <div>
                <span>내용</span>
                <textarea value={content} onChange={contentChange} placeholder='내용'></textarea>
            </div>
            <input type="submit" value="쪽지전송"/>
        </form>
        </div>
    );
}
export default MailWrite