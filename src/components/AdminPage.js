import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MapSearch from './MapSearch';
import EduAdd from './EduAdd';
import EduManage from './EduManage'
import EduUpdate from './EduUpdate';

function AdminPage() {
    return (
    <div>
    <BrowserRouter>
        <nav>
        <Link to="/eduAdd">학원등록</Link> 
        <Link to="/edumanage">홈</Link>
        </nav>

        <Routes>
        <Route path="/MapSearch" element={ <MapSearch/>} />
        <Route path="/eduAdd" element={ <EduAdd/>} />
        <Route path="/edumanage" element={ <EduManage/>} />
        <Route path="/eduupdate/:eduCode" exact element={<EduUpdate />} />

        </Routes>

    </BrowserRouter>
    </div>
);
}

export default AdminPage;