import React, {useEffect} from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

function PrivateRoutes(){
    const loginData = JSON.parse(localStorage.getItem("login"));

    const navigate = useNavigate();
    
    useEffect(() => {
        if(loginData === null || loginData.auth !== 'admin') {
            alert("관리자 계정으로 로그인해주십시오");
            navigate("/admin");
        }
    }, [loginData, navigate]);

    
    
    return (
        <>
        {loginData && loginData.auth === "admin" ? <Outlet/> : <Navigate to='/admin' replace />}
        </>
    )
}

export default PrivateRoutes;
