import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Regi(){

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [gender, setGender] = useState('남');
    const [email, setEmail] = useState('');
    const [birth, setBirth] = useState("");
    const [address, setAddress] = useState("");
    const [facename, setFacename] = useState("");
    const [phone, setPhone] = useState("");
    const [phone_public, setPhone_public] = useState("");
    const [jointype, setJointype] = useState("");
    const [auth, setAuth] = useState('학생');

    const [groupcode, setGroupcode] = useState("");
    const [passwordcheck, setPasswordcheck] = useState("");

    function genderChange(e){
        setGender(e.target.value);
    }

    function authChange(e){
        setAuth(e.target.value);
    }

    let history = useNavigate();

    function idcheck(){
        // const resp = axios.post("http://localhost:3000/idcheck", null, { params:{ "id":id}});
        // console.log(resp.data);

        axios.post("http://localhost:3000/idcheck", null, { params:{ "id":id}})
        .then(function(resp){
            console.log(resp.data)
            if(resp.data === "YES"){
                alert("이 아이디는 사용할 수 있습니다");
            }else{
                alert("사용중인 아이디입니다");
                setId('');
            }
        })
        .catch(function(err){
            alert('err')
        })
    }

    function account(){
        axios.post("http://localhost:3000/addmember", null, { params:{ "id":id, "password":password, "name": name, "email":email}})
        .then(function(resp){
            if(resp.data === "YES"){
                alert("정상적으로 가입되었습니다");
                history("/");      // 이동(link)
            }else{
                alert("가입되지 않았습니다");
            }
        })
        .catch(function(err){
            alert("err");
        })

    }

    return(
        <div>
            <h3>회원가입</h3>

            <table border="1" align="center">
            <colgroup>
                <col width="120"/><col width="200" /><col width="100" />
            </colgroup>
            <tbody>
            <tr>
                <td align="left">이름</td> 
                <td align="left">
                <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="이름을 입력해주세요" />
                </td>
            </tr>
            <tr>
                <td align="left">성별</td> 
                <td align="left">
                    <input type="radio" value="남" onChange={genderChange} checked={gender === '남'}/>남
                     &nbsp;
                    <input type="radio" value="여" onChange={genderChange} checked={gender === '여'}/>여
                </td>
            </tr>
            <tr>
                <td align="left">가입유형</td> 
                <td align="left">
                    <input type="radio" value="학생" onChange={authChange} checked={auth === '학생'}/>학생
                    &nbsp;
                    <input type="radio" value="학부모" onChange={authChange} checked={auth === '학부모'}/>학부모
                    &nbsp;
                    <input type="radio" value="교사" onChange={authChange} checked={auth === '교사'}/>교사
                </td>
            </tr>
            <tr>
                <td align="left">코드</td> 
                <td align="left">
                    <input value={groupcode} onChange={(e)=>setGroupcode(e.target.value)} placeholder="코드를 입력해주세요" />
                </td>
            </tr>
            <tr>
                <td align="left">과목</td> 
                <td align="left">
                    <select>
                    </select>
                </td>
            </tr>
            <tr>
                <td align="left">아이디</td> 
                <td align="left">
                <input value={id} onChange={(e)=>setId(e.target.value)} placeholder="아이디를 입력해주세요" />
                </td>
            </tr>
            <tr>
                <td align="left">비밀번호</td> 
                <td align="left">
                <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="숫자,문자,특수문자 포함 8자 이상" />
                </td>
            </tr>
            <tr>
                <td align="left">비밀번호 확인</td> 
                <td align="left">
                <input value={passwordcheck} onChange={(e)=>setPasswordcheck(e.target.value)} placeholder="위와 동일한 비밀번호 입력" />
                </td>
            </tr>
            <tr>
                <td align="left">이메일 주소</td> 
                <td align="left">
                <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="이메일 주소를 입력해주세요" />
                </td>
            </tr>
            <tr>
                <td align="left">생년월일</td> 
                <td align="left">
                <input value={birth} onChange={(e)=>setBirth(e.target.value)} placeholder="생년월일을 입력해주세요" />
                </td>
            </tr>
            <tr>
                <td align="left">주소</td> 
                <td align="left">
                <input value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="주소를 입력해주세요" />
                </td>
            </tr>

            </tbody>
            </table>
            <button onClick={account}>회원가입</button>
        </div>
    )
}

export default Regi;