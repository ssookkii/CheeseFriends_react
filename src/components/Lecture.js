import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Lecture() {
  return (
    <div className={styles.app}>
      <Router>
        <Routes>
          <Route path="LectureList" element={<LectureList />} />
          
          <Route path="AbLectureList" element={<AbLectureList />} />
        </Routes>
      </Router>
    </div>
  );
}

export default Lecture;