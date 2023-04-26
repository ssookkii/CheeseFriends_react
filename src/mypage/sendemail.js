import React, { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import Session from "react-session-api";

import axios from "axios";
import Addmodal from "./addmodal";
import Searchmodal from "./searchmodal";



function Sendemail(){

    let history = useNavigate();
    
    // 모달 팝업2
    const [modalOpen2, setModalOpen2] = useState(false);

    const openModal2 = () => {
        setIscheck(false);
        setModalOpen2(true);
        setReceiver("");
        setUseraddlist([]);
        setReceivercheckboxlist([]);
    };

    const closeModal2 = () => {
        console.log("closeModal2 작동");
        setModalOpen2(false);
    };

    const yescloseModal2 = () => {
        console.log("yescloseModal2 작동");
        setModalOpen2(false);
        receiveraddbtn();
    };
    
     // 모달 팝업
     const [modalOpen, setModalOpen] = useState(false);

     const openModal = () => {
        setIscheck(false);
        setModalOpen(true);
        educodereceive();
        setReceiver("");
        setUseraddlist([]);
        setReceivercheckboxlist([]);
     };
 
     const closeModal = () => {
         console.log("closeModal 작동");
         setModalOpen(false);
     };
 
     const yescloseModal = () => {
         console.log("yescloseModal 작동");
         setModalOpen(false);
         receiveraddbtn();
     };

     const [useraddlist, setUseraddlist] = useState([]);
     const [edu_code, setEdu_code] = useState("");
     const [sub_code, setSub_code] = useState("");
     const [idlist, setIdlist] = useState([]);

     // 교육기관 받아오기
     function educodereceive(){
        setEdu_code("");
        axios.get("http://localhost:3000/eduselect", { params:{ "id":id}})
        .then(function(resp){
            const edu = document.getElementById("edu");

            while (edu.firstChild) {
                edu.removeChild(edu.firstChild);
            }

            let element = document.createElement("option");
            element.innerText = "교육기관을 선택해주세요";
            element.setAttribute("value", "");
            edu.appendChild(element);
          
            for (let i = 0; i < resp.data.length; i++) {
                let element = document.createElement("option");
                element.innerHTML = resp.data[i].eduName;
                element.setAttribute("value", resp.data[i].eduCode);
                edu.appendChild(element);
            }
        })
        .catch(function(err){
            console.log(err);
            alert('err');
        }) 
     }

    useEffect(()=>{
        if(edu_code !== ""){
            subcodereceive();
            return;
        }
    }, [edu_code]) 


     // 과목 받아오기
     function subcodereceive(){
        setSub_code("");
        axios.get("http://localhost:3000/subselect", { params:{ "id":id, "eduCode":edu_code}})
        .then(function(resp){
            console.log("eduselect 성공");
            console.log(resp.data);
            
            const sub = document.getElementById("sub");

            while (sub.firstChild) {
                sub.removeChild(sub.firstChild);
            }

            let element = document.createElement("option");
            element.innerText = "과목을 선택해주세요";
            element.setAttribute("value", "");
            sub.appendChild(element);
          
            for (let i = 0; i < resp.data.length; i++) {
                let element = document.createElement("option");
                element.innerHTML = resp.data[i].subname;
                element.setAttribute("value", resp.data[i].subcode);
                sub.appendChild(element);
            }
        })
        .catch(function(err){
            console.log(err);
            alert('err');
        }) 
     }

     // 유저 리스트 뿌리기
     const userlist = async () => {
        setReceivercheckboxlist([]);
        // 교육기관, 과목 둘다 선택시
        if(edu_code !== "" && sub_code !== ""){
            await axios.get("http://localhost:3000/userlist", { params:{ "educode":edu_code, "subcode":sub_code}})
            .then(function(resp){
                setUseraddlist(resp.data.list);     
                setIdlist([]);
                setIscheck(false);

                for (let i = 0; i < resp.data.list.length; i++) {
                    setIdlist((idlist) => [...idlist, resp.data.list[i].id]);
                }
            
            })
            .catch(function(err){
                console.log(err);
                alert('err');
            })
        }
        // 교육기관만 선택시
        else if(edu_code !== "" && sub_code === ""){
            console.log("교육기관만 선택함");
            await axios.get("http://localhost:3000/userlisttwo", { params:{ "educode":edu_code}})
            .then(function(resp){
                setUseraddlist(resp.data.list);
                console.log("userlist 성공");
                console.log(resp.data.list);         
                setIdlist([]);
                setIscheck(false);

                for (let i = 0; i < resp.data.list.length; i++) {
                    setIdlist((idlist) => [...idlist, resp.data.list[i].id]);
                }
            
            })
            .catch(function(err){
                console.log(err);
                alert('err');
            })
        }
        // 아무것도 선택하지 않을시
        else if(edu_code === "" && sub_code === ""){
            const table = document.getElementById("userlist");

            while (table.firstChild) {
                table.removeChild(table.firstChild);
            }

            alert("교육기관 선택 후 확인이 가능합니다");
        }
    }
 

     // login 되어 있는지 검사
     useEffect (()=>{
        let local = localStorage.getItem("login");
        let login = JSON.parse(local);
        if(login !== undefined){
            setId(login.id);
        }else{
            alert('login해 주십시오');
            history('/');
    }

    },[history]);

    let local = localStorage.getItem("login");
    let login = JSON.parse(local);

    const [receiver, setReceiver] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [id, setId] = useState("");

    // 체크박스 관리 변수
    const [receivercheckboxlist, setReceivercheckboxlist] = useState([]);
    const [ischeck, setIscheck] = useState(false);

    // 체크박스 관리 함수
    // const receiveradd = (e) =>{
    //     console.log("e.target.checked : " + e.target.checked);
    //     console.log("e.target.value : " + e.target.value);

    //     if(e.target.checked){
    //         setReceivercheckboxlist((receivercheckboxlist) => [...receivercheckboxlist, e.target.value])

    //         return;
    //     }else{
    //         setReceivercheckboxlist((receivercheckboxlist) => receivercheckboxlist.filter((item)=> item !== e.target.value));

    //         return;
    //     }
    // }

    const receiveradd = (checked, id) =>{    
        if(checked){
            setReceivercheckboxlist([...receivercheckboxlist, id]); 
        }else{
            setIscheck(false);
            setReceivercheckboxlist((receivercheckboxlist) => receivercheckboxlist.filter((item)=> item !== id)); 
        }
    }

    // 체크 배열 점검
    useEffect(()=>{
        console.log(receivercheckboxlist);
    }, [receivercheckboxlist]) 

    function allcheck(e){
        console.log("올체크 작동");
        if(e.target.checked){
            setIscheck(true);
            for (let i = 0; i < idlist.length; i++) {
                setReceivercheckboxlist((receivercheckboxlist) => [...receivercheckboxlist, idlist[i]]);
                console.log("idlist: " + idlist[i]);
            }
            console.log("setIscheck : true" + ischeck);
        }
        else{
            setIscheck(false);
            setReceivercheckboxlist([]);
            console.log("setIscheck : false" + ischeck);
        }
    }



    // 이름으로 아이디 검색
    const [receivercheck, setReceivercheck] = useState(false);
    const [receivermatching, setReceivermatching] = useState([]);

    const receivermatch = async () => {
        setReceivercheck(false);
        setReceivermatching("");
        setReceivercheckboxlist([]);

        const table = document.getElementById("subplus");

        
        if(receiver.length > 1){
            await axios.get("http://localhost:3000/mailreceiverid", { params:{ "name":receiver}})
            .then(function(resp){
                setUseraddlist(resp.data.list);

                console.log("userlist 성공");
                console.log(resp.data.list);         
    
            })
            .catch(function(err){
                console.log(err);
                alert(err);
            })
        }
    } 

    useEffect(()=>{
        if(receiver !== ""){
            receivermatch(receiver);     
        }   
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
            console.log(err);
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

            //console.log(receivers)
                
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
            console.log(err);
          });
      }, [receivers]);
 

    let params = useParams();
    //console.log(params.sender);

    useEffect(()=>{
        //console.log("sender : " + params.sender);
        if(params.sender !== null && params.sender !== "" && params.sender !== undefined){
            setReceivers([params.sender]);
        }
    },[])
    
    // 파일 미리보기
    const formData = new FormData();

    const [resp, setResp] = useState();
    const [imgFile, setImgFile] = useState("");
    const imgRef = useRef();    // useRef.current
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState("");
    const [newfilename, setNewfilename] = useState("");
    

    function imageLoad(e){
        const file = imgRef.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
        setImgFile(reader.result);

        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);

        if(filename.indexOf('.') >= 0) {	// 확장자명이 있음
			const fpost = filename.substring(filename.indexOf('.'));	// .txt
			setNewfilename(new Date().getTime() + fpost);		// 342456232 + .txt
		}else {		// 확장자명이 없음
			setNewfilename(new Date().getTime() + ".back");	// 342456232 + .back
		}


        }
    }

    // 쪽지 보내기
    const [receivera, setReceivera] = useState(true);
    const [titlea, setTitlea] = useState(true);
    const [contenta, setContenta] = useState(true);
  

    function mailsend(){
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
                        "content":content,
                        "filename":filename,
                        "newfilename":newfilename
            }})
            .then(function(resp){
              //  alert("성공");
            })
            .catch(function(err){
                alert("err");
                console.log(err);
            })
        }
        

        if(filename !== null && filename !== ""){
            // 파일 저장
            const formData = new FormData();
            formData.append('uploadFile', file, filename);
            // console.log(formData);
        
            fetch('http://localhost:3000/mailfile', {
                method: 'POST',
                body: formData,
            })
            // .then((response) => response.json())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
        }

        alert("쪽지를 보냈습니다");
        history("/testmain/sendemaillist");      // 이동(link)
    }
  
    // 맵으로 뿌려주기
    function TableRow(props){
        return (
            <tr>
                <td>
                    {/* <input type="checkbox" value={props.user.id} onChange={receiveradd} checked={ischeck?true:false}></input>  */}
                    <input type="checkbox" id={props.user.id} onChange={(e)=>receiveradd(e.currentTarget.checked, props.user.id)} 
                           checked={receivercheckboxlist.includes(props.user.id)?true:false || ischeck?true:false}></input>                    
                </td>
                <td>{props.cnt}</td>
                <td>{props.user.id}</td>
                <td>{props.user.name}</td>
            </tr>
        );
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
                            <Link to="/testmain/sendemaillist">보낸 쪽지함</Link>
                        </td>
                        <td style={{backgroundColor:"grey"}}>쪽지 보내기</td>
                    </tr>
                </table>
            

                <br/>
                <table>
                    <tr>
                        <td>
                            <div>
                            <React.Fragment>
                            <button onClick={openModal2}>받는사람 검색</button>
                            <Searchmodal open2={modalOpen2} close2={closeModal2} yesclose2={yescloseModal2} header2="받는사람 검색">
                            <main>
                                <table border="1" align="center">
                                    <colgroup>
                                        <col width="150" /><col width="100" />
                                    </colgroup>
                                    <tr>
                                        <th>받는사람 검색</th><th>이름</th>
                                    </tr>
                                    <tr>
                                        <td>받는사람 검색</td>
                                        <td>
                                            <div>
                                                <input style={{ width:"150px"}} value={receiver} onChange={(e) => setReceiver(e.target.value)} ></input>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                <br/>
                                <table border="1" align="center" className="subplus" id="subplus">
                                    <colgroup>
                                        <col width="50" /><col width="50" /><col width="200" /><col width="150" />
                                    </colgroup>
                                    <tr>
                                        <th></th><th>번호</th><th>아이디</th><th>이름</th>
                                    </tr>
                                    {useraddlist !== null
                                        ?useraddlist.map(function(dto, i){
                                            return (
                                                <TableRow user={dto} cnt={i+1} key={i} />
                                            )
                                        })
                                        :<td></td>
                                    }         
                                </table>
                            </main>        
                            </Searchmodal>
                            </React.Fragment>
                            </div>
                        </td>
                        <td>
                        <div>
                            <React.Fragment>
                            <button onClick={openModal}>단체인원 추가</button>
                            <Addmodal open={modalOpen} close={closeModal} yesclose={yescloseModal} header="단체인원 추가">
                            <main>
                                <table border="1" align="center">
                                    <colgroup>
                                        <col width="100" /><col width="200" /><col width="100" />
                                    </colgroup>
                                    <tr>
                                        <th>교육기관 선택</th><th>과목 선택</th><th>수강생</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <select className="edu" id="edu" onChange={(e) => setEdu_code(e.target.value)} >
                                            
                                            </select>
                                        </td>
                                        <td>
                                            {edu_code === ""
                                            ?<select className="sub" id="sub" style={{display:"none"}} onChange={(e) => setSub_code(e.target.value)}></select>
                                            :<select className="sub" id="sub" onChange={(e) => setSub_code(e.target.value)}></select>
                                            } 
                                        </td>
                                        <td>
                                            <button onClick={userlist}>확인</button>
                                        </td>
                                    </tr>
                                </table>

                                <br/>
                                <table border="1" align="center" className="userlist" id="userlist">
                                    <colgroup>
                                        <col width="50" /><col width="50" /><col width="200" /><col width="150" />
                                    </colgroup>
                                    <tr>
                                        <th>
                                            <input type="checkbox" onChange={allcheck} checked={ischeck?true:false}></input>
                                        </th>
                                        <th>번호</th><th>아이디</th><th>이름</th>
                                    </tr>
                                    {useraddlist !== null
                                        ?useraddlist.map(function(dto, i){
                                            return (
                                                <TableRow user={dto} cnt={i+1} key={i} />
                                            )
                                        })
                                        :<td></td>
                                    }  
                                </table>
                                 
                            
                            </main>        
                            </Addmodal>
                            </React.Fragment>
                        </div>
                        </td>
                    </tr>
                    </table>
                    <br/>

                    <table border="1" align="center"> 
                    <colgroup>
                        <col width="100" /><col width="200" /><col width="100" />
                    </colgroup>
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
                            <input style={{ width:"230px"}} type="file" name="uploadFile"  multiple="multiple" onChange={imageLoad} ref={imgRef}></input>
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
