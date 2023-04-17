import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Pagination from "react-js-pagination";

function SubjectManage(){
    const [subList, setSubList] = useState([]);

    const [choice, setChoice] = useState('');
    const [search, setSearch] = useState('');

    // paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);

    function getSubList(cho, sear, page){
        axios.get("http://localhost:3000/sublist", { params:{"choice":cho, "search":sear, "pageNumber":page} })
        .then(function(resp){
            console.log(resp.data);
            // alert(JSON.stringify(resp.data));

            setSubList(resp.data.list);
            setTotalCnt(resp.data.cnt);
        })
        .catch(function(err){
            alert(err);
        })
    }

    function searchBtn(){
        // if(choice.toString().trim() === "" || search.toString().trim() === "") return;
        getSubList(choice, search, 0);
    }

    function pageChange(page){
        setPage(page);
        getSubList(choice, search, page-1);
    }

    function deleteBtn(subCode){
        if(window.confirm("정말 삭제하시겠습니까?")){
            axios.post("http://localhost:3000/subDelete", null, {params: {"subCode":subCode}})
            .then(function(resp){
                if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                    alert("삭제되었습니다.");
                    console.log(resp.data);
                    window.location.replace("/submanage")
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
        getSubList("", "", 0);
    },[]);


    return(
        <div>           
            <select vlaue={choice} onChange={(e)=>setChoice(e.target.value)}>
                <option value="">검색</option>
                <option value="eduCode">학원코드</option>
                <option value="eduName">학원이름</option>
                <option value="subCode">과목코드</option>
                <option value="subName">과목이름</option>
                <option value="id">아이디</option>
            </select>
            <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="검색어"/>
            <button onClick={searchBtn}>검색</button>
            <button>학원등록</button>

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
                        <td>과목코드</td>
                        <td>과목이름</td>
                        <td>담당교사아이디</td>
                        <td>담당교사이름</td>
                        <td>관리</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        subList.map(function(sub, i){
                            return (
                                <tr key={i}>
                                    <td>{sub.eduCode}</td>
                                    <td>{sub.eduName}</td>
                                    <td>{sub.subCode}</td>
                                    <td>{sub.subName}</td>
                                    <td>{sub.educatorName}</td>
                                    <td>{sub.name}</td>
                                    <td>
                                        <Link to={`/subupdate/${sub.subCode}`}>수정</Link>
                                        <button onClick={() => deleteBtn(sub.subCode)}>삭제</button>
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
export default SubjectManage