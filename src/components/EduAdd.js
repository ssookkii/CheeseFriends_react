import React, { useState } from 'react';
import { MapMarker, Map } from "react-kakao-maps-sdk";
import axios from "axios";

import MapSearch from './MapSearch';

function EduAdd() {
    // const history = useNavigate();

    const [isOpen, setOpen] = useState(false);
    const [place, setPlace] = useState({
        place_name : "",
        road_address_name : "",
        address_name : "",
        phone : "",
        x : "",
        y : "",
    });

    const openSearchModalHandler = () => {
        setOpen(true);
    };

    const closeSearchModalHandler = () => {
        setOpen(false);
    };


    console.log(place);
    console.log(isOpen);

    function eduAdd(){
        let eduData = null;
        if(place.road_address_name !== null || place.road_address_name !== "") {
            eduData = {
                eduCode : place.place_name,
                eduName : place.place_name,
                eduAddress : place.road_address_name,
                eduPhone : place.phone
            }
        }else {
            eduData = {
                eduCode : place.place_name,
                eduName : place.place_name,
                eduAddress : place.address_name,
                eduPhone : place.phone
            }
        }
        axios.post("http://localhost:3000/eduAdd", null, {params: eduData})
        .then(function(resp){
            if(resp.data !== null && resp.data !== ""){
                alert(resp.data);
                // localStorage.setItem("login", JSON.stringify(resp.data));
                // history("/");
            }else{
                alert("입력칸을 확인해주십시오")
            }
        })
        .catch(function(err){
            alert(err);
        })
    }

    return (

        <div>

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
                <button onClick={eduAdd}>학원등록</button>
        </div>



    )

}

export default EduAdd