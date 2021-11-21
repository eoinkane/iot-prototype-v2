import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import TopBar from './TopBar';
import { ViewStaffList, ViewStaffOnSiteList, ViewStaff } from './routes';

const App = () => {
  return (
    <>
      <Router>
        <TopBar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/staff" element={<ViewStaffList />} />
          <Route path="/staff/on-site" element={<ViewStaffOnSiteList />} />
          <Route path="/staff/:staffId" element={<ViewStaff />} />
          <Route path="/*" element={<>404 - Page not found</>} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
