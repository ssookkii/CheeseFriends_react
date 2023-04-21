import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Modal from "./modal";
import Post from "./Post";

function Regiteacher(){
    function regiselect(){
        window.location.href = "/regiselect";
    }

    const [id, setId] = useState('');
    const [idc, setIdc] = useState("");
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [gender, setGender] = useState("man");
    const [email, setEmail] = useState('');
    const [birth, setBirth] = useState("");
    const [address, setAddress] = useState("");
    const [facename, setFacename] = useState("");
    const [phone, setPhone] = useState("");
    const [phone_public, setPhone_public] = useState("");
    const [jointype, setJointype] = useState("");
    const [auth, setAuth] = useState('teacher');

    const [edu_code, setEdu_code] = useState("");
    const [edu_name, setEdu_name] = useState("");
    const [educheck, setEducheck] = useState(false);

    const [passwordcheck, setPasswordcheck] = useState("");

    // 주소 api
    const [enroll_company, setEnroll_company] = useState({ address:'', });
    const [popup, setPopup] = useState(false);

    // 모달 팝업
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

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
    

    function genderChange(e){
        setGender(e.target.value);
    }

    
   

    // 교육기관 이름 서치
    function educodecheck(){
        setEducheck(false);

        if(edu_name.length > 4){
            axios.get("http://localhost:3000/edusearch", { params:{ "edu_name":edu_name}})
            .then(function(resp){

                const table = document.getElementById("subplus2");
               
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }

                const colgroup = document.createElement("colgroup");
                
                let col = document.createElement("col");
                col.setAttribute("width", "50");
                colgroup.appendChild(col);

                let col2 = document.createElement("col");
                col2.setAttribute("width", "50");
                colgroup.appendChild(col2);

                let col3 = document.createElement("col");
                col3.setAttribute("width", "200");
                colgroup.appendChild(col3);

                let col4 = document.createElement("col");
                col4.setAttribute("width", "100");
                colgroup.appendChild(col4);

                table.appendChild(colgroup);
              
                
                const thead = document.createElement("tr");

                let th = document.createElement("th");
                th.innerText = "선택";
                thead.appendChild(th);

                let th2 = document.createElement("th");
                th2.innerText = "번호";
                thead.appendChild(th2);

                let th3 = document.createElement("th");
                th3.innerText = "교육기관명";
                thead.appendChild(th3);
                
                let th4 = document.createElement("th");
                th4.innerText = "코드";
                thead.appendChild(th4);

                const root = createRoot(document.getElementById("subplus2"));

                
                table.appendChild(thead);


                for (let i = 0; i < resp.data.length; i++) {

                    const subplus = document.createElement("tr");

                   


                    // // 체크박스
                    let td = document.createElement("td");
                    let element0 = document.createElement("input");
        
                    element0.setAttribute("type", "radio");
                    element0.setAttribute("value", resp.data[i].eduCode);
                    const checkBoxId= resp.data[i].eduCode;
                   
           
                    // element0.onclick = edunameadd; //function(){alert('subcodeadd');};
                    
                    td.append(element0)
                    subplus.appendChild(td);
        

        
                    // 번호
                    let element = document.createElement("td");
                    element.innerText = i+1;
                    subplus.appendChild(element);
        
                    // 교육기관명
                    let element2 = document.createElement("td");
                    element2.innerText = resp.data[i].eduName;
                    subplus.appendChild(element2);

                    let element3 = document.createElement("td");
                    element3.innerText = resp.data[i].eduCode;
                    subplus.appendChild(element3);

                    table.appendChild(subplus);
                }  

             

            })
            .catch(function(err){
                alert(err);
            })
        }
    }

    useEffect(()=>{
           educodecheck(edu_name);        
   }, [edu_name]) 


    // 아이디 정규식
    const idRegEx = /^[a-zA-z0-9]{6,12}$/

    const idregCheck = (id) => {
        if(id.match(idRegEx)===null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setIdc("아이디 형식을 확인해주세요");
            return;
        }else{ // 맞을 경우 출력
            axios.post("http://localhost:3000/idcheck", null, { params:{ "id":id}})
            .then(function(resp){
                if(resp.data === "YES"){
                    setIdc("이 아이디는 사용할 수 있습니다");
                }else{
                    setIdc("사용중인 아이디입니다");
                }
            })
            .catch(function(err){
                alert('err')
            })
        }
    }

    useEffect(()=>{
           idregCheck(id);        
   }, [id]) 


    // 비밀번호 정규식
    const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/
    const [passwordc, setPasswordc] = useState("");

    const passwordCheck = (password) => {
        if(password.match(passwordRegEx)===null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setPasswordc("비밀번호 형식을 확인해주세요");
            return;
        }else{ // 맞을 경우 출력
            setPasswordc("안전한 비밀번호 입니다");
        }
    }

    useEffect(()=>{
        passwordCheck(password);
    },[password])
    

    // 비밀번호 확인 체크
    const [passwordcheckc, setPasswordcheckc] = useState("");

    const passwordDoubleCheck = (password, passwordcheck) => {
            if(password !== passwordcheck){
                setPasswordcheckc("비밀번호가 다릅니다");
                return;
            }else{
                setPasswordcheckc("비밀번호가 동일합니다");
            }
    }

    useEffect(()=>{
        passwordDoubleCheck(password, passwordcheck);
    },[password, passwordcheck])


    // 이메일 정규식
    const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
    const [emailc, setEmailc] = useState("");

    const emailCheck = (email) => {
        if(email.match(emailRegEx)===null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setEmailc("이메일 형식을 확인해주세요");
            return;
        }else{ // 맞을 경우 출력
            setEmailc("형식에 맞는 이메일입니다");
        }
    }

    useEffect(()=>{
        emailCheck(email);
    },[email])

    
    // 생년월일 정규식
    const birthRegEx = /([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))/
    const [birthc, setBirthc] = useState("");

    const birthCheck = (birth) => {
        if(birth.match(birthRegEx)===null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setBirthc("형식에 맞게 다시 입력해주세요");
            return;
        }else{ // 맞을 경우 출력
            setBirthc("올바르게 입력되었습니다");
        }
    }

    useEffect(()=>{
        birthCheck(birth);
    },[birth])

    // 주소 적용
    useEffect(()=>{
        setAddress(enroll_company.address);
    },[enroll_company.address])


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

    // 사진 캡쳐 api
    const videoRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [captured, setCaptured] = useState(false);
    const [mediaStream, setMediaStream] = useState(null);
    
    const startCapture = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setMediaStream(stream);
        setCaptured(false);
    };
    
    const captureImage = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 350; // 캡쳐 크기
        canvas.height = 250;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0, 350, 250);
        canvas.toBlob((blob) => {
        setImageSrc(blob);
        setCaptured(true);
        mediaStream.getTracks()[0].stop(); // 미디어 스트림 중지
        }, 'image/png');
        setFacename(id + ".jpg");
    };
    
    const saveImage = () => {
        const formData = new FormData();
        formData.append('uploadFile', imageSrc, id + ".jpg");
    
        fetch('http://localhost:3000/fileUpload', {
        method: 'POST',
        body: formData,
        })
        // .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    };


    let history = useNavigate();

    function idChange(e){
        setId(e.target.value);
    }



    const [namea, setNamea] = useState(true);
    const [codea, setCodea] = useState(true);
    const [ida, setIda] = useState(true);
    const [passworda, setPassworda] = useState(true);
    const [passwordChecka, setPasswordchecka] = useState(true);
    const [emaila, setEmaila] = useState(true);
    const [birtha, setBirtha] = useState(true);
    const [addressa, setAddressa] = useState(true);
    const [photoa, setPhotoa] = useState(true);
    const [phonea, setPhonea] = useState(true);
    const [phone_publica, setPhone_publica] = useState(true);

    function account(){
        // 회원가입 유효검사
        setNamea(true);
        setCodea(true);
        setIda(true);
        setPassworda(true);
        setPasswordchecka(true);
        setEmaila(true);
        setBirtha(true);
        setAddressa(true); 
        setPhotoa(true);
        setPhonea(true); 
        setPhone_publica(true);

        if(namec !== "입력되었습니다"){
            setNamea(false);
            alert("이름을 입력해주세요");
            return;
        // }else if(){
        //     setCodea(false);
        //     alert("코드입력후 과목을 추가 및 선택해주세요");
        //     return;
        }else if(idc !== "이 아이디는 사용할 수 있습니다"){
            setIda(false);
            alert("아이디를 입력해주세요");
            return;
        }else if(passwordc !== "안전한 비밀번호 입니다" ){
            setPassworda(false);
            alert("비밀번호를 입력해주세요");
            return;
        }else if(passwordcheckc !== "비밀번호가 동일합니다"){
            setPasswordchecka(false);
            alert("동일한 비밀번호를 입력해주세요");
            return;
        }else if(emailc !== "형식에 맞는 이메일입니다" ){
            setEmaila(false);
            alert("이메일을 입력해주세요");
            return;
        }else if(birthc !== "올바르게 입력되었습니다" ){
            setBirtha(false);
            alert("생년월일을 입력해주세요");
            return;
        }else if(address === ""){
            setAddressa(false);
            alert("주소를 입력해주세요");
            return;
        }else if(imageSrc === "" || imageSrc === null){
            setPhotoa(false);
            alert("사진을 찍어주세요");
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

        

        // 보내자
        axios.post("http://localhost:3000/adduser", null, 
        { params:{  "id":id, 
                    "password":password, 
                    "name": name, 
                    "gender":gender,
                    "email":email,
                    "birth":birth,
                    "address":address,
                    "facename": id + ".jpg",
                    "phone": phone,
                    "auth":auth
                }})
        .then(function(resp){
           
        })
        .catch(function(err){
            alert("err");
            console.log(err);
        })
    }
        

    

    return(
        <div>
            <h3>회원가입</h3>

            <table border="1" align="center">
            <colgroup>
                <col width="120"/><col width="250" /><col width="200" />
            </colgroup>
            <tbody>
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
                <td align="left">성별</td> 
                <td align="left">
                    <input type="radio" value="man" onChange={genderChange} checked={gender === 'man'}/>남
                     &nbsp;
                    <input type="radio" value="woman" onChange={genderChange} checked={gender === 'woman'}/>여
                </td>
            </tr>
            <tr>
                <td align="left">교육기관 코드</td> 
                <td align="left">
                {namea === true 
                        ? <input style={{ width:"230px"}} value={edu_name} onChange={(e)=>setEdu_name(e.target.value)} placeholder="교육기관 명을 입력해주세요" />
                        : <input style={{  borderColor:"red", width:"230px"}} value={edu_name} onChange={(e)=>setEdu_name(e.target.value)} placeholder="교육기관 명을 입력해주세요" />}
                    
                </td>
                
            </tr>
            <tr>
                <td align="left">
                    <div >교육기관명</div>
                </td>
                <td align="left">
                    <table border="1" className="subplus2" id="subplus2">
                        <colgroup>
                            <col width="50" /><col width="50" /><col width="200" /><col width="100" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>선택</th><th>번호</th><th>교육기관명</th><th>코드</th>
                            </tr>
                        </thead>
                    </table>
                </td>
            </tr>
         
            <tr>
                <td align="left">아이디</td> 
                <td align="left">
                    {ida === true 
                        ? <input style={{ width:"230px"}} value={id} onChange={idChange} placeholder="영문자와 숫자로 6자 이상" />
                        : <input style={{ borderColor:"red", width:"230px"}} value={id} onChange={idChange} placeholder="영문자와 숫자로 6자 이상" />}
                </td>
                <td>
                    { idc === "이 아이디는 사용할 수 있습니다" 
                        ? <div style={{ fontSize:"5px", color:'blue' }}>{idc}</div>
                        : <div style={{ fontSize:"5px", color:'red' }}>{idc}</div>}
                    
                {/* <button onClick={idcheck}>아이디 체크</button> */}
                </td>
            </tr>
            <tr>
                <td align="left">비밀번호</td> 
                <td align="left">
                    {passworda === true 
                        ? <input style={{ width:"230px"}} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="숫자,영문자,특수문자 포함 8자 이상" />
                        : <input style={{ borderColor:"red", width:"230px"}} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="숫자,영문자,특수문자 포함 8자 이상" />}
                </td>
                <td>
                    { passwordc === "안전한 비밀번호 입니다" 
                        ? <div style={{ fontSize:"5px", color:'blue' }}>{passwordc}</div>
                        : <div style={{ fontSize:"5px", color:'red' }}>{passwordc}</div>}
                </td>
            </tr>
            <tr>
                <td align="left">비밀번호 확인</td> 
                <td align="left">
                    {passwordChecka === true 
                        ?  <input style={{ width:"230px"}} value={passwordcheck} onChange={(e)=>setPasswordcheck(e.target.value)} placeholder="위와 동일한 비밀번호 입력" />
                        :  <input style={{ borderColor:"red", width:"230px"}} value={passwordcheck} onChange={(e)=>setPasswordcheck(e.target.value)} placeholder="위와 동일한 비밀번호 입력" />}
                </td>
                <td>
                    { passwordcheckc === "비밀번호가 동일합니다" 
                        ? <div style={{ fontSize:"5px", color:'blue' }}>{passwordcheckc}</div>
                        : <div style={{ fontSize:"5px", color:'red' }}>{passwordcheckc}</div>}
                </td>
            </tr>
            <tr>
                <td align="left">이메일 주소</td> 
                <td align="left">
                    {emaila === true 
                        ?  <input style={{ width:"230px"}} value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="이메일 주소를 입력해주세요" />
                        :  <input style={{ borderColor:"red", width:"230px"}} value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="이메일 주소를 입력해주세요" />}
                </td>
                <td>
                    { emailc === "형식에 맞는 이메일입니다" 
                        ? <div style={{ fontSize:"5px", color:'blue' }}>{emailc}</div>
                        : <div style={{ fontSize:"5px", color:'red' }}>{emailc}</div>}
                </td>
            </tr>
            <tr>
                <td align="left">생년월일</td> 
                <td align="left">
                    {birtha === true 
                        ?  <input style={{width:"230px"}}  value={birth} onChange={(e)=>setBirth(e.target.value)} placeholder="주민번호 앞자리 6자로 입력해주세요" />
                        :  <input style={{borderColor:"red", width:"230px"}}  value={birth} onChange={(e)=>setBirth(e.target.value)} placeholder="주민번호 앞자리 6자로 입력해주세요" />}
                </td>
                <td>
                    { birthc === "올바르게 입력되었습니다" 
                        ? <div style={{ fontSize:"5px", color:'blue' }}>{birthc}</div>
                        : <div style={{ fontSize:"5px", color:'red' }}>{birthc}</div>}
                </td>
            </tr>
            <tr>
                <td align="left">주소</td> 
                <td align="left">
                    {addressa === true 
                        ?  <input style={{ width:"230px"}} className="user_enroll_text" placeholder="주소검색을 클릭해주세요"  type="text" required={true} name="address" value={enroll_company.address}/>
                        :  <input style={{ borderColor:"red", width:"230px"}} className="user_enroll_text" placeholder="주소검색을 클릭해주세요"  type="text" required={true} name="address" value={enroll_company.address}/>}
                </td>
                <td>
                     <div>
                        <React.Fragment>
                        <button onClick={openModal}>주소검색</button>
                        <Modal open={modalOpen} close={closeModal} header="주소검색 ">
                        <main>  
                            <br/>
                            <Post onClose={setPopup} setModalClose={setModalOpen} company={enroll_company} setcompany={setEnroll_company}></Post> 
                        </main>
                        
                        </Modal>
                        </React.Fragment>
                    </div>
                </td>
            </tr>
            <tr>
                <td align="left">사진</td> 
                    <div>
                    {/* style={{ backgroundColor:'red' }} */}
                        {photoa === true 
                        ?  <button onClick={startCapture}>카메라 열기</button>
                        :  <button style={{ borderColor:'red' }} onClick={startCapture}>카메라 열기</button>}
                        <button onClick={captureImage} disabled={!mediaStream}>
                            사진 찍기
                        </button>
                        <button onClick={saveImage} disabled={!imageSrc}>
                            저장하기
                        </button>
                        <div style={{ display: captured ? 'none' : 'block' }}>
                            <video ref={videoRef} autoPlay width={350} height={250} />
                        </div>
                        {captured && (
                            <div style={{ display: captured ? 'block' : 'none' }}>
                            <img src={URL.createObjectURL(imageSrc)} alt="captured image" />
                            </div>
                        )}
                    </div>
                <td align="left">
                  
                </td>
            </tr>
            <tr>
                <td align="left">번호</td>
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

            </tbody>
            </table>

            <br/>
            <button onClick={regiselect}>가입유형선택</button>
                &nbsp;
            <button onClick={account}>회원가입</button>
        </div>
    )
}

export default Regiteacher;