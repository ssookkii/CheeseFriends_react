import React, { useEffect, useState } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal, faDisplay, faUser, faCirclePlay, faDownload, faMobileScreen, faCheese } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import './asset/css/ServiceList.css';

export default function ServiceList() {
    
    const [serviceList, setServiceList] = useState([]);

    const movePage = useNavigate();

    function leclist() {
        movePage('/lecture');
    }
    function learnlist() {
        movePage('/learning');
    }

    function infolist() {
        movePage('/learning/EduInfoList');
    }

    function serviceWrite() {
        movePage('/service/ServiceWrite');
    }

    function service(){
        movePage('/service/ServiceList');
    }

    function getServiceList() {
        axios.get("http://localhost:3000/serviceList")
        .then(function(resp){
            setServiceList(resp.data);
            console.log(resp.data);
            
        })
        .catch(function(err){
            // alert(err);
        })

    }
    useEffect(function(){
        getServiceList(0);
    },[]);

    const [subList, setSubList] = useState([]);
    const [choice, setChoice] = useState('');
    const [search, setSearch] = useState('');

    //paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);
 
    function getSubList(){
        axios.get("http://localhost:3000/categorysearch/1")
        .then(function(resp) {
            // 데이터가 있을 경우에만 subList 상태를 업데이트
            if (resp.data.list) {
                setSubList(resp.data.list);
            }
        })
        .catch(function(err){
            alert(err);
        })
    }

    useEffect(function(){
        getSubList("", "", 0);
    }, []);

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

    function ModalComponent(props) {
        const { selectedItem, closeModal } = props;

        if (!selectedItem) {
            return <div></div>;
        }
        return (
          <Modal isOpen={selectedItem !== null} onRequestClose={closeModal} className='modalcss'>
            <p>{selectedItem.content}</p>
          </Modal>
        );
    }

    
    return (
        <div style={{display:"flex", marginTop:"116px", marginLeft:"100px"}} className='eduinfolist'>
            <div style={{width:"280px", height:"630px", borderRadius:"16px"}}>
                <a href="/" style={{color:"black", textDecoration:"none"}}>
                    <h1 className='eduinfotitle'>고객센터</h1>
                </a>
     
                <div className="dropdown">
                    <button type="button" className="eduwritebtn" onClick={serviceWrite} style={{width:"248px"}}>
                        작성하기
                    </button>
                </div>
            </div>
        
    
            {/* 목록 */}
            <div style={{display:"block", width:"1000px", marginTop:"25px"}}>
                <div className='navwrapper'>
                <div className='eduinfonav-1' onClick={leclist} ><h3>인강 학습실</h3></div>
                    <div className='eduinfonav-1' onClick={learnlist} ><h3>학습용 자료실</h3></div>
                    <div className='eduinfonav-2' onClick={infolist} ><h3>교육 정보</h3></div>
                    <div className='eduinfonav-3' onClick={service}><h3>고객센터</h3></div>
                </div>
                <div className='contentwrapper'>
                    <div className='fontWrapper'>
                        <div>
                            <FontAwesomeIcon icon={faMedal} className='ser' />
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faUser} className='ser' />
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faDisplay} className='ser'/>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faCirclePlay}className='ser'  />
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faDownload} className='ser' />
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faMobileScreen}className='ser' />
                        </div>
                    </div>
                </div>

                <hr className='servhr'/>            
            
                <div className='contentwrapper'>
                {subList && subList.map(function(list, i){
                return (
                    <ul>
                    <li key={list.i} className='serlist'>
                        <div className='ptag'>
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

