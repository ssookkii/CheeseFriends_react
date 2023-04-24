import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import Pagination from 'react-js-pagination';
import styled from "styled-components";
import './asset/css/ChatbotIcon.css'


export default function LectureList() {

    const [lecturelist, setLecturelist] = useState([]);
    const movePage = useNavigate();

    function lectwrite() {
        movePage('/lecture/LectureWrite');
    }

    function AbLink() {
        movePage('/lecture/AbLectureList');

    }
    function moveleclist() {
        movePage('/lecture/LectureList')
    }
    function movelearnlist() {
        movePage('/learning/LearningList');
    }
    function movetasklist() {
        movePage('/learning/TaskList');
    }

    function getLecList() {
        axios.get("http://localhost:3000/lecturelist")
        .then(function(resp){
            setLecturelist(resp.data);
            console.log(resp.data);
            
        })
        .catch(function(err){
            // alert(err);
        })

    }

    const Btn = styled.button`
        border:none;
        cursor:pointer;
        background:none;
        font-size:18px;
        &:hover {
        color: #0d6efd;
      }
    `;

    const LecList = lecturelist.map((list, i)=>{
        return(
            <tr key={i}>
                <th scope='row'> {i + 1} </th>
                <td> {list.subject} </td>
                <td> {list.title} </td>
                <td> {list.regdate} </td>
                <td>
                    {list.writer}
                </td>
            </tr>
        )
    })

    useEffect(function(){
        getLecList(0);
    },[]);
    
  
    // const [bbslist, setBbslist] = useState([]);
    // const [choice, setChoice] = useState('');

    // //paging
    // const [page, setPage] = useState(1);
    // const [totalCnt, setTotalCnt] = useState(0);

    // function getSubList(choice, page){
    //     axios.get("http://localhost:3000/sublist", { params:{"choice":choice, "pageNumber":page } })
    //     .then(function(resp) {
    //       //  console.log(resp.data);
    //       //  alert(JSON.stringify(resp.data[8]));

    //       setBbslist(resp.data.list);
    //       setTotalCnt(resp.data.cnt);
    //     })
    //     .catch(function(err){
    //         alert(err);
    //     })
    // }

    // function pageChange(page) {
    //     setPage(page);
    //     getSubList(choice, page-1);
    // }

    // useEffect(function(){
    //     getSubList("", 0);
    // }, []);

    const SelectBox = () => {
        return (
            <select onChange={handleSortingChange} style={{marginLeft:"2px", marginTop:"20px", width:"138px", border:"none", borderBottom:"2px solid lightgray"}}>
                <option key="kor" value="국어">국어</option>
                <option key="math" value="수학">수학</option>
                <option key="eng" value="영어">영어</option>
                <option key="social" value="사회">사회</option>
                <option key="sci" value="과학">과학</option>
            </select>
        );
    };

    const [pageData, setPageData] = useState([]);
  
    const handleSortingChange = (e) => {
        const sortingOption = e.target.value; // 선택된 옵션의 값
        let sortedPageData = [...lecturelist]; // 정렬된 페이지 데이터
    
        // 선택된 옵션에 따라 페이지 데이터를 정렬
        switch (sortingOption) {
          case '국어':
            sortedPageData.sort((a, b) => a.subject.localeCompare(b.subject)); 
            break;
          case '수학':

          sortedPageData.sort((a, b) => a.subject.localeCompare(b.subject)); 
            break;
          case '영어':
    
          sortedPageData.sort((a, b) => a.subject.localeCompare(b.subject)); 
            break;
          case '사회':

          sortedPageData.sort((a, b) => a.subject.localeCompare(b.subject)); 
            break;
          case '과학':

          sortedPageData.sort((a, b) => a.subject.localeCompare(b.subject)); 
            break;

          default:
            break;
        }
    
        setPageData(sortedPageData); // 정렬된 페이지 데이터를 상태에 업데이트
      };

    return(

        <div style={{display:"flex", marginTop:"116px"}}>

            <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{width:"280px", height:"630px", borderRadius:"16px"}}>
                <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <svg className="bi pe-none me-2" style={{width:"40", height:"32" }} ><use xlinkHref="#bootstrap"></use></svg>
                    <span className="fs-4">인강 학습실</span>
                </a>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">

                    <li className="nav-item">
                        <a href="#" className="nav-link active" aria-current="page" >                                        
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;외부강의 
                        </a>
                    </li>
                    <li>
                        <a href="#" className="nav-link text-white" onClick={AbLink} >
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;결석 학생용
                        </a>
                    </li>
                </ul>
                <hr/>
                <div className="dropdown">
                    <button type="button" className="btn btn-secondary" style={{width:"248px"}} onClick={lectwrite}>
                        글쓰기
                    </button>
                </div>
            </div>


        {/* 목록 */}
        <div style={{display:"block", width:"1000px", marginTop:"25px", marginLeft:"20px"}}>
            <div style={{display:"flex", marginTop:"-100px"}}>
            <div style={{width:"310px", marginRight:"16px", cursor:"pointer", paddingTop:"19px", borderRadius:"14px", backgroundColor:"#0d6efd", color:"white", textAlign:"center"}} onClick={moveleclist}><h3>인강학습실</h3></div>
            <div style={{width:"310px", marginRight:"16px", cursor:"pointer", paddingTop:"19px", borderRadius:"14px", backgroundColor:"white", textAlign:"center"}} onClick={movelearnlist}><h3>학습용자료실</h3></div>
            <div style={{width:"310px", marginRight:"16px",cursor:"pointer", paddingTop:"19px", borderRadius:"14px", backgroundColor:"white", textAlign:"center"}} onClick={movetasklist}><h3>과제 제출실</h3></div>
            
            <SelectBox style={{ marginTop:"6px", border:"none", height:"36px", borderBottom:"2px solid gray"}}/>

            <button
                style={{marginLeft:"8px", marginTop:"28px", height:"31px", borderRadius:"6px", width:"80px", background:"#0d6efd", color:"#fff", border:"none", cursor:"pointer"}}>
                선택
            </button>
            {/* <div style={{marginLeft:"60px", marginTop:"6px"}}>

                <Pagination 

                activePage={page}
                itemsCountPerPage={10}
                totalItemsCount={totalCnt}
                pageRangeDisplayed={8}
                prevPageText={"‹"}
                nextPageText={"›"}
                onChange={pageChange} /> 
            
            </div> */}
        
        </div>
        <table className="table" style={{marginTop:"28px"}}>
            <thead>
                <tr>
                    <th scope="col">번호</th>
                    <th scope="col">과목</th>
                    <th scope="col">강의제목</th>
                    <th scope="col">작성일</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody className="table-group-divider">
                {LecList}
            </tbody>
        </table>
        </div>
                
    </div>

    )
}




// function TableRow(props){
//     return (
//         <tr>
//             <td>{props.cnt}</td>

//             {/* <td style={{ textAlign:"left" }}>{getArrow(props.bbs.depth)}{props.bbs.title}</td> */}
//             {BbsTitleProc(props)}

//             <td>{props.bbs.readcount}</td>
//             <td>{props.bbs.id}</td>
//         </tr>
//     );
// }



// // 제목에 대한 링크 및 삭제된 글의 처리
// function BbsTitleProc(props){
//     if(props.bbs.del === 0){
//         return (
//             <td style={{ textAlign:"left" }}>
//                 {getArrow(props.bbs.depth)}                
//                 <Link to={`/bbsdetail/${props.bbs.seq}`}>{props.bbs.title}</Link>                
//             </td>
//         );
//     }else{
//         return (
//             <td>*** 이 글은 작성자에 의해서 삭제되었습니다 ***</td>
//         );
//     }
// }

// function getArrow( depth ) {
// 	let nbsp = "&nbsp;&nbsp;&nbsp;&nbsp;";
	
// 	let ts = "";
// 	for(var i = 0;i < depth; i++){
// 		ts += nbsp;
// 	}

//     // String -> Html
//     let space = <span dangerouslySetInnerHTML={{ __html: ts }}></span>    
//     if(depth === 0){
//         return "";
//     }

// 	// return (<>{space}<img src={arrow} alt="arrow.png" width='20px' height='20px'/>&nbsp;</>);
// }



