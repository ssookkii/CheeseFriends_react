import React, { Fragment, useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';

const SearchReceiver = ({isOpen, onClose, setEduCode, setReceiver}) => {
    const [choice, setChoice] = useState('');
    const [search, setSearch] = useState('');

    const [openTitle, setOpenTitle] = useState(true);

    const [edulist, setEdulist] = useState([]);
    const [idlist, setIdlist] = useState([]);
    const [confirmId, setConfirmId] = useState([]);
    const [selectedId, setSelectedId] = useState("");

    // 학원코드, 학원명 선택해서 검색하면 데이터 넘겨받기
    function handleEduCodeSearch() {
        axios.get("http://localhost:3000/getEduMailList", {params: {"choice":choice, "search":search}})
        .then(function(resp){
            console.log(resp.data);
            setEdulist(resp.data);
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
    // 학원코드로 검색
    function clickEdu(){
        setOpenTitle(true);
        const element = document.getElementById("element");

        while (element.hasChildNodes()) {
            element.removeChild(element.lastChild);
        }
    }
    // 아이디로 검색
    function clickId(){
        setOpenTitle(false);
    }
    
    function IdSearch() {
        axios.get("http://localhost:3000/getIdMailList", {params: {"id":selectedId}})
        .then(function(resp){
            console.log(resp.data);
            setIdlist(resp.data);

            const element = document.getElementById("element");
            const fragment = document.createDocumentFragment();

            while (element.hasChildNodes()) {
                element.removeChild(element.lastChild);
            }

            for(let i=0; i< resp.data.length; i++){
                const itemEl = displayIdList(i, resp.data[i])
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
        td4.innerHTML = id.eduCode;
        td5.innerHTML = id.eduName;
        button.innerHTML = "추가";

        button.addEventListener("click", () => {
            setConfirmId(prevState => [...prevState, id]);
        });

        td6.appendChild(button);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);

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

    return (
        <ReactModal isOpen={isOpen} onRequestClose={() => onClose()}>
            <div>
                <div>
                    <button onClick={clickEdu}>학원코드</button>
                    <button onClick={clickId}>아이디</button>
                </div>
                <div>
                {openTitle ?
                    (<Fragment>
                        <div>
                        <select value={choice} onChange={(e)=>setChoice(e.target.value)}>
                            <option value="">검색</option>
                            <option value="eduCode">학원코드</option>
                            <option value="eduName">학원명</option>
                            <option value="eduName">확인</option>
                        </select>
                        <input defaultValue={search} onInput={(e) =>setSearch(e.target.value)} />
                        <button onClick={handleEduCodeSearch}>검색</button>
                    </div>
                
                <table border="1" align="center">
                    <colgroup>
                        <col width="50" /><col width="50" /><col width="200" /><col width="150" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>학원코드</th>
                            <th>학원명</th>
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
                </Fragment>)
                : (
                <Fragment>
                    <div>
                        <span>아이디</span>
                        <input defaultValue={selectedId} onInput={(e) =>setSelectedId(e.target.value)} />
                        <button onClick={IdSearch}>검색</button>
                    </div>
                    <table border="1" align="center">
                    <colgroup>
                        <col width="50" /><col width="50" /><col width="200" /><col width="150" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>아이디</th>
                            <th>이름</th>
                            <th>학원코드</th>
                            <th>학원명</th>
                            <th>선택</th>
                        </tr>
                    </thead>
                    <tbody id="element">

                    </tbody>     
                </table>
                <h2>추가된 아이디</h2>
                <table border="1" align="center">
                    <colgroup>
                        <col width="50" /><col width="50" /><col width="200" /><col width="150" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>아이디</th>
                            <th>이름</th>
                            <th>학원코드</th>
                            <th>학원명</th>
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
                                    <td>{data.eduCode}</td>
                                    <td>{data.eduName}</td>
                                    <td><button onClick={()=>idDelete(data.id)}>삭제</button></td>
                                </tr>
                            )
                        })
                        :<td></td>
                    }    
                    </tbody>     
                </table>
                <button onClick={addId}>확인</button>
            </Fragment>
                    )
                }
                </div>
            </div>      
        </ReactModal>
    );
};

export default SearchReceiver;