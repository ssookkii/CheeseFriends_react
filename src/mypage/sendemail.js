import React, { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Session from "react-session-api";

import axios from "axios";
//import teacher from './img/teacher.jpg';



function Sendemail(){

    let history = useNavigate();

     // login 되어 있는지 검사
     useEffect (()=>{
        let local = localStorage.getItem("login");
        let login = JSON.parse(local);
        if(login !== undefined){
            setId(login.id);
            console.log("login.id : " + login.id)
        }else{
            alert('login해 주십시오');
            history('/');
    }

    },[history]);

    let local = localStorage.getItem("login");
    let login = JSON.parse(local);

    const [receiver, setReceiver] = useState("");
    const [title, setTitle] = useState("");
    const [filename, setFilename] = useState("");
    const [content, setContent] = useState("");
    const [id, setId] = useState("");


    // 파일 미리보기
    const [resp, setResp] = useState();
    const [imgFile, setImgFile] = useState("");
    const imgRef = useRef();    // useRef.current

    function imageLoad(){
        const file = imgRef.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
        setImgFile(reader.result);
        }
    }

    // 체크박스 관리 변수
    const [receivercheckboxlist, setReceivercheckboxlist] = useState([]);

    // 체크박스 관리 함수
    const receiveradd = (e) =>{
        console.log("e.target.checked : " + e.target.checked);
        console.log("e.target.value : " + e.target.value);

        if(e.target.checked){
        //   alert("과목 체크 추가");
            setReceivercheckboxlist((receivercheckboxlist) => [...receivercheckboxlist, e.target.value])

            return;
        }else{
        //   alert("과목 체크 제거");
            setReceivercheckboxlist((receivercheckboxlist) => receivercheckboxlist.filter((item)=> item !== e.target.value));

            return;
        }
    }

    // 체크 배열 점검
    useEffect(()=>{
        console.log(receivercheckboxlist);
    }, [receivercheckboxlist]) 

    // 이름으로 아이디 검색
    const [receivercheck, setReceivercheck] = useState(false);
    const [receivermatching, setReceivermatching] = useState([]);

    const [count, setCount] = useState(1);
    

    function receivermatch(){
        
        setReceivercheck(false);
        setReceivermatching("");
        setCount(1);
        setReceivercheckboxlist([]);

        const table = document.getElementById("subplus");

        
        
        if(receiver.length > 1){
            console.log("receiver:" + receiver);

            axios.get("http://localhost:3000/mailreceiverid", { params:{ "name":receiver}})
            .then(function(resp){
                console.log('receivermatch axios.get :' + receiver);

                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
        
                // th만들기
                const tr = document.createElement("tr");
        
                let th = document.createElement("th");
                th.setAttribute("width", "50");
                th.innerText = ""; 
                tr.appendChild(th);
        
                let th2 = document.createElement("th");
                th2.setAttribute("width", "50");
                th2.innerText = "번호"; 
                tr.appendChild(th2);
        
                let th3 = document.createElement("th");
                th3.setAttribute("width", "200");
                th3.innerText = "아이디"; 
                tr.appendChild(th3);
        
                let th4 = document.createElement("th");
                th4.setAttribute("width", "150");
                th4.innerText = "이름"; 
                tr.appendChild(th4);
        
                table.appendChild(tr);


                for (let i = 0; i < resp.data.length; i++) {
                    // const newItem = resp.data[i].id;
                    // receivercheckboxlist([...receivercheckboxlist, newItem]);
                  
                    const tr = document.createElement("tr");
    
                    // 체크박스
                    let td = document.createElement("td");
                    let element0 = document.createElement("input");
    
                    element0.setAttribute("type", "checkbox");
                    element0.setAttribute("name", "receiver");
                    element0.setAttribute("value", resp.data[i].id);
                //    element0.setAttribute("onchange", function(){alert('subcodeadd');});
                    element0.onchange = receiveradd; //function(){alert('subcodeadd');};
    
                    td.append(element0)
                    tr.appendChild(td);
    
                    // 번호
                    let element = document.createElement("td");
                    element.innerText = count + i;
                    tr.appendChild(element);
    
                    // 아이디
                    let element2 = document.createElement("td");
                    element2.innerText = resp.data[i].id;
                    tr.appendChild(element2);
    
                    // 이름
                    let element3 = document.createElement("td");
                    element3.innerText = resp.data[i].name;
                    tr.appendChild(element3);      
                  
                    table.appendChild(tr);
                }
                
            })
            .catch(function(err){
                alert(err);
            })
        }
    } 

    useEffect(()=>{
        receivermatch(receiver);        
    }, [receiver]) 
    

    // 받는사람 추가하기
    const [receivers, setReceivers] = useState([]);

    function receiveraddbtn() {
        const promises = receivercheckboxlist.map((id) =>
          axios.get("http://localhost:3000/mailreceiveradd", { params: { id } })
        );
      
        Promise.all(promises)
          .then((responses) => {
            const newReceivers = responses.map((resp) => resp.data.id);
      
            const uniqueReceivers = new Set([...receivers, ...newReceivers]);
      
            setReceivers(Array.from(uniqueReceivers));
          })
          .catch((err) => {
            alert(err);
          });
      }

    // 받는사람 삭제하기
    function deletereceiver(e){
        setReceivers((receivers) => receivers.filter((item)=> item !== e.target.value));

        //alert(e.target.id);
        document.getElementById(e.target.id).parentElement.parentElement.remove();

    }

    // 받는사람 뿌리기

    useEffect(() => {
        let count2 = 1;
      
        const table = document.getElementById("receiverplus");
      
        while (table.firstChild) {
          table.removeChild(table.firstChild);
        }
      
        const promises = receivers.map((id) =>
          axios.get("http://localhost:3000/mailreceiveradd", { params: { id } })
        );
      
        Promise.all(promises)
          .then((responses) => {
            responses.forEach((resp) => {

            console.log(receivers)
                
            const tr = document.createElement("tr");
    
            // 번호
            let element = document.createElement("td");
            element.innerText = count2++;
            tr.appendChild(element);
    
            // 아이디
            let element2 = document.createElement("td");
            element2.innerText = resp.data.id;
    
            tr.appendChild(element2);
    
            // 이름
            let element3 = document.createElement("td");
            element3.innerText = resp.data.name;
            tr.appendChild(element3);
    
            // 삭제버튼
            let element4 = document.createElement("td");
    
            let button = document.createElement("button");
            button.innerText = "삭제";
            button.setAttribute("value", resp.data.id);
            button.setAttribute("id", resp.data.id);
            button.onclick = deletereceiver;
    
            element4.appendChild(button);
            tr.appendChild(element4);
    
            table.appendChild(tr);
                
             
            });
          })
          .catch((err) => {
            alert(err);
          });
      }, [receivers]);
    
    // useEffect(()=>{
    //     console.log("receivers: " + receivers);

    //     let count2 = 1;

    //     const table = document.getElementById("receiverplus");

    //     while (table.firstChild) {
    //         table.removeChild(table.firstChild);
    //     } 

    //     for (let i = 0; i < receivers.length; i++) {
    //         axios.get("http://localhost:3000/mailreceiveradd", { params:{ "id":receivers[i]}})
    //         .then(function(resp){

    //             const tr = document.createElement("tr");

    //             // 번호
    //             let element = document.createElement("td");
    //             element.innerText = count2++;
    //             tr.appendChild(element);

    //             // 아이디
    //             let element2 = document.createElement("td");
    //             element2.innerText = resp.data.id;
                
    //             tr.appendChild(element2);

    //             // 이름
    //             let element3 = document.createElement("td");
    //             element3.innerText = resp.data.name;
    //             tr.appendChild(element3);
                
    //             // 삭제버튼
    //             let element4 = document.createElement("td");
                
    //             let button = document.createElement("button");
    //             button.innerText = "삭제";
    //             button.setAttribute("value", resp.data.id);
    //             button.setAttribute("id", resp.data.id);
    //             button.onclick = deletereceiver;
                

    //             element4.appendChild(button);
    //             tr.appendChild(element4);
                
    //             table.appendChild(tr);
            
                
    //         })
    //         .catch(function(err){
    //             alert(err);
    //         })
    //     }
    //  }, [receivers]) 


    // 쪽지 보내기
    const [receivera, setReceivera] = useState(true);
    const [titlea, setTitlea] = useState(true);
    const [contenta, setContenta] = useState(true);
  

    function mailsend(){
        // alert("작동");
        // 회원가입 유효검사
        setReceivera(true);
        setTitlea(true);
        setContenta(true);

        if(receivers.length === 0){
            setReceivera(false);
            alert("쪽지 받을 사람을 추가해주세요");
            return;
        }else if(title.length === 0){
            setTitlea(false);
            alert("제목을 입력해주세요");
            return;
        }else if(content.length === 0){
            setContenta(false);
            alert("내용을 입력해주세요");
            return;
        }


        // 보내자
        for (let i = 0; i < receivers.length; i++) {
            axios.post("http://localhost:3000/mailsend", null, 
            { params:{  "sender":id, 
                        "receiver":receivers[i], 
                        "title": title, 
                        "content":content
            }})
            .then(function(resp){
              //  alert("성공");
            })
            .catch(function(err){
                alert("err");
                console.log(err);
            })
        }
        

        // 파일 저장
        const formData = new FormData();
        formData.append('uploadFile', imageSrc, id + ".jpg");
    
        fetch('http://localhost:3000/fileUpload', {
            method: 'POST',
            body: formData,
        })
        // .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));

        alert("쪽지를 보냈습니다");
        history("/testmain");      // 이동(link)
    }
  

    return(
        <div>
            <div>
                <h1>쪽지 보내기</h1>
                <br/>
                <table border="1" align="center">
                    <colgroup>
                        <col width="150"/><col width="150"/><col width="150"/>
                    </colgroup>
                    <tr>
                        <td>
                            <Link to="/testmain/email">받은 쪽지함</Link>
                        </td>
                        <td>
                            <Link to="sendemaillist">보낸 쪽지함</Link>
                        </td>
                        <td style={{backgroundColor:"grey"}}>쪽지 보내기</td>
                    </tr>
                </table>
            

                <br/>
                <table border="1" align="center"> 
                    <colgroup>
                        <col width="100" /><col width="200" /><col width="100" />
                    </colgroup>
                    <tr>
                        <td>받는사람검색</td>
                        <td align="left" colSpan="2">
                            <div>
                                {receivera === true 
                                ? <input style={{ width:"230px"}} value={receiver} onChange={(e) => setReceiver(e.target.value)} ></input>
                                : <input style={{ borderColor:"red", width:"230px"}} value={receiver} onChange={(e) => setReceiver(e.target.value)} ></input>}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>받는사람 추가</td>
                        <td>
                            <table border="1" className="subplus" id="subplus">
                                <colgroup>
                                    <col width="50" /><col width="50" /><col width="200" /><col width="150" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th></th><th>번호</th><th>아이디</th><th>이름</th>
                                    </tr>
                                </thead>
                            </table>
                        </td>
                        <td>
                            <button onClick={receiveraddbtn}>추가</button>
                        </td>
                    </tr>
                    <tr>
                        <td>받는사람</td>
                        <td align="left" colSpan="2">
                            <table border="1" className="receiverplus" id="receiverplus">
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>제목</td>
                        <td align="left" colSpan="2">
                            
                            {titlea === true 
                                ? <input style={{ width:"230px"}} value={title} onChange={(e)=>setTitle(e.target.value)}></input>
                                : <input style={{ borderColor:"red", width:"230px"}} value={title} onChange={(e)=>setTitle(e.target.value)}></input>}
                        </td>
                    </tr>
                    <tr>
                        <td>파일</td>
                        <td >
                            <input style={{ width:"230px"}} type="file" name="uploadFile" onChange={imageLoad} ref={imgRef}></input>
                        </td>
                        <td>
                            <button>첨부</button>
                        </td>
                    </tr>

                    <tr>
                        <td>미리보기</td>
                        <td colSpan="2">
                            <img style={{ width:"230px"}} src={imgFile} alt=""/>
                        </td>
                    </tr>

                    <tr>
                        <td>내용</td>
                        <td align="left" colSpan="2">
                        {contenta === true 
                                ? <textarea style={{ width:"230px", height:"200px"}} value={content} onChange={(e)=>setContent(e.target.value)} ></textarea>
                                : <textarea style={{ borderColor:"red", width:"230px", height:"200px"}} value={content} onChange={(e)=>setContent(e.target.value)} ></textarea>}
                           
                        </td>
                    </tr>

                </table>

                <br/><br/>
                <button onClick={mailsend}>보내기</button>

            </div>
        </div>
    )

}

export default Sendemail;
