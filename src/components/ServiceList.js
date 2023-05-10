import React, { useEffect, useState } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal, faDisplay, faUser, faCirclePlay, faDownload, faMobileScreen, faCheese } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import './asset/css/ServiceList.css';

export default function ServiceList() {
    
    const [serviceList, setServiceList] = useState([]);
    const [seq, setSeq] = useState('');
    const movePage = useNavigate();

    function writelink() {
        movePage('/cheesefriends/service/ServiceWrite')
    }

    const [bbs, setBbs] = useState();
    let params = useParams();
    
    const bbsData = async(seq) => {
        const response = await axios.get('http://localhost:3000/getService', { params:{"seq":seq} });

        setBbs(response.data);
    }

    useEffect(() => {
        async function fetchData() {
          const response = await bbsData();
        }
        fetchData();
      }, []);

    const [selectedItem, setSelectedItem] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    function handleItemClick(item) {
        setSelectedItem(item);
        setModalIsOpen(true);
    }

    function closeModal() {
        setSelectedItem(null);
        setModalIsOpen(false);
    }
    function answerbtn() {
        movePage(`/cheesefriends/service/ServiceAnswer/${seq}`);
    }

    function ModalComponent(props) {
        const { selectedItem, closeModal } = props;

        if (!selectedItem) {
            return <div></div>;
        }
        return (
          <Modal isOpen={selectedItem !== null} onRequestClose={closeModal} className='modalcss'>
            <p>{selectedItem.content}</p>
            <div style={{marginTop:"348px", marginLeft:"420px"}}>
                <button type="button" className='answerbtn' onClick={answerbtn}>답글달기</button>
            </div>
          </Modal>

        );
    }

        const [frelist, setFreList] = useState([]);

        function getFreBtn() {
            // 백엔드 API 호출
            axios.get(`http://localhost:3000/categorysearch`, {params:{ category:"frequently"}}) // 카테고리에 따른 API 경로 지정
            .then(response => {
                //setBbsList(response.data.bbslist); // 백엔드에서 받은 데이터 설정
                setFreList(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
        }

        useEffect(function(){
            getFreBtn("","", 0);
        }, []);


        const [infolist, setInfoList] = useState([]);
        function getInfoBtn() {
            axios.get(`http://localhost:3000/categorysearch`, {params:{ category:"userInfo"}}) // 카테고리에 따른 API 경로 지정
            .then(response => {
                setInfoList(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
        }
        useEffect(function(){
            getInfoBtn("","", 0);
        }, []);

        const [useLectList, setUseLectList] = useState([]);
        function getLecBtn() {
            axios.get(`http://localhost:3000/categorysearch`, {params:{ category:"useLect"}}) // 카테고리에 따른 API 경로 지정
            .then(response => {
                console.log(response.data);
                setUseLectList(response.data);
            })
            .catch(error => {
                console.error(error);
            });
        }
        
        useEffect(function(){
            getLecBtn("","", 0);
        }, []);
    


        const [playlist, setPlayList] = useState([]);
        function getPlayBtn() {
            axios.get(`http://localhost:3000/categorysearch`, {params:{ category:"player"}}) // 카테고리에 따른 API 경로 지정
            .then(response => {
                setPlayList(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
        }

        useEffect(function(){
            getPlayBtn("","", 0);
        }, []);

        const [mobileli, setMobileLi] = useState([]);
        function mobileBtn() {
            axios.get(`http://localhost:3000/categorysearch`, {params:{ category:"mobile"}}) // 카테고리에 따른 API 경로 지정
            .then(response => {
                setMobileLi(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
        }

        useEffect(function(){
            mobileBtn("","", 0);
        }, []);


    return (
        <div className="servicelist">
            <div style={{marginTop:"-627PX"}}>
                <h2 className='servh2'>고객센터</h2>
                <div style={{width:"250px"}}>
                    {/* {userAuth === 'teacher' && ( */}
                        <button type="button" className="learnBtn" style={{marginLeft:"11px"}} onClick={writelink}>
                            글쓰기
                        </button>
                    {/* )} */}
                </div>
            </div>
        
    
            {/* 목록 */}
            <div style={{display:"block", width:"1000px", marginTop:"-230px"}}>
    
                <div className='contentwrapper'>
                    <div className='fontWrapper'>
                        <div>
                            <FontAwesomeIcon icon={faMedal} className='ser' onClick={getFreBtn}/>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faUser} className='ser' onClick={getInfoBtn} />
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faDisplay} className='ser' onClick={getLecBtn}/>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faCirclePlay}className='ser' onClick={getPlayBtn} />
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faMobileScreen}className='ser' onClick={mobileBtn} />
                        </div>
                    </div>
                </div>

                <hr className='servhr'/>            
            
                <div className='contentwrapper'>
                    
                {frelist && frelist.map(function(list){
                return (
                    <ul>
                    <li key={list.i} className='serlist'>
                        <div className='ptag' style={{cursor:"pointer"}}>
                        <FontAwesomeIcon icon={faCheese} />
                        <p onClick={() => handleItemClick(list)}>{list.title}</p>
                        </div>
                    </li>
                    </ul>
                )
                })}

                {infolist && infolist.map(function(list){
                return (
                    <ul>
                    <li key={list.i} className='serlist'>
                        <div className='ptag' style={{cursor:"pointer"}}>
                        <FontAwesomeIcon icon={faCheese} />
                        <p onClick={() => handleItemClick(list)}>{list.title}</p>
                        </div>
                    </li>
                    </ul>
                )
                })}

                {useLectList && useLectList.map(function(list){
                return (
                    <ul>
                    <li key={list.i} className='serlist'>
                        <div className='ptag' style={{cursor:"pointer"}}>
                        <FontAwesomeIcon icon={faCheese} />
                        <p onClick={() => handleItemClick(list)}>{list.title}</p>
                        </div>
                    </li>
                    </ul>
                )

                })}

                {playlist && playlist.map(function(list){
                return (
                    <ul>
                    <li key={list.i} className='serlist'>
                        <div className='ptag' style={{cursor:"pointer"}}>
                        <FontAwesomeIcon icon={faCheese} />
                        <p onClick={() => handleItemClick(list)}>{list.title}</p>
                        </div>
                    </li>
                    </ul>
                )
                })}
                    {mobileli && mobileli.map(function(list){
                return (
                    <ul>
                    <li key={list.i} className='serlist'>
                        <div className='ptag' style={{cursor:"pointer"}}>
                        <FontAwesomeIcon icon={faCheese} />
                        <p onClick={() => handleItemClick(list)}>{list.title}</p>
                        </div>
                    </li>
                    </ul>
                )
                })}
                    
            </div>
                <ModalComponent selectedItem={selectedItem} closeModal={closeModal} />
                
            </div>

        </div>               
         

        );
    }

