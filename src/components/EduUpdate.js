import React, { useEffect, useState } from 'react';
import { MapMarker, Map } from "react-kakao-maps-sdk";
import axios from "axios";

import MapSearch from './MapSearch';
import { useNavigate, useParams } from 'react-router';

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
    const navigate = useNavigate();

    let params = useParams();
    console.log(params.eduCode);

    const openSearchModalHandler = () => {
        setOpen(true);
    };

    const closeSearchModalHandler = () => {
        setOpen(false);
    };


    console.log(place);
    console.log(isOpen);

    const getEduData = async(eduCode) => {
        const response = await axios.get("http://localhost:3000/getEdu", {params:{"eduCode":eduCode}})
            console.log(response.data);
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
                console.log(resp.data);
                navigate("/edumanage");
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

        <div>
                <input type="hidden" defaultValue={params.eduCode}/>
                <input type="text" defaultValue={place.place_name} placeholder='학원이름'/>
                {place.road_address_name !== null && place.road_address_name !== "" ? (
                    <input type="text" defaultValue={place.road_address_name} placeholder='학원검색'/>
                    ) : (
                    <input type="text" defaultValue={place.address_name} placeholder='학원검색'/>
                )}
                <button onClick={openSearchModalHandler}>검색</button>
                <MapSearch isOpen={isOpen} onClose={closeSearchModalHandler} setPlace={setPlace}/>
                
                <Map // 지도를 표시할 Container
                    center={{
                        // 지도의 중심좌표
                        lat: place.y,
                        lng: place.x,
                    }}
                    style={{
                        // 지도의 크기
                        width: "450px",
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
                    </Map>

                <input type="text" defaultValue={place.phone} placeholder='학원번호'/>
                <button onClick={eduUpdate}>수정완료</button>
        </div>
    )
}
export default EduUpdate