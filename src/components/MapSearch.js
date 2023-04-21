/*global kakao*/
import React, { useState } from 'react';
import ReactModal from 'react-modal';
import './asset/css/mapSearch.css';

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MapSearch({isOpen, onClose, setPlace}) {
    let ps = new kakao.maps.services.Places(); 
    const [keyword, setKeyword] = useState('');
    const [isCalled, setIsCalled] = useState(false);


    function searchPlaces() {
        if (!keyword.replace(/^\s+|\s+$/g, '')) {
            alert('키워드를 입력해주세요!');
            return false;
        }
        ps.keywordSearch(keyword, placesSearchCB);
    }

    function placesSearchCB (data, status, pagination) {
        if (isCalled) {
            return
        }
        setIsCalled(true);

        setTimeout(() => setIsCalled(false), 3000)

        if (status === kakao.maps.services.Status.OK) {

            // 정상적으로 검색이 완료됐으면
            // 검색 목록과 마커를 표출합니다
            displayPlaces(data);
            // 페이지 번호를 표출합니다
            displayPagination(pagination);
    
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    
            alert('검색 결과가 존재하지 않습니다.');
            return;
    
        } else if (status === kakao.maps.services.Status.ERROR) {
    
            alert('검색 결과 중 오류가 발생했습니다.');
            return;
    
        }
    }
    function displayPlaces (places) {
        const listEl = document.getElementById('placesList');
        const menuEl = document.getElementById('menu_wrap');
        const fragment = document.createDocumentFragment();
        const bounds = new kakao.maps.LatLngBounds();


        removeAllChildNods(listEl);

        console.log({ places }, places.length)

        for (let i = 0; i < places.length; i++) {
            const placePosition = new kakao.maps.LatLng(places[i].y, places[i].x)
            const itemEl = getListItem(i, places[i]);

            bounds.extend(placePosition);

            console.log(places[i].address_name);
            console.log(places[i].road_address_name);
            console.log(places[i].place_name);
            console.log(places[i].phone);

            fragment.appendChild(itemEl);
        }

        listEl.appendChild(fragment);
        menuEl.scrollTop = 0;

    }


    function getListItem (index, places) {

        const el = document.createElement('li')
        let itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' +
            '<div class="info" >' +
            '   <h5>' + places.place_name + '</h5>';

        if (places.road_address_name) {
            itemStr += '    <span>' + places.road_address_name + '</span>' +
                '   <span class="jibun gray">' + places.address_name + '</span>';
        } else {
            itemStr += '    <span>' + places.address_name + '</span>';
        }

        itemStr += '  <span class="tel">' + places.phone + '</span>' +
            '</div>';

        el.innerHTML = itemStr;
        el.className = 'item';

        el.addEventListener("click", () => {
            setPlace({
                place_name : places.place_name,
                road_address_name : places.road_address_name,
                address_name : places.address_name,
                phone : places.phone,
                x : places.x,
                y : places.y,
            });
            console.log(places.x);
            console.log(places.y);
            onClose()
        });

        return el;
    }

    function displayPagination (pagination) {
        const paginationEl = document.getElementById('pagination')
        const fragment = document.createDocumentFragment()

        while (paginationEl.hasChildNodes()) {
            paginationEl.removeChild(paginationEl.lastChild);
        }

        let elList = []

        for (let i = 1; i <= pagination.last; i++) {
            elList[i] = document.createElement('button')
            elList[i].innerHTML = i;

            if (i === pagination.current) {
                elList[i].className = 'on'
            }

            elList[i].onclick = async () => {
                elList.forEach((_,i) => {
                    elList[i].className = 'off'
                })

                elList[i].className = 'on'

                const res = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?page=${i}&size=15&sort=accuracy&query=${keyword}`, {
                    headers: {
                        'Authorization': `KakaoAK c9a6011c3255778eb800fe610b6a99c0`
                    }
                })

                const json = await res.json()
                console.log(json)

                displayPlaces(json['documents'])
            }

            fragment.appendChild(elList[i]);
        }
        paginationEl.appendChild(fragment);
    }

    function removeAllChildNods (el) {
        while (el.hasChildNodes()) {
            el.removeChild(el.lastChild);
        }
    }
    const activeEnter = (e) => {
        if(e.key === "Enter") {
            searchPlaces()
        }
    }

    return (
            <ReactModal isOpen={isOpen} onRequestClose={() => onClose()}>
                <div id="menu_wrap" className="bg_white">
                    <div className="option">
                            <input type="text" className="mapInputKeword" onChange={(e) => setKeyword(e.target.value)} onKeyPress={(e) => activeEnter(e)} placeholder='학원이름 또는 주소를 입력하세요' autoFocus/>
                            <button onClick={() => searchPlaces()}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                    </div>
                    <ul id="placesList"></ul>
                    <div id="pagination"></div>
                </div>
            </ReactModal>
    )
}

export default MapSearch