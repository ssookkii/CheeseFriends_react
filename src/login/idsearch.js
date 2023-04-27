import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import axios from "axios";


function Idsearch(){
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState("");
    const [phone_public, setPhone_public] = useState("");

    function passwordsearch(){
        window.location.href = "/passwordsearch"
    }

    function login(){
        window.location.href = "/";
    }
    

    // 이름 정규식
    const nameRegEx = /^[가-힣]{2,6}$/;
    const [namec, setNamec] = useState("");

    const namecheck = (name) => {
            if(name.match(nameRegEx)===null) {
                setNamec("이름을 입력해주세요");
            return;
            }else{
                setNamec("입력되었습니다");
            }
    }

    useEffect(()=>{
        namecheck(name);        
    }, [name]) 
    


    // 핸드폰 번호 정규식
    const phoneRegEx = /^01(?:0|1|[6-9])-(?:\d{4}|\d{4})-\d{4}$/
    const [phonec, setPhonec] = useState("");

    const phoneCheck = (phone) => {
        if(phone.match(phoneRegEx)===null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setPhonec("형식에 맞게 다시 입력해주세요");
            return;
        }else{ // 맞을 경우 출력
            setPhonec("올바르게 입력되었습니다");
        }
    }

    useEffect(()=>{
        phoneCheck(phone);
        if (phone.length === 10) {
            setPhone(phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
          }
          if (phone.length === 13) {
            setPhone(phone.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
          }
    },[phone])

     // 휴대폰 인증번호 발송
     const [phone_publicc, setPhone_publicc] = useState("");
     const [phone_publicch, setPhone_publicch] = useState(false);
 
     function sendPhone(){
         axios.post("http://localhost:3000/phoneAuth", null, { params:{ "phone":phone }})
         .then(function(resp){
             setPhone_publicc("");
             setPhone_publiccheck("");
             alert("인증번호를 보냈습니다");
             setPhone_publicch(false);
             if(resp.data !== null){
                 setPhone_publicc(resp.data); 
                 setPhone_publicch(true);
             }else{
                 alert("휴대폰 번호를 확인해주세요");
             }
         })
         .catch(function(err){
             alert("err");
         })
     }

     // 휴대폰 인증번호 체크
    const [phone_publiccheck, setPhone_publiccheck] = useState("");

    function sendphonecheck(){
        if(phone_publicc.toString().trim() !== phone_public.toString().trim()){
            setPhone_publiccheck("인증 번호를 확인해주세요");
        }else{
            setPhone_publiccheck("인증 완료되었습니다");
            setPhone_publicch(false);
        }
    }

    // 휴대폰 번호 변경시 재인증 필요
    useEffect(()=>{
        setPhone_publiccheck("");
    },[phone])

    // 아이디 찾기 함수
    const [namea, setNamea] = useState(true);
    const [phonea, setPhonea] = useState(true);
    const [phone_publica, setPhone_publica] = useState(true);

    const [findid, setFindid] = useState("");
    const [regidate, setRegidate] = useState("");
    const [findida, setFindida] = useState(false);
    const [findidtext, setFindidtext] = useState("아이디를 찾지 못했습니다");

    function idsearchbtn(){

        // 유효검사
        setNamea(true);
        setPhonea(true); 
        setPhone_publica(true);

        if(namec !== "입력되었습니다"){
            setNamea(false);
            alert("이름을 입력해주세요");
            return;
        }else if(phonec !== "올바르게 입력되었습니다"){
            setPhonea(false);
            alert("휴대폰 번호를 입력해주세요");
            return;
        }else if(phone_publiccheck !== "인증 완료되었습니다" ){
            setPhone_publica(false);
            alert("인증번호를 입력해주세요");
            return;
        }
    
        axios.post("http://localhost:3000/idsearch", null, { params:{ "name":name, "phone":phone }})
        .then(function(resp){
            console.log(resp.data);
            
            if(resp.data === null || resp.data === ""){
                alert("이름과 본인명의의 휴대폰 번호인지 확인해주세요");
            }else{
                console.log("id : " + resp.data);
                setFindid(resp.data.id);
                setRegidate(resp.data.regidate);
                setFindida(true);
                setFindidtext(name + "님의 아이디가 확인되었습니다")
            }
        })
        .catch(function(err){
            alert("이름과 본인명의의 휴대폰 번호인지 확인해주세요");
        })
    }

    return(
        <div>

            <h1>아이디찾기</h1>
            <br/><br/><br/>
            <table border="1" align="center">
                <colgroup>
                    <col width="150"/><col width="150"/>
                </colgroup>
                <tr>
                    <td style={{backgroundColor:"grey"}}>
                        아이디찾기
                    </td>
                    <td>
                        <label for="passwordsearch">비밀번호찾기</label>
                    </td>
                </tr>
            </table>
            <br/><br/>
            <table border="1" align="center">
                <colgroup>
                    <col width="100"/><col width="250"/><col width="150"/>
                </colgroup>
                <tr>
                    <td align="left">이름</td> 
                    <td align="left">
                        {namea === true 
                            ? <input style={{ width:"230px"}} value={name} onChange={(e)=>setName(e.target.value)} placeholder="이름을 입력해주세요" />
                            : <input style={{ borderColor:"red", width:"230px"}} value={name} onChange={(e)=>setName(e.target.value)} placeholder="이름을 입력해주세요" />}
                    
                    </td>
                    <td>
                        { namec === "입력되었습니다" 
                            ? <div style={{ fontSize:"5px", color:'blue' }}>{namec}</div>
                            : <div style={{ fontSize:"5px", color:'red' }}>{namec}</div>}
                    </td>
                </tr>
                <tr>
                    <td align="left">핸드폰</td>
                    <td align="left">
                    {phonea === true 
                            ?  <input style={{ width:"230px"}} value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="휴대폰 번호를 입력해주세요" />
                            :  <input style={{ borderColor:"red", width:"230px"}} value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="휴대폰 번호를 입력해주세요" />}
                
                    </td>
                    <td>
                    { phonec === "올바르게 입력되었습니다" 
                        ? <div style={{ fontSize:"5px", color:'blue' }}>{phonec}<button onClick={sendPhone}>인증번호 발송</button></div>
                        
                        : <div style={{ fontSize:"5px", color:'red' }}>{phonec}<button disabled="false" onClick={sendPhone}>인증번호 발송</button></div>}
                    
                    </td>
                </tr>
                <tr>
                <td align="left">인증번호</td> 
                <td align="left">
                    {phone_publica === true 
                            ?  <input style={{ width:"230px"}}  value={phone_public} onChange={(e)=>setPhone_public(e.target.value)} placeholder="인증번호를 입력해주세요" />
                            :  <input style={{ borderColor:"red", width:"230px"}}  value={phone_public} onChange={(e)=>setPhone_public(e.target.value)} placeholder="인증번호를 입력해주세요" />}
                </td>
                <td>
                    { phone_publiccheck === "인증 완료되었습니다" 
                        ? <div style={{ fontSize:"5px", color:'blue' }}>{phone_publiccheck}</div>
                        
                        : <div style={{ fontSize:"5px", color:'red' }}>{phone_publiccheck}</div>}
                    { phone_publicch === true 
                        ? <div><button onClick={sendphonecheck}>인증하기</button></div>
                        
                        : <div><button disabled="false" onClick={sendphonecheck}>인증하기</button></div>}
                    
                </td>
                </tr>
            </table>
            <br/><br/><br/>
            { findida === true
                ? <div><input value= {findidtext} style={{ width:"230px"}}  />
                <br/><br/>
                <table border="1" align="center">
                    <colgroup>
                        <col width="120"/><col width="200"/>
                    </colgroup>
                    <tr>
                        <td>id</td><td>가입일</td>
                    </tr>
                    <tr>
                        <td>{findid}</td><td>{regidate}</td>
                    </tr>
                </table>
                </div>
                :<table>
                <tr></tr>
                </table>
            }
            
            <br/><br/>
            <button id="passwordsearch" onClick={passwordsearch} style={{display:"none"}}></button>
            { findida === true
                ?<button style={{display:"none"}} onClick={idsearchbtn}>아이디 찾기</button>
                :<button onClick={idsearchbtn}>아이디 찾기</button>}
                &nbsp;
            <button onClick={login}>로그인 화면으로</button>
            
        </div>
    )

}

export default Idsearch;
