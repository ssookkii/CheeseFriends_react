import React, { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Session from "react-session-api";

import axios from "axios";
import Modal from "../login/modal";
import Post from "../login/Post";


function Changeme(){

    let history = useNavigate();

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

    const [id, setId] = useState("");
    const [idc, setIdc] = useState("");
    const [password, setPassword] = useState(login.password);
    const [name, setName] = useState(login.name);
    const [gender, setGender] = useState("man");
    const [email, setEmail] = useState(login.email);
    const [birth, setBirth] = useState(login.birth);
    const [address, setAddress] = useState(login.address);
    const [facereceive, setFacereceive] = useState("http://localhost:3000/upload/" + login.id + ".jpg")
    const [facename, setFacename] = useState(login.id + ".jpg");
    const [phone, setPhone] = useState("");
    const [phone_public, setPhone_public] = useState("");
    const [jointype, setJointype] = useState("");
    const [auth, setAuth] = useState(login.auth);

    const [passwordcheck, setPasswordcheck] = useState("");

    // 주소 api
    const [enroll_company, setEnroll_company] = useState({ address:'', });
    const [popup, setPopup] = useState(false);

    const handleInput = (e) => {
        setEnroll_company({
            ...enroll_company,
            [e.target.name]:e.target.value,
        })
    }
    
    useEffect(()=>{
        console.log(photostart)
        enroll_company.address = login.address
    },[])

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
    const birthRegEx = /^([0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/
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

    // 휴대폰 번호 변경시 재인증 필요
    useEffect(()=>{
        setPhone_publiccheck("");
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
    const [photostart, setPhotostart] = useState(false);
    const videoRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [captured, setCaptured] = useState(false);
    const [mediaStream, setMediaStream] = useState(null);
    
    const startCapture = async () => {
        setPhotostart(true);
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


    const [namea, setNamea] = useState(true);
    const [passworda, setPassworda] = useState(true);
    const [passwordChecka, setPasswordchecka] = useState(true);
    const [emaila, setEmaila] = useState(true);
    const [birtha, setBirtha] = useState(true);
    const [addressa, setAddressa] = useState(true);
    const [photoa, setPhotoa] = useState(true);
    const [phonea, setPhonea] = useState(true);
    const [phone_publica, setPhone_publica] = useState(true);

    function change(){
        // 회원가입 유효검사
        setNamea(true);
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
        }else if(photostart === true && imageSrc === "" || photostart === true && imageSrc === null){
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
        axios.post("http://localhost:3000/changeuser", null, 
        { params:{  "id":id, 
                    "password":password, 
                    "name": name, 
                    "gender":gender,
                    "email":email,
                    "address":address,
                    "facename": facename,
                    "phone": phone,
                    "auth":auth
                }})
        .then(function(resp){
            // 사진저장
            if(photostart === true){
                const formData = new FormData();
                formData.append('uploadFile', imageSrc, id + ".jpg");
            
                fetch('http://localhost:3000/fileUpload', {
                method: 'POST',
                body: formData,
                })
                // .then((response) => response.json())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
            }
        })
        .catch(function(err){
            alert("err");
            console.log(err);
        })

        alert("정상적으로 변경되었습니다");
        history("/testmain");   
    }
        

    return(
        <div>
            {/* // Login css 세트 1 */}
            <div style={{textAlign:"center", alignItems:"center"}}>
                    
                    <div class="container2">
                    
                        <div class="login-content2">
                        
                            {/* 이름 입력칸 */}
                            <h5 class="regitag">이름</h5>
                            {namea === true
                                    ? <input class="regiinput" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력해주세요" />
                                    : <input class="regiinput" style={{ borderColor: "red" }} value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력해주세요" />}
                            {namea === true 
                                ?<div></div>
                                :<div>{ namec === "입력되었습니다" 
                                    ? <div><div class="inputtrue" >{namec}</div></div>
                                    : <div><div class="inputfalse" >{namec}</div></div>} 
                            </div>}
                            <br/>

                            {/* 성별 선택 */}
                            <h5 class="regitag">성별</h5>
                            <div>
                                <select class="regiinput" onChange={genderChange}>
                                    <option value="">성별을 선택해주세요</option>
                                    <option value="man" selected={gender === 'man'} >남자</option>
                                    <option value="woman" selected={gender === 'woman'}>여자</option>
                                </select>
                            </div>
                            <br/>
                            
                            {/* 아이디 입력칸 */}
                            <h5 class="regitag">아이디</h5>
                            <div>{id}</div>
                          
                            <br/>
                            
                            {/* 비밀번호 입력칸 */}
                            <h5 class="regitag">비밀번호</h5>
                            {passworda === true
                                    ? <input type="password" class="regiinput" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="숫자,영문자,특수문자 포함 8자 이상" />
                                    : <input type="password" class="regiinput" style={{ borderColor: "red"}} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="숫자,영문자,특수문자 포함 8자 이상" />}
                            {password.length > 0
                            ?<div> 
                                {passwordc === "안전한 비밀번호 입니다"
                                ? <div style={{ fontSize: "5px", color: 'blue' }}>{passwordc}</div>
                                : <div style={{ fontSize: "5px", color: 'red' }}>{passwordc}</div>}</div>
                            :<div></div>}
                            <br/>
                            
                            {/* 비밀번호 확인 입력칸 */}
                            <h5 class="regitag">비밀번호 확인</h5>
                            {passwordChecka === true
                                ? <input type="password" class="regiinput" value={passwordcheck} onChange={(e) => setPasswordcheck(e.target.value)} placeholder="위와 동일한 비밀번호 입력" />
                                : <input type="password" class="regiinput" style={{ borderColor: "red"}} value={passwordcheck} onChange={(e) => setPasswordcheck(e.target.value)} placeholder="위와 동일한 비밀번호 입력" />}
                            {passwordcheck.length > 0
                            ?<div> 
                                {passwordcheckc === "비밀번호가 동일합니다"
                                ? <div style={{ fontSize: "5px", color: 'blue' }}>{passwordcheckc}</div>
                                : <div style={{ fontSize: "5px", color: 'red' }}>{passwordcheckc}</div>}</div>
                            :<div></div>}
                            <br/>

                            {/* 비밀번호 확인 입력칸 */}
                            <h5 class="regitag">이메일 주소</h5>
                            {emaila === true
                                ? <input class="regiinput"  value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일 주소를 입력해주세요" />
                                : <input class="regiinput" style={{ borderColor: "red"}} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일 주소를 입력해주세요" />}
                            {email.length>0
                            ?<div> 
                                {emailc === "형식에 맞는 이메일입니다"
                                ? <div style={{ fontSize: "5px", color: 'blue' }}>{emailc}</div>
                                : <div style={{ fontSize: "5px", color: 'red' }}>{emailc}</div>}</div>
                            :<div></div>}
                            <br/>
                            
                            {/* 생년월일 입력칸 */}
                            <h5 class="regitag">생년월일</h5>
                            {birtha === true
                                ? <input class="regiinput" value={birth} onChange={(e) => setBirth(e.target.value)} placeholder="주민번호 앞자리 6자로 입력해주세요" />
                                : <input class="regiinput" style={{ borderColor: "red" }} value={birth} onChange={(e) => setBirth(e.target.value)} placeholder="주민번호 앞자리 6자로 입력해주세요" />}
                            {birth.length>0
                            ?<div> 
                                {birthc === "올바르게 입력되었습니다"
                                ? <div style={{ fontSize: "5px", color: 'blue' }}>{birthc}</div>
                                : <div style={{ fontSize: "5px", color: 'red' }}>{birthc}</div>}</div>
                            :<div></div>}
                            <br/>
                        
                            {/* 주소 입력칸 */}
                            <h5 class="regitag">주소</h5>
                            {addressa === true
                                ? <input class="regiinput" placeholder="주소검색을 클릭해주세요" type="text" required={true}  value={enroll_company.address} />
                                : <input class="regiinput" style={{ borderColor: "red"}}  placeholder="주소검색을 클릭해주세요" type="text" required={true} value={enroll_company.address} />}
                            <br/>
                            <div>
                                <React.Fragment>
                                    <button class="regibtn" onClick={openModal}>주소검색</button>
                                    <Modal open={modalOpen} close={closeModal} header="주소검색 ">
                                        <main>
                                            <br />
                                            <Post onClose={setPopup} setModalClose={setModalOpen} company={enroll_company} setcompany={setEnroll_company}></Post>
                                        </main>

                                    </Modal>
                                </React.Fragment>
                            </div>
                            <br/><br/>
                            
                            {/* 사진 찍는칸 */}
                            <h5 class="regitag">사진</h5>
                            <div>
                                {photoa === true
                                    ? <button class="photobtn" onClick={startCapture}>카메라 열기</button>
                                    : <button class="photobtn" style={{ borderColor: 'red' }} onClick={startCapture}>카메라 열기</button>}
                                &nbsp;&nbsp;
                                <button class="photobtn" onClick={captureImage} disabled={!mediaStream}>
                                    사진 찍기
                                </button>
                                <div style={{ display: captured ? 'none' : 'block' }}>
                                    <video ref={videoRef} autoPlay width={300} height={260} />
                                </div>
                                {captured && (
                                    <div style={{ display: captured ? 'block' : 'none' }}>
                                        <img src={URL.createObjectURL(imageSrc)} alt="captured image" width={300} height={220} />
                                    </div>
                                )}
                            </div>
                            <br/>
                        
                            {/* 휴대폰 번호 입력칸 */}
                            <h5 class="regitag">번호</h5>
                            {phonea === true
                                ? <input class="regiinput" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="휴대폰 번호를 입력해주세요" />
                                : <input class="regiinput" style={{ borderColor: "red" }} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="휴대폰 번호를 입력해주세요" />}
                        
                            {phone.length > 0
                            ?<div> 
                                {phonec === "올바르게 입력되었습니다"
                                    ?<div style={{ fontSize: "5px", color: 'blue' }}>{phonec}</div>
                                    :<div style={{ fontSize: "5px", color: 'red' }}>{phonec}</div>}
                            </div>
                            :<div></div>}
                            <br/>
                            {phonec === "올바르게 입력되었습니다"
                            ?<button class="regibtn" onClick={sendPhone}>인증번호 발송</button>
                            :<button class="regibtnfalse" disabled="false" onClick={sendPhone}>인증번호 발송</button>}
                            <br/><br/>
                            
                            {/* 휴대폰 인증 번호 입력칸 */}
                            <h5 class="regitag">인증번호</h5>
                            {phone_publica === true
                                ? <input class="regiinput" value={phone_public} onChange={(e) => setPhone_public(e.target.value)} placeholder="인증번호를 입력해주세요" />
                                : <input class="regiinput" style={{ borderColor: "red"}} value={phone_public} onChange={(e) => setPhone_public(e.target.value)} placeholder="인증번호를 입력해주세요" />}
                            
                            {phone_publiccheck === "인증 완료되었습니다"
                                ? <div style={{ fontSize: "5px", color: 'blue' }}>{phone_publiccheck}</div>
                                : <div style={{ fontSize: "5px", color: 'red' }}>{phone_publiccheck}</div>}
                            <br/>
                            {phone_publicch === true
                                ? <div><button class="regibtn" onClick={sendphonecheck}>인증하기</button></div>
                                : <div><button class="regibtn" disabled="false" onClick={sendphonecheck}>인증하기</button></div>}
                            <br/><br/><br/>

                         
                        
                        
                        </div>
                    </div>
            </div>


            <h1>개인정보변경</h1>
            <br/><br/>
            <table border="1" align="center">
            <colgroup>
                <col width="120"/><col width="350" /><col width="200" />
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
                <td align="left">아이디</td> 
                <td align="left">
                    <div>{id}</div>
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
                    <div>{birth}</div>
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
            {photostart === true
            ?<tr>
                <td align="left">사진</td> 
                    <div>
                        <div>photostart true</div>
                        {photoa === true 
                        ?  <button onClick={startCapture}>카메라 열기</button>
                        :  <button style={{ borderColor:'red' }} onClick={startCapture}>카메라 열기</button>}
                        <button onClick={captureImage} disabled={!mediaStream}>
                            사진 찍기
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
            : 
                <tr>
                <td align="left">사진</td> 
                    <div>
                    {/* style={{ backgroundColor:'red' }} */}
                        <div align="left">
                            <table>
                                <tr>
                                    <td>
                                        <img src={facereceive} width="100" height="100"/>
                                    </td>
                                    <td>
                                        <button onClick={startCapture}>변경하기</button>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        
                    </div>
                <td align="left">
                </td>
                </tr>
            }
            
  
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
            <button onClick={change}>저장</button>
            
            
        </div>
    )

}

export default Changeme;
