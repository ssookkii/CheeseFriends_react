import React, { useEffect, useState } from 'react';
import { MapMarker, Map } from "react-kakao-maps-sdk";
import axios from "axios";
import { useNavigate } from 'react-router';

import MapSearch from './MapSearch';

import styles from './asset/css/addEdit.module.css'

function EduAdd() {
    const navigate = useNavigate();

    const [isOpen, setOpen] = useState(false);
    const [place, setPlace] = useState({
        place_name : "",
        road_address_name : "",
        address_name : "",
        phone : "",
        x : 33.450701,
        y : 126.570667,
    });

    const openSearchModalHandler = () => {
        setOpen(true);
    };

    const closeSearchModalHandler = () => {
        setOpen(false);
    };

    useEffect(()=>{
        console.log(place);
    }, [place]);

    console.log(place);
    console.log(isOpen);
    
    function eduAdd(){
        if(place.place_name === null || place.place_name === ""){
            alert("학원명을 입력해주세요");
            return;
        } else if((place.road_address_name === "" && place.address_name === "") || (place.road_address_name === null && place.address_name === null)){
            alert("학원주소를 입력해주세요");
            return;
        }
        let eduData = null;
        if(place.road_address_name === null || place.road_address_name === "" || place.road_address_name.length === 0) {
            eduData = {
                eduCode : place.place_name,
                eduName : place.place_name,
                eduAddress : place.address_name,
                eduPhone : place.phone
            }
        }else {
            eduData = {
                eduCode : place.place_name,
                eduName : place.place_name,
                eduAddress : place.road_address_name,
                eduPhone : place.phone
            }
        }

        axios.post("http://localhost:3000/eduAdd", null, {params: eduData})
        .then(function(resp){
            if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                alert("등록되었습니다");
                console.log(resp.data);
                navigate("/adminpage/edumanage");
            }else if(resp.data !== null && resp.data !== "" && resp.data === "fail"){
                alert("입력칸을 확인해주십시오")
            }else if(resp.data !== null && resp.data !== "" && resp.data === "duplicate"){
                alert("이미등록되어있는 학원입니다")
            }
        })
        .catch(function(err){
            alert(err);
        })
    }
    console.log(place.road_address_name.length);
    console.log(place.address_name);
    console.log(place.phone);

    return (

        <div className={styles.addEditWrap}>
            <h2 className={styles.title}>교육기관등록</h2>
            <div>
                <div className={styles.InputBox}>
                    <span>교육기관이름</span>
                    <input type="text" className={styles.Input} defaultValue={place.place_name} value={place.place_name} onInput={(e) => setPlace(prevState => ({...prevState, place_name: e.target.value}))} placeholder='학원이름'/>
                </div>
                <div className={styles.InputBox}>
                    <span>교육기관주소</span>
                    {place.road_address_name !== null && place.road_address_name !== "" ? (
                        <input type="text" className={styles.Input} defaultValue={place.road_address_name} value={place.road_address_name} onInput={(e) => setPlace(prevState => ({...prevState, road_address_name: e.target.value}))} placeholder='학원검색'/>
                        ) : (
                        <input type="text" className={styles.Input} defaultValue={place.address_name} value={place.address_name} onInput={(e) => setPlace(prevState => ({...prevState, address_name: e.target.value}))} placeholder='학원검색'/>
                    )}
                    <button className={styles.btn} onClick={openSearchModalHandler}>검색</button>
                </div>
                <MapSearch isOpen={isOpen} onClose={closeSearchModalHandler} setPlace={setPlace}/>
                
                {place.place_name !== null && place.place_name !== "" ?
                    (<Map // 지도를 표시할 Container
                    center={{
                        // 지도의 중심좌표
                        lat: place.y,
                        lng: place.x,
                    }}
                    style={{
                        // 지도의 크기
                        width: "100%",
                        height: "450px",
                        zIndex: 1,
                    }}
                    level={4} // 지도의 확대 레벨
                    >
                    <MapMarker // 마커를 생성합니다
                        position={{
                        // 마커가 표시될 위치입니다
                        lat: place.y,
                        lng: place.x,
                        }}
                    />
                </Map>) : (<div/>)}
                <div className={styles.InputBox}>
                    <span>교육기관전화번호</span>
                    <input type="text" className={styles.Input} defaultValue={place.phone}  onInput={(e) => setPlace(prevState => ({...prevState, phone: e.target.value}))} placeholder='학원번호'/>
                </div>
                <button className={`${styles.btn} ${styles.btnCenter}`} onClick={eduAdd}>학원등록</button>
            </div>
        </div>



    )

}

export default EduAdd