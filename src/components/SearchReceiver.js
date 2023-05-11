import React, { Fragment, useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import Pagination from "react-js-pagination";

import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import styles from './asset/css/searchReceiver.module.css'

const SearchReceiver = ({isOpen, onClose, setReceiver}) => {
    const [choice, setChoice] = useState('');
    const [search, setSearch] = useState('');

    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);

    const [openTitle, setOpenTitle] = useState(true);

    const [edulist, setEdulist] = useState([]);
    const [idlist, setIdlist] = useState([]);
    const [confirmId, setConfirmId] = useState([]);
    const [selectedId, setSelectedId] = useState("");

    // 학원코드, 학원명 선택해서 검색하면 데이터 넘겨받기
    function handleEduCodeSearch(ch, se, p) {
        axios.get("http://localhost:3000/getEduMailList", {params: {"choice":ch, "search":se, "pageNumber":p}})
        .then(function(resp){
            console.log(resp.data);
            setEdulist(resp.data.list);
            setTotalCnt(resp.data.cnt);
        })
        .catch(function(err){
            alert(err);
        })
    
    }
    // 학원코드 선택하면 데이터 넘겨지고 모달창 닫기
    function selectEdu(eduCode){
        axios.get("http://localhost:3000/getEduIdMailList", { params:{"eduCode":eduCode} })
        .then(function(resp){
            console.log(resp.data);
            // alert(JSON.stringify(resp.data));
            setReceiver(resp.data);
            
        })
        .catch(function(err){
            alert(err);
        })
        onClose()
    }
    // 학원코드검색 페이지 변경
    function pageChange(page){
        setPage(page);
        handleEduCodeSearch(choice, search, page);
    }
    // 아이디검색 페이지 변경
    function idpageChange(page){
        setPage(page);
        hadleIdSearch(choice, selectedId, page);
    }
    // 학원코드로 검색
    function clickEdu(){
        setOpenTitle(true);
        setSearch('');
        setSelectedId('');
        setEdulist([]);
        setConfirmId([]);
        const element = document.getElementById("element");

        if(element) {
            while (element.hasChildNodes()) {
                element.removeChild(element.lastChild);
            }

        }
    }
    // 아이디로 검색
    function clickId(){
        setOpenTitle(false);
        setSelectedId('');
        setSearch('');
        setEdulist([]);
        setConfirmId([]);
    }
    
    function hadleIdSearch(ch, se, p) {
        axios.get("http://localhost:3000/getIdMailList", {params: {"choice":ch, "search":se, "pageNumber":p}})
        .then(function(resp){
            console.log(resp.data.list);
            setIdlist(resp.data.list);
            setTotalCnt(resp.data.cnt);

            const element = document.getElementById("element");
            const fragment = document.createDocumentFragment();

            while (element.hasChildNodes()) {
                element.removeChild(element.lastChild);
            }

            for(let i=0; i< resp.data.list.length; i++){
                const itemEl = displayIdList(i, resp.data.list[i])
                fragment.appendChild(itemEl);
            }
            element.appendChild(fragment);
            
        })
        .catch(function(err){
            alert(err);
        })
    
    }

    function displayIdList(index, id){

        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        let td4 = document.createElement("td");
        let td5 = document.createElement("td");
        let td6 = document.createElement("td");
        let button = document.createElement("button");
        td1.innerHTML = [index+1];
        td2.innerHTML = id.id;
        td3.innerHTML = id.name;
        td4.innerHTML = `${id.eduCode}<br/>(${id.eduName})`;
        button.innerHTML = "추가";

        button.addEventListener("click", () => {
            setConfirmId(prevState => [...prevState, id]);
        });

        td5.appendChild(button);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);

        return tr;
    }

    function idDelete(id){
        const filteredId = confirmId.filter((obj) => obj.id !== id);
        setConfirmId(filteredId);
    }
    function addId(){
        setReceiver(confirmId);
        onClose();
    }
    console.log(page);
    console.log(totalCnt);

    const activeEduEnter = (e) => {
        if(e.key === "Enter") {
            handleEduCodeSearch(choice, search, page)
        }
    }
    const activeIdEnter = (e) => {
        if(e.key === "Enter") {
            hadleIdSearch(choice, selectedId, page)
        }
    }

    return (
        <ReactModal isOpen={isOpen} onRequestClose={() => onClose()}>
            <div>
                <div className={styles.btnWarp}>
                    <button className={openTitle ? `${styles.btnActive}`  : ""} onClick={clickEdu}>학원코드로 검색</button>
                    <button className={!openTitle ? `${styles.btnActive}`  : ""} onClick={clickId}>아이디로 검색</button>
                </div>
                <div>
                {openTitle ?
                    (<Fragment>
                    <div className={styles.searchTitle}>
                        <select value={choice} onChange={(e)=>setChoice(e.target.value)}>
                            <option value="">검색</option>
                            <option value="eduCode">학원코드</option>
                            <option value="eduName">학원명</option>
                        </select>
                        <input defaultValue={search} value={search} onInput={(e) =>setSearch(e.target.value)} onKeyPress={(e) => activeEduEnter(e)}/>
                        <button className={styles.searchBtn} onClick={()=>handleEduCodeSearch(choice, search, page)}>검색</button>
                    </div>
                
                <table className={`${styles.datalist} ${styles.edulist}`} border="1" align="center">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>학원코드</th>
                            <th>학원명</th>
                            <th>확인</th>
                        </tr>
                    </thead>
                    <tbody>
                    {edulist !== null
                        ? edulist.map(function(edu, i){
                            return (
                                <tr key={i}>
                                    <td>{i+1}</td>
                                    <td>{edu.eduCode}</td>
                                    <td>{edu.eduName}</td>
                                    <td><button onClick={() => selectEdu(edu.eduCode)}>선택</button></td>
                                </tr>
                            )
                        })
                        :<td></td>
                    }    
                    </tbody>     
                </table>
                <Pagination
                activePage={page}
                itemsCountPerPage={10}
                totalItemsCount={totalCnt}
                pageRangeDisplayed={10}
                firstPageText={<FontAwesomeIcon icon={faAnglesLeft} />}
                lastPageText={<FontAwesomeIcon icon={faAnglesRight} />}
                prevPageText={<FontAwesomeIcon icon={faAngleLeft} />}
                nextPageText={<FontAwesomeIcon icon={faAngleRight} />}
                onChange={pageChange} /> 
                </Fragment>)
                : (
                <Fragment>
                    <div className={styles.searchTitle}>
                        <select value={choice} onChange={(e)=>setChoice(e.target.value)}>
                            <option value="">검색</option>
                            <option value="userId">아이디</option>
                            <option value="userName">이름</option>
                        </select>
                        <input defaultValue={selectedId} value={selectedId} onInput={(e) =>setSelectedId(e.target.value)} onKeyPress={(e) => activeIdEnter(e)}/>
                        <button className={styles.searchBtn} onClick={()=>hadleIdSearch(choice, selectedId, page)}>검색</button>
                    </div>
                    <table className={`${styles.datalist} ${styles.idlist}`} border="1" align="center">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>아이디</th>
                            <th>이름</th>
                            <th>학원코드(학원명)</th>
                            <th>선택</th>
                        </tr>
                    </thead>
                    <tbody id="element">

                    </tbody>     
                </table>
                <Pagination
                activePage={page}
                itemsCountPerPage={10}
                totalItemsCount={totalCnt}
                pageRangeDisplayed={10}
                firstPageText={<FontAwesomeIcon icon={faAnglesLeft} />}
                lastPageText={<FontAwesomeIcon icon={faAnglesRight} />}
                prevPageText={<FontAwesomeIcon icon={faAngleLeft} />}
                nextPageText={<FontAwesomeIcon icon={faAngleRight} />}
                onChange={idpageChange} /> 
                <h2 className={styles.h2title}>추가된 아이디</h2>
                <table className={`${styles.datalist} ${styles.idlist}`} border="1" align="center">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>아이디</th>
                            <th>이름</th>
                            <th>학원코드(학원명)</th>
                            <th>선택</th>
                        </tr>
                    </thead>
                    <tbody>
                    {confirmId !== null
                        ? confirmId.map(function(data, i){
                            return (
                                <tr key={i}>
                                    <td>{i+1}</td>
                                    <td>{data.id}</td>
                                    <td>{data.name}</td>
                                    <td>{data.eduCode}<br/>({data.eduName})</td>
                                    <td><button onClick={()=>idDelete(data.id)}>삭제</button></td>
                                </tr>
                            )
                        })
                        :<td></td>
                    }    
                    </tbody>     
                </table>
                <button className={styles.idAddBtn} onClick={addId}>확인</button>
            </Fragment>
                    )
                }
                </div>
            </div>
        </ReactModal>
    );
};

export default SearchReceiver;