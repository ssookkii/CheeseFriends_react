import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Modal from "./modal";
import Post from "./Post";
import "./css/regi.css";

import logo from './img/cheesefriendslogo.png';

function Regi() {


    function regiselect() {
        window.location.href = "/regiselect";
    }

    const [id, setId] = useState('');
    const [idc, setIdc] = useState("");
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [birth, setBirth] = useState("");
    const [address, setAddress] = useState("");
    const [facename, setFacename] = useState("");
    const [phone, setPhone] = useState("");
    const [phone_public, setPhone_public] = useState("");
    const [auth, setAuth] = useState('student');

    const [edu_code, setEdu_code] = useState("");
    const [sub_code, setSub_code] = useState("");
    const [edu_name, setEdu_name] = useState("");
    const [educheck, setEducheck] = useState(false);

    const [passwordcheck, setPasswordcheck] = useState("");


    // 계정 연동
    const [joinid, setJoinid] = useState("");
    const [jointype, setJointype] = useState("");

    useEffect (()=>{
       

       let soc = localStorage.getItem("social");
       let social = JSON.parse(soc)

       let socialtype = localStorage.getItem("socialtype");

       if(socialtype === "kakao"){
           if(social !== undefined){

               setJoinid(social.id);
               setJointype(socialtype);

               if(social.gender === "female"){
                   setGender("woman");
               }else{
                   setGender("man");
               }

               if(social.email !== null && social.email !== "" && social.email !== undefined){
                   setEmail(social.email);
               }
           }
       }else if(socialtype === "google"){
           if(social !== undefined){

               setJoinid(social.sub);
               setJointype(socialtype);

               if(social.gender === "female"){
                   setGender("woman");
               }else{
                   setGender("man");
               }

               if(social.email !== null && social.email !== "" && social.email !== undefined){
                   setEmail(social.email);
               }
           }
       }else if(socialtype === "naver"){
           if(social !== undefined){

               setJoinid(social.id);
               setJointype(socialtype);

               if(social.gender !== "M"){
                   setGender("woman");
               }else{
                   setGender("man");
               }

               if(social.name !== null && social.name !== "" && social.name !== undefined ){
                   setName(social.name);
               }

               if(social.email !== null && social.email !== "" && social.email !== undefined){
                   setEmail(social.email);
               }
           }
       }else if(socialtype === "cheesefriends"){
           setJointype(socialtype);
       }

   },[]);



    // 주소 api
    const [enroll_company, setEnroll_company] = useState({ address: '', });
    const [popup, setPopup] = useState(false);

    const handleInput = (e) => {
        setEnroll_company({
            ...enroll_company,
            [e.target.name]: e.target.value,
        })
    }

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
        if (name.match(nameRegEx) === null) {
            setNamec("이름을 입력해주세요");
            return;
        } else {
            setNamec("입력되었습니다");
        }
    }

    useEffect(() => {
        namecheck(name);
    }, [name])


    function genderChange(e) {
        setGender(e.target.value);
    }

    function authChange(e) {
        setAuth(e.target.value);
    }

    // 교육기관 코드 체크
    function educodecheck() {
        setEducheck(false);

        axios.get("http://localhost:3000/subjectlist", { params: { "edu_code": edu_code } })
            .then(function (resp) {
                const subplus = document.getElementById("subplus");


                while (subplus.firstChild) {
                    subplus.removeChild(subplus.firstChild);
                }

                let element = document.createElement("option");
                element.innerText = "과목을 선택해주세요";
                element.setAttribute("value", "");
                subplus.appendChild(element);

                for (let i = 0; i < resp.data.length; i++) {
                    let element = document.createElement("option");
                    element.innerHTML = resp.data[i].subname;
                    element.setAttribute("value", resp.data[i].subcode);
                    subplus.appendChild(element);
                }

            })

            .catch(function (err) {
                alert('err')
            })

        axios.get("http://localhost:3000/eduname", { params: { "edu_code": edu_code } })
            .then(function (resp) {
                setEdu_name(resp.data);
            })
            .catch(function (err) {
                alert('err')

            })
    }

    useEffect(() => {
        educodecheck(edu_code);
    }, [edu_code])


    function subcodecheck(e) {
        setSub_code(e.target.value);
    }


    // 체크박스 관리 변수
    const [sub_codechecked, setSub_codechecked] = useState([]);

    // 체크박스 관리 함수
    const subcodeadd = (e) => {
        console.log("e.target.checked : " + e.target.checked);
        console.log("e.target.value : " + e.target.value);

        if (e.target.checked) {
            //   alert("과목 체크 추가");
            setSub_codechecked((sub_codechecked) => [...sub_codechecked, e.target.value])

            return;
        } else {
            //   alert("과목 체크 제거");
            setSub_codechecked((sub_codechecked) => sub_codechecked.filter((item) => item !== e.target.value));

            return;
        }
    }

    // 체크 배열 점검
    useEffect(() => {
        console.log(sub_codechecked);
    }, [sub_codechecked])


    // 추가된 과목 리스트 관리
    const [count, setCount] = useState(1);
    const [sub_codecheck, setSub_codecheck] = useState([]);

    function subjectadd() {
        // 과목 중복추가 체크
        if (sub_code === "" || sub_code === null) {
            alert("교육기관 코드 입력 후 과목을 선택해주세요")
            return;
        }

        for (let i = 0; i < sub_codecheck.length; i++) {
            if (sub_codecheck[i] === sub_code) {
                alert("이미 추가된 과목입니다")
                return;
            }
        }

        axios.get("http://localhost:3000/eduname", { params: { "edu_code": edu_code } })
            .then(function (resp) {
                const newItem = sub_code;
                setSub_codecheck([...sub_codecheck, newItem]);

                const table = document.getElementById("subplus2");
                const subplus = document.createElement("tr");

                // 체크박스
                let td = document.createElement("td");
                let element0 = document.createElement("input");

                element0.setAttribute("type", "checkbox");
                element0.setAttribute("name", "subject");
                element0.setAttribute("value", sub_code);
                element0.setAttribute("checked", "checked");
                //    element0.setAttribute("onchange", function(){alert('subcodeadd');});
                element0.onchange = subcodeadd; //function(){alert('subcodeadd');};

                td.append(element0)
                subplus.appendChild(td);

                setSub_codechecked((sub_codechecked) => [...sub_codechecked, sub_code])

                // 번호
                let element = document.createElement("td");
                element.innerText = count;
                setCount(count + 1);
                subplus.appendChild(element);

                // 교육기관
                let element2 = document.createElement("td");
                element2.innerText = resp.data;
                subplus.appendChild(element2);

                // 과목
                axios.get("http://localhost:3000/subname", { params: { "sub_code": sub_code } })
                    .then(function (resp) {
                        let element3 = document.createElement("td");
                        element3.innerText = resp.data;
                        element3.setAttribute("value", "");
                        subplus.appendChild(element3);
                    })
                    .catch(function (err) {
                        alert('err')
                    })

                table.appendChild(subplus);
            })
            .catch(function (err) {
                alert('err')
            })
    }


    // 아이디 정규식
    const idRegEx = /^[a-zA-z0-9]{6,12}$/

    const idregCheck = (id) => {
        if (id.match(idRegEx) === null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setIdc("아이디 형식을 확인해주세요");
            return;
        } else { // 맞을 경우 출력
            axios.post("http://localhost:3000/idcheck", null, { params: { "id": id } })
                .then(function (resp) {
                    if (resp.data === "YES") {
                        setIdc("이 아이디는 사용할 수 있습니다");
                    } else {
                        setIdc("사용중인 아이디입니다");
                    }
                })
                .catch(function (err) {
                    alert('err')
                })
        }
    }

    useEffect(() => {
        idregCheck(id);
    }, [id])


    // 비밀번호 정규식
    const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/
    const [passwordc, setPasswordc] = useState("");

    const passwordCheck = (password) => {
        if (password.match(passwordRegEx) === null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setPasswordc("비밀번호 형식을 확인해주세요");
            return;
        } else { // 맞을 경우 출력
            setPasswordc("안전한 비밀번호 입니다");
        }
    }

    useEffect(() => {
        passwordCheck(password);
    }, [password])


    // 비밀번호 확인 체크
    const [passwordcheckc, setPasswordcheckc] = useState("");

    const passwordDoubleCheck = (password, passwordcheck) => {
        if (password !== passwordcheck) {
            setPasswordcheckc("비밀번호가 다릅니다");
            return;
        } else {
            setPasswordcheckc("비밀번호가 동일합니다");
        }
    }

    useEffect(() => {
        passwordDoubleCheck(password, passwordcheck);
    }, [password, passwordcheck])


    // 이메일 정규식
    const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
    const [emailc, setEmailc] = useState("");

    const emailCheck = (email) => {
        if (email.match(emailRegEx) === null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setEmailc("이메일 형식을 확인해주세요");
            return;
        } else { // 맞을 경우 출력
            setEmailc("형식에 맞는 이메일입니다");
        }
    }

    useEffect(() => {
        emailCheck(email);
    }, [email])


    // 생년월일 정규식
    const birthRegEx = /^([0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/
    const [birthc, setBirthc] = useState("");

    const birthCheck = (birth) => {
        if (birth.match(birthRegEx) === null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setBirthc("형식에 맞게 다시 입력해주세요");
            return;
        } else { // 맞을 경우 출력
            setBirthc("올바르게 입력되었습니다");
        }
    }

    useEffect(() => {
        birthCheck(birth);
    }, [birth])

    // 주소 적용
    useEffect(() => {
        setAddress(enroll_company.address);
    }, [enroll_company.address])


    // 핸드폰 번호 정규식
    const phoneRegEx = /^01(?:0|1|[6-9])-(?:\d{4}|\d{4})-\d{4}$/
    const [phonec, setPhonec] = useState("");

    const phoneCheck = (phone) => {
        if (phone.match(phoneRegEx) === null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setPhonec("형식에 맞게 다시 입력해주세요");
            return;
        } else { // 맞을 경우 출력
            setPhonec("올바르게 입력되었습니다");
        }
    }

    useEffect(() => {
        phoneCheck(phone);
        if (phone.length === 10) {
            setPhone(phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
        }
        if (phone.length === 13) {
            setPhone(phone.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
        }
    }, [phone])


    // 휴대폰 인증번호 발송
    const [phone_publicc, setPhone_publicc] = useState("");
    const [phone_publicch, setPhone_publicch] = useState(false);

    function sendPhone() {
        axios.post("http://localhost:3000/phoneAuth", null, { params: { "phone": phone } })
            .then(function (resp) {
                setPhone_publicc("");
                setPhone_publiccheck("");
                alert("인증번호를 보냈습니다");
                setPhone_publicch(false);
                if (resp.data !== null) {
                    setPhone_publicc(resp.data);
                    setPhone_publicch(true);
                } else {
                    alert("휴대폰 번호를 확인해주세요");
                }
            })
            .catch(function (err) {
                alert("err");
            })
    }

    // 휴대폰 인증번호 체크
    const [phone_publiccheck, setPhone_publiccheck] = useState("");

    function sendphonecheck() {
        if (phone_publicc.toString().trim() !== phone_public.toString().trim()) {
            setPhone_publiccheck("인증 번호를 확인해주세요");
        } else {
            setPhone_publiccheck("인증 완료되었습니다");
            setPhone_publicch(false);
        }
    }

    // 휴대폰 번호 변경시 재인증 필요
    useEffect(() => {
        setPhone_publiccheck("");
    }, [phone])

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


    let history = useNavigate();

    function idChange(e) {
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

    function account() {
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

        if (namec !== "입력되었습니다") {
            setNamea(false);
            alert("이름을 입력해주세요");
            return;
        } else if (sub_codechecked.length === 0) {
            setCodea(false);
            alert("코드입력후 과목을 추가 및 선택해주세요");
            return;
        } else if (idc !== "이 아이디는 사용할 수 있습니다") {
            setIda(false);
            alert("아이디를 입력해주세요");
            return;
        } else if (passwordc !== "안전한 비밀번호 입니다") {
            setPassworda(false);
            alert("비밀번호를 입력해주세요");
            return;
        } else if (passwordcheckc !== "비밀번호가 동일합니다") {
            setPasswordchecka(false);
            alert("동일한 비밀번호를 입력해주세요");
            return;
        } else if (emailc !== "형식에 맞는 이메일입니다") {
            setEmaila(false);
            alert("이메일을 입력해주세요");
            return;
        } else if (birthc !== "올바르게 입력되었습니다") {
            setBirtha(false);
            alert("생년월일을 입력해주세요");
            return;
        } else if (address === "") {
            setAddressa(false);
            alert("주소를 입력해주세요");
            return;
        } else if (imageSrc === "" || imageSrc === null) {
            setPhotoa(false);
            alert("사진을 찍어주세요");
            return;
        } else if (phonec !== "올바르게 입력되었습니다") {
            setPhonea(false);
            alert("휴대폰 번호를 입력해주세요");
            return;
        } else if (phone_publiccheck !== "인증 완료되었습니다") {
            setPhone_publica(false);
            alert("인증번호를 입력해주세요");
            return;
        }


        // 보내자
        axios.post("http://localhost:3000/adduser", null,
            {
                params: {
                    "id": id,
                    "password": password,
                    "name": name,
                    "gender": gender,
                    "email": email,
                    "birth": birth,
                    "address": address,
                    "facename": id + ".jpg",
                    "phone": phone,
                    "auth": auth,
                    "jointype":jointype,
                    "joinid":joinid
                }
            })
            .then(function (resp) {
                for (let i = 0; i < sub_codechecked.length; i++) {
                    console.log("sub_codechecked : " + sub_codechecked)
                    if (resp.data === "YES") {
                        // 교육기관 보내자
                        axios.post("http://localhost:3000/educodematching", null,
                            {
                                params: {
                                    "sub_code": sub_codechecked[i]
                                }
                            })
                            .then(function (resp) {
                                console.log(resp.data);
                                axios.post("http://localhost:3000/adduseredu", null,
                                    {
                                        params: {
                                            "id": id,
                                            "educode": resp.data
                                        }
                                    })
                                    .then(function (r) {

                                    })
                                    .catch(function (err) {
                                        alert("err");
                                        console.log(err);
                                    })
                            })
                            .catch(function (err) {
                                alert("err");
                                console.log(err);
                            })

                        // 과목 보내자
                        axios.post("http://localhost:3000/addusersubject", null,
                            {
                                params: {
                                    "id": id,
                                    "subcode": sub_codechecked[i]
                                }
                            })
                            .then(function (resp) {

                            })
                            .catch(function (err) {
                                alert("err");
                                console.log(err);
                            })
                    } else {
                        alert("가입되지 않았습니다");
                    }
                }
            })
            .catch(function (err) {
                alert("err");
                console.log(err);
            })

        // 사진저장
        const formData = new FormData();
        formData.append('uploadFile', imageSrc, id + ".jpg");

        fetch('http://localhost:3000/fileUpload', {
            method: 'POST',
            body: formData,
        })
            // .then((response) => response.json())
            .then((result) => {
                console.log(result);
                return fetch(`http://localhost:3000/api/imgcrop/${id}`, {
                    method: 'POST',
                });
            })
            .catch((error) => console.error(error));

        alert("정상적으로 가입되었습니다");
        history("/");      // 이동(link)
    }




    return (
        <div>
            

            <img src={logo} style={{width:"300px", height:"100px"}}/>

      
            <div id="wrapper">
                <div id="content">

                <div>
                    <h3 class="join_title">
                        <label for="id">아이디</label>
                    </h3>
                    <span class="box int_id">
                        <input type="text" id="id" class="int" maxlength="20" />
                        <span class="step_url">@naver.com</span>
                    </span>
                    <span class="error_next_box"></span>
                </div>

        
                <div>
                    <h3 class="join_title"><label for="pswd1">비밀번호</label></h3>
                    <span class="box int_pass" >
                        <input type="text" id="pswd1" class="int" maxlength="20"/>
                        <span id="alertTxt">사용불가</span>
                        <img src="m_icon_pass.png" id="pswd1_img1" class="pswdImg"/>
                    </span>
                    <span class="error_next_box"></span>
                </div>

             
                <div>
                    <h3 class="join_title"><label for="pswd2">비밀번호 재확인</label></h3>
                    <span class="box int_pass_check">
                        <input type="text" id="pswd2" class="int" maxlength="20" />
                        <img src="m_icon_check_disable.png" id="pswd2_img1" class="pswdImg" />
                    </span>
                    <span class="error_next_box"></span>
                </div>

             
                <div>
                    <h3 class="join_title"><label for="name">이름</label></h3>
                    <span class="box int_name">
                        <input type="text" id="name" class="int" maxlength="20"/>
                    </span>
                    <span class="error_next_box"></span>
                </div>

             
                <div>
                    <h3 class="join_title"><label for="yy">생년월일</label></h3>

                    <div id="bir_wrap">
                    
                        <div id="bir_yy">
                            <span class="box">
                                <input type="text" id="yy" class="int" maxlength="4" placeholder="년(4자)" />
                            </span>
                        </div>

                      
                        <div id="bir_mm">
                            <span class="box">
                                <select id="mm" class="sel">
                                    <option>월</option>
                                    <option value="01">1</option>
                                    <option value="02">2</option>
                                    <option value="03">3</option>
                                    <option value="04">4</option>
                                    <option value="05">5</option>
                                    <option value="06">6</option>
                                    <option value="07">7</option>
                                    <option value="08">8</option>
                                    <option value="09">9</option>                                    
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                </select>
                            </span>
                        </div>

                        
                        <div id="bir_dd">
                            <span class="box">
                                <input type="text" id="dd" class="int" maxlength="2" placeholder="일" />
                            </span>
                        </div>

                    </div>
                    <span class="error_next_box"></span>    
                </div>

                
                <div>
                    <h3 class="join_title"><label for="gender">성별</label></h3>
                    <span class="box gender_code">
                        <select id="gender" class="sel">
                            <option>성별</option>
                            <option value="M">남자</option>
                            <option value="F">여자</option>
                        </select>                            
                    </span>
                    <span class="error_next_box">필수 정보입니다.</span>
                </div>

                
                <div>
                    <h3 class="join_title"><label for="email">본인확인 이메일<span class="optional">(선택)</span></label></h3>
                    <span class="box int_email">
                        <input type="text" id="email" class="int" maxlength="100" placeholder="선택입력" />
                    </span>
                    <span class="error_next_box">이메일 주소를 다시 확인해주세요.</span>    
                </div>

              
                <div>
                    <h3 class="join_title"><label for="phoneNo">휴대전화</label></h3>
                    <span class="box int_mobile">
                        <input type="tel" id="mobile" class="int" maxlength="16" placeholder="전화번호 입력" />
                    </span>
                    <span class="error_next_box"></span>    
                </div>
              
                <div class="btn_area">
                    <button type="button" id="btnJoin">
                        <span>가입하기</span>
                    </button>
                </div>

            </div> 
           </div>

     
            <h3>회원가입</h3>

            <table border="1" align="center">
                <colgroup>
                    <col width="120" /><col width="250" /><col width="200" />
                </colgroup>
                <tbody>
                    <tr>
                        <td align="left">이름</td>
                        <td align="left">
                            {namea === true
                                ? <input style={{ width: "230px" }} value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력해주세요" />
                                : <input style={{ borderColor: "red", width: "230px" }} value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력해주세요" />}

                        </td>
                        <td>
                            {namec === "입력되었습니다"
                                ? <div style={{ fontSize: "5px", color: 'blue' }}>{namec}</div>
                                : <div style={{ fontSize: "5px", color: 'red' }}>{namec}</div>}
                        </td>
                    </tr>
                    <tr>
                        <td align="left">성별</td>
                        <td align="left">
                            <input type="radio" value="man" onChange={genderChange} checked={gender === 'man'} />남
                            &nbsp;
                            <input type="radio" value="woman" onChange={genderChange} checked={gender === 'woman'} />여
                        </td>
                    </tr>
                    <tr>
                        <td align="left">교육기관 코드</td>
                        <td align="left">
                            {codea === true
                                ? <input style={{ width: "230px" }} value={edu_code} onChange={(e) => setEdu_code(e.target.value)} placeholder="코드를 입력해주세요" />
                                : <input style={{ borderColor: "red", width: "230px" }} value={edu_code} onChange={(e) => setEdu_code(e.target.value)} placeholder="코드를 입력해주세요" />}

                        </td>

                    </tr>
                    <tr>
                        <td align="left">
                            <div >교육기관명</div>
                        </td>
                        <td align="left">
                            {edu_name === ""
                                ? <div style={{ fontSize: "10px" }}>올바른 코드를 입력해주세요</div>
                                : <div style={{ fontSize: "10px", color: 'blue' }}>{edu_name}</div>}

                        </td>
                    </tr>
                    <tr>
                        <td align="left">과목</td>
                        <td align="left">
                            <select className="subplus" id="subplus" onChange={subcodecheck}>

                            </select>&nbsp;&nbsp;
                            <button onClick={subjectadd}>추가</button>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">과목선택</td>
                        <td>

                            <table border="1" className="subplus2" id="subplus2">
                                <colgroup>
                                    <col width="50" /><col width="50" /><col width="200" /><col width="100" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>선택</th><th>번호</th><th>교육기관</th><th>과목</th>
                                    </tr>
                                </thead>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">아이디</td>
                        <td align="left">
                            {ida === true
                                ? <input style={{ width: "230px" }} value={id} onChange={idChange} placeholder="영문자와 숫자로 6자 이상" />
                                : <input style={{ borderColor: "red", width: "230px" }} value={id} onChange={idChange} placeholder="영문자와 숫자로 6자 이상" />}
                        </td>
                        <td>
                            {idc === "이 아이디는 사용할 수 있습니다"
                                ? <div style={{ fontSize: "5px", color: 'blue' }}>{idc}</div>
                                : <div style={{ fontSize: "5px", color: 'red' }}>{idc}</div>}

                            {/* <button onClick={idcheck}>아이디 체크</button> */}
                        </td>
                    </tr>
                    <tr>
                        <td align="left">비밀번호</td>
                        <td align="left">
                            {passworda === true
                                ? <input type="password" style={{ width: "230px" }} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="숫자,영문자,특수문자 포함 8자 이상" />
                                : <input type="password" style={{ borderColor: "red", width: "230px" }} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="숫자,영문자,특수문자 포함 8자 이상" />}
                        </td>
                        <td>
                            {passwordc === "안전한 비밀번호 입니다"
                                ? <div style={{ fontSize: "5px", color: 'blue' }}>{passwordc}</div>
                                : <div style={{ fontSize: "5px", color: 'red' }}>{passwordc}</div>}
                        </td>
                    </tr>
                    <tr>
                        <td align="left">비밀번호 확인</td>
                        <td align="left">
                            {passwordChecka === true
                                ? <input type="password" style={{ width: "230px" }} value={passwordcheck} onChange={(e) => setPasswordcheck(e.target.value)} placeholder="위와 동일한 비밀번호 입력" />
                                : <input type="password" style={{ borderColor: "red", width: "230px" }} value={passwordcheck} onChange={(e) => setPasswordcheck(e.target.value)} placeholder="위와 동일한 비밀번호 입력" />}
                        </td>
                        <td>
                            {passwordcheckc === "비밀번호가 동일합니다"
                                ? <div style={{ fontSize: "5px", color: 'blue' }}>{passwordcheckc}</div>
                                : <div style={{ fontSize: "5px", color: 'red' }}>{passwordcheckc}</div>}
                        </td>
                    </tr>
                    <tr>
                        <td align="left">이메일 주소</td>
                        <td align="left">
                            {emaila === true
                                ? <input style={{ width: "230px" }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일 주소를 입력해주세요" />
                                : <input style={{ borderColor: "red", width: "230px" }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일 주소를 입력해주세요" />}
                        </td>
                        <td>
                            {emailc === "형식에 맞는 이메일입니다"
                                ? <div style={{ fontSize: "5px", color: 'blue' }}>{emailc}</div>
                                : <div style={{ fontSize: "5px", color: 'red' }}>{emailc}</div>}
                        </td>
                    </tr>
                    <tr>
                        <td align="left">생년월일</td>
                        <td align="left">
                            {birtha === true
                                ? <input style={{ width: "230px" }} value={birth} onChange={(e) => setBirth(e.target.value)} placeholder="주민번호 앞자리 6자로 입력해주세요" />
                                : <input style={{ borderColor: "red", width: "230px" }} value={birth} onChange={(e) => setBirth(e.target.value)} placeholder="주민번호 앞자리 6자로 입력해주세요" />}
                        </td>
                        <td>
                            {birthc === "올바르게 입력되었습니다"
                                ? <div style={{ fontSize: "5px", color: 'blue' }}>{birthc}</div>
                                : <div style={{ fontSize: "5px", color: 'red' }}>{birthc}</div>}
                        </td>
                    </tr>
                    <tr>
                        <td align="left">주소</td>
                        <td align="left">
                            {addressa === true
                                ? <input style={{ width: "230px" }} className="user_enroll_text" placeholder="주소검색을 클릭해주세요" type="text" required={true} name="address" value={enroll_company.address} />
                                : <input style={{ borderColor: "red", width: "230px" }} className="user_enroll_text" placeholder="주소검색을 클릭해주세요" type="text" required={true} name="address" value={enroll_company.address} />}
                        </td>
                        <td>
                            <div>
                                <React.Fragment>
                                    <button onClick={openModal}>주소검색</button>
                                    <Modal open={modalOpen} close={closeModal} header="주소검색 ">
                                        <main>
                                            <br />
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
                                ? <button onClick={startCapture}>카메라 열기</button>
                                : <button style={{ borderColor: 'red' }} onClick={startCapture}>카메라 열기</button>}
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
                    <tr>
                        <td align="left">번호</td>
                        <td align="left">
                            {phonea === true
                                ? <input style={{ width: "230px" }} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="휴대폰 번호를 입력해주세요" />
                                : <input style={{ borderColor: "red", width: "230px" }} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="휴대폰 번호를 입력해주세요" />}
                        </td>
                        <td>
                            {phonec === "올바르게 입력되었습니다"
                                ? <div style={{ fontSize: "5px", color: 'blue' }}>{phonec}<button onClick={sendPhone}>인증번호 발송</button></div>

                                : <div style={{ fontSize: "5px", color: 'red' }}>{phonec}<button disabled="false" onClick={sendPhone}>인증번호 발송</button></div>}

                        </td>
                    </tr>
                    <tr>
                        <td align="left">인증번호</td>
                        <td align="left">
                            {phone_publica === true
                                ? <input style={{ width: "230px" }} value={phone_public} onChange={(e) => setPhone_public(e.target.value)} placeholder="인증번호를 입력해주세요" />
                                : <input style={{ borderColor: "red", width: "230px" }} value={phone_public} onChange={(e) => setPhone_public(e.target.value)} placeholder="인증번호를 입력해주세요" />}
                        </td>
                        <td>
                            {phone_publiccheck === "인증 완료되었습니다"
                                ? <div style={{ fontSize: "5px", color: 'blue' }}>{phone_publiccheck}</div>

                                : <div style={{ fontSize: "5px", color: 'red' }}>{phone_publiccheck}</div>}
                            {phone_publicch === true
                                ? <div><button onClick={sendphonecheck}>인증하기</button></div>

                                : <div><button disabled="false" onClick={sendphonecheck}>인증하기</button></div>}

                        </td>
                    </tr>

                </tbody>
            </table>

            <br />
            <button onClick={regiselect}>가입유형선택</button>
            &nbsp;
            <button onClick={account}>회원가입</button>
        </div>
    )
}

export default Regi;