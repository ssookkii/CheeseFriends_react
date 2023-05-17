import React, { useEffect, useState } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal, faDisplay, faUser, faCirclePlay, faDownload, faMobileScreen, faCheese } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import './asset/css/ServiceList.css';

export default function ServiceList() {
    
    const [serviceList, setServiceList] = useState([]);

    const loginInfo = JSON.parse(localStorage.getItem("login"));
    const userId = loginInfo?.id;
    const userAuth = loginInfo?.auth;

    const movePage = useNavigate();

    function writelink() {
        movePage('/cheesefriends/service/ServiceWrite')
    }

    const [bbs, setBbs] = useState();
    let params = useParams();
    
    const bbsData = async(seq) => {
        const response = await axios.get('http://localhost:3000/getAnswer', { params:{"seq":seq} });

        setBbs(response.data);
        console.log(response.data);
    }

    useEffect(() => {
        async function fetchData() {
          const response = await bbsData();
        }
        fetchData();
      }, []);

    const [selectedItem, setSelectedItem] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [answerContent, setAnswerContent] = useState('');

    async function handleItemClick(item) {
      setSelectedItem(item);
      setModalIsOpen(true);
  
      const response = await bbsData(item.seq);
      if (response) {
          setAnswerContent(response.data.answer);
      }
  }

    function closeModal() {
        setSelectedItem(null);
        setModalIsOpen(false);
    }

    function ModalComponent(props) {
        const { selectedItem, closeModal } = props;

        if (!selectedItem) {
            return <div></div>;
        }
        return (
          <Modal isOpen={selectedItem !== null} onRequestClose={closeModal} className='modalcss'>
            {selectedItem.content && <p>Q : {selectedItem.content}</p>}
            {answerContent ? <p> A: {answerContent}</p> : <p className='answercont'>A : 관리자가 답변을 확인중입니다...</p>}
          </Modal>
        );
    }

    const [activeButton, setActiveButton] = useState('');

    function handleButtonClick(buttonName) {
        setActiveButton(buttonName);
    }

        const [frelist, setFreList] = useState([]);

        function getFreBtn() {
            // 백엔드 API 호출
            axios.get(`http://localhost:3000/categorysearch`, {params:{ category:"자주묻는질문"}}) // 카테고리에 따른 API 경로 지정
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
            axios.get(`http://localhost:3000/categorysearch`, {params:{ category:"개인정보"}}) // 카테고리에 따른 API 경로 지정
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
            axios.get(`http://localhost:3000/categorysearch`, {params:{ category:"강의이용"}}) // 카테고리에 따른 API 경로 지정
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
            axios.get(`http://localhost:3000/categorysearch`, {params:{ category:"학습플레이어"}}) // 카테고리에 따른 API 경로 지정
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
            axios.get(`http://localhost:3000/categorysearch`, {params:{ category:"모바일/기타"}}) // 카테고리에 따른 API 경로 지정
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
           <div className='shelterPageWrap'>
           <div style={{width:"247.94px", textAlign:"center", marginTop:"-204px"}}>
                <h2 className='maintitle'>고객센터</h2>
                      { userId != null && (
                        <button type="button" className="learnBtn" style={{marginLeft:"11px", marginTop:"10px"}} onClick={writelink}>
                            글쓰기
                        </button>
                     )} 
              </div>
            </div>
        
    
            {/* 목록 */}
            <div style={{display:"block", width:"1000px", marginTop:"-252px"}}>
    
                <div className='contentwrappers'>
                    <div className='fontWrapper'>
                    <div>
                      <FontAwesomeIcon
                        icon={faMedal}
                        className={`ser1 ${activeButton === 'frelist' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('frelist')}
                      />
                      <p
                        className={`p2 ${activeButton === 'frelist' ? 'active' : ''}`}
                        style={{ marginLeft:"-7px" }}
                      >
                        내가쓴글
                      </p>
                    </div>
                    
                    <div>
                    <FontAwesomeIcon
                      icon={faUser}
                      className={`ser2 ${activeButton === 'infolist' ? 'active' : ''}`}
                      onClick={() => handleButtonClick('infolist')}
                    />
                    <p className={`p2 ${activeButton === 'infolist' ? 'active' : ''}`}
                    style={{ marginLeft:"-10px" }}
                    >개인정보</p>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faDisplay}
                      className={`ser3 ${activeButton === 'useLectList' ? 'active' : ''}`}
                      onClick={() => handleButtonClick('useLectList')}
                    />
                    <p className={`p2 ${activeButton === 'useLectList' ? 'active' : ''}`}
                    style={{ marginLeft:"-2px" }}
                    >강의이용</p>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faCirclePlay}
                      className={`ser4 ${activeButton === 'playlist' ? 'active' : ''}`}
                      onClick={() => handleButtonClick('playlist')}
                    />
                    <p className={`p2 ${activeButton === 'playlist' ? 'active' : ''}`}
                    style={{ marginLeft:"-31px" }}
                    >학습플레이어</p>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faMobileScreen}
                      className={`ser5 ${activeButton === 'mobileli' ? 'active' : ''}`}
                      onClick={() => handleButtonClick('mobileli')}
                    />
                    <p className={`p2 ${activeButton === 'mobileli' ? 'active' : ''}`}
                    style={{ marginLeft:"-30px" }}
                    >모바일/기타</p>
                  </div>

                </div>
                </div> 
            
                <div className='contentwrapper' style={{marginTop:"200px"}}>
                    
                {activeButton === 'frelist' && frelist && frelist.map(function(list) {
        return (
          <ul>
            <li key={list.i} className='serlist'>
              <div className='ptag' style={{ cursor: "pointer" }}>
                <FontAwesomeIcon icon={faCheese} />
                <p onClick={() => handleItemClick(list)}>{list.title}</p>
              </div>
            </li>
          </ul>
        );
      })}

      {activeButton === 'infolist' && infolist && infolist.map(function(list) {
        return (
          <ul>
            <li key={list.i} className='serlist'>
              <div className='ptag' style={{ cursor: "pointer" }}>
                <FontAwesomeIcon icon={faCheese} />
                <p onClick={() => handleItemClick(list)}>{list.title}</p>
              </div>
            </li>
          </ul>
        );
      })}

      {activeButton === 'useLectList' && useLectList && useLectList.map(function(list) {
        return (
          <ul>
            <li key={list.i} className='serlist'>
              <div className='ptag' style={{ cursor: "pointer" }}>
                <FontAwesomeIcon icon={faCheese} />
                <p onClick={() => handleItemClick(list)}>{list.title}</p>
              </div>
            </li>
          </ul>
        );
      })}

      {activeButton === 'playlist' && playlist && playlist.map(function(list) {
        return (
          <ul>
            <li key={list.i} className='serlist'>
              <div className='ptag' style={{ cursor: "pointer" }}>
                <FontAwesomeIcon icon={faCheese} />
                <p onClick={() => handleItemClick(list)}>{list.title}</p>
              </div>
            </li>
          </ul>
        );
      })}

      {activeButton === 'mobileli' && mobileli && mobileli.map(function(list) {
        return (
          <ul>
            <li key={list.i} className='serlist'>
              <div className='ptag' style={{ cursor: "pointer" }}>
                <FontAwesomeIcon icon={faCheese} />
                <p onClick={() => handleItemClick(list)}>{list.title}</p>
              </div>
            </li>
          </ul>
        );
      })}
    
            </div>
                <ModalComponent selectedItem={selectedItem} closeModal={closeModal} />
                
            </div>

        </div>               
         

        );
    }

