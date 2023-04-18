import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Pagination from "react-js-pagination";

function EduManage(){
    const [eduList, setEduList] = useState([]);

    const [choice, setChoice] = useState('');
    const [search, setSearch] = useState('');

    // paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);

    function getEduList(cho, sear, page){
        axios.get("http://localhost:3000/edulist", { params:{"choice":cho, "search":sear, "pageNumber":page} })
        .then(function(resp){
            console.log(resp.data);
            // alert(JSON.stringify(resp.data));

            setEduList(resp.data.list);
            setTotalCnt(resp.data.cnt);
        })
        .catch(function(err){
            alert(err);
        })
    }

    function searchBtn(){
        // if(choice.toString().trim() === "" || search.toString().trim() === "") return;
        getEduList(choice, search, 0);
    }

    function pageChange(page){
        setPage(page);
        getEduList(choice, search, page-1);
    }

    function deleteBtn(eduCode){
        if(window.confirm("정말 삭제하시겠습니까?")){
            axios.post("http://localhost:3000/eduDelete", null, {params: {"eduCode":eduCode}})
            .then(function(resp){
                if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                    alert("삭제되었습니다.");
                    console.log(resp.data);
                    window.location.replace("/edumanage")
                }else if(resp.data !== null && resp.data !== "" && resp.data === "fail"){
                    alert("삭제를 실패하였습니다.")
                }
            })
            .catch(function(err){
                alert(err);
            })
        }else{
            alert("취소되었습니다.");
        }
        
    }

    useEffect(function(){
        getEduList("", "", 0);
    },[]);

    return(
        <div>           
            <select vlaue={choice} onChange={(e)=>setChoice(e.target.value)}>
                <option value="">검색</option>
                <option value="eduCode">학원코드</option>
                <option value="eduName">학원이름</option>
                <option value="eduAddress">학원주소</option>
            </select>
            <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="검색어"/>
            <button onClick={searchBtn}>검색</button>
            <Link to="/eduAdd">학원등록</Link> 

            <table border="1">
                <colgroup>
                    <col width="70"/>
                    <col width="100"/>
                    <col width="100"/>
                    <col width="100"/>
                    <col width="100"/>
                    <col width="100"/>
                    <col width="100"/>
                </colgroup>
                <thead>
                    <tr>
                        <td>학원코드</td>
                        <td>학원이름</td>
                        <td>학원주소</td>
                        <td>학원번호</td>
                        <td>학원계정</td>
                        <td>관리</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        eduList.map(function(edu, i){
                            return (
                                <tr key={i}>
                                    <td><input type="checkbox"/></td>
                                    <td>{edu.eduCode}</td>
                                    <td>{edu.eduName}</td>
                                    <td>{edu.eduAddress}</td>
                                    <td>{edu.eduPhone}</td>
                                    <td>{edu.id}</td>
                                    <td>
                                        <Link to={`/eduupdate/${edu.eduCode}`}>수정</Link>
                                        <button onClick={() => deleteBtn(edu.eduCode)}>삭제</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>

            </table>

            <br/>
            <Pagination
                activePage={page}
                itemsCountPerPage={15}
                totalItemsCount={totalCnt}
                pageRangeDisplayed={15}
                prevPageText={"이전"}
                nextPageText={"다음"}
                onChange={pageChange} />
        </div>
    )
}
export default EduManage