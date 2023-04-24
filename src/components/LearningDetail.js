import { useNavigate } from 'react-router';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import styled from "styled-components";
import axios from "axios";


export default function LearningDetail() {

    const [learningdetail, setLearningdetail] = useState([]);

    const movePage = useNavigate();

    function learnlist() {
        movePage('/learning');
    }

    function getLearnDetail(seq) {
        axios.get('http://localhost:3000/getLearning?'+seq)
        .then(function(resp){
            setLearningdetail(resp.data);
            console.log(resp.data);
        })
        .catch(function(err){
            alert(err);
        })
    }

    const LearnDetail = learningdetail.map((list, i)=> {
        return(
            <tr key={i}>
            <th scope='row'> {i + 1} </th>
            <td> {list.title} </td>
            <td> {list.subject} </td>
            <td> {list.writer}</td>
            <td> {list.regdate} </td>
            <td> {list.content}</td>
        </tr>
        )
    })

    useEffect(function(){
        getLearnDetail(0);
    },[]);
    


  return (
    <>
      <h2>수업 자료실</h2>

      <div className="post-view-wrapper">
      <table className="table" style={{marginTop:"28px"}}>
            <thead>
                <tr>
                    <th scope="row">제목</th>
                    <th scope="row">과목</th>
                    <th scope="row">작성자</th>
                    <th scope="row">작성일</th>
                    <th scope="row">내용</th>
                </tr>
            </thead>
            <tbody className="table-group-divider">
                {LearnDetail}
            </tbody>
        </table>
        <button className="post-view-go-list-btn" onClick={learnlist}>목록</button>
      </div>

    </>
  )
}
