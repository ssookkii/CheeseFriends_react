import React, { useEffect, useState, useRef } from 'react';
import { MapMarker, Map } from "react-kakao-maps-sdk";
import axios from "axios";

import MapSearch from './MapSearch';
import { useNavigate, useParams } from 'react-router';

import styles from './asset/css/addEdit.module.css'

function EduUpdate(){
    const [isOpen, setOpen] = useState(false);
    const [place, setPlace] = useState({
        place_name : "",
        road_address_name : "",
        address_name : "",
        phone : "",
        x : "",
        y : "",
    });
    const [showMap, setShowMap] = useState(false);

    const navigate = useNavigate();
    let params = useParams();
    const prevPlace = usePrevPlace(place);

    function usePrevPlace(place){
        const prevPlace = useRef(place);
        useEffect(() => {
            prevPlace.current = place
        }, [place]);
        return prevPlace.current;
    }
    console.log(prevPlace.road_address_name);
    console.log(place.road_address_name);
    console.log(showMap);

    // 모달창 열고 닫는 handler
    const openSearchModalHandler = () => {
        setOpen(true);
    };
    const closeSearchModalHandler = () => {
        setOpen(false);
        setShowMap(true);
    };

    const getEduData = async(eduCode) => {
        const response = await axios.get("http://localhost:3000/getEdu", {params:{"eduCode":eduCode}})
            setPlace({
                place_name : response.data.eduName,
                road_address_name : response.data.eduAddress,
                address_name : response.data.eduAddress,
                phone : response.data.eduPhone,
            });
    }
    useEffect(()=>{
        getEduData(params.eduCode);
    }, [params.eduCode]);
    
    function eduUpdate(){
        if(place.place_name === null || place.place_name === ""){
            alert("학원명을 입력해주세요");
            return;
        } else if((place.road_address_name === "" && place.address_name === "") || (place.road_address_name === null && place.address_name === null)){
            alert("학원주소를 입력해주세요");
            return;
        }

        let eduData = null;
        if(place.road_address_name !== null || place.road_address_name !== "") {
            eduData = {
                eduCode : params.eduCode,
                eduName : place.place_name,
                eduAddress : place.road_address_name,
                eduPhone : place.phone
            }
        }else {
            eduData = {
                eduCode : params.eduCode,
                eduName : place.place_name,
                eduAddress : place.address_name,
                eduPhone : place.phone
            }
        }
        axios.post("http://localhost:3000/eduUpdate", null, {params: eduData})
        .then(function(resp){
            if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                alert("수정되었습니다");
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

    return (

        <div className={styles.addEditWrap}>
            <h2 className={styles.title}>교육기관수정</h2>
            <div>
                <input type="hidden" defaultValue={params.eduCode}/>
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
                
                {prevPlace.road_address_name !== place.road_address_name && showMap ?
                    <Map // 지도를 표시할 Container
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
                </Map> : ""}
                
                    <div className={styles.InputBox}>
                        <span>교육기관전화번호</span>
                        <input type="text" className={styles.Input} defaultValue={place.phone} onInput={(e) => setPlace(prevState => ({...prevState, phone: e.target.value}))} placeholder='학원번호'/>
                    </div>
                    <button className={`${styles.btn} ${styles.btnCenter}`} onClick={eduUpdate}>수정완료</button>
                </div>
            </div>
    )
}
export default EduUpdate