import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Detail } from './component/Detail';
import { useState } from 'react';
import { DataObj } from './component/DataObj'
import { List } from './component/List';
import { Login } from './component/Login';
import MainPage from './MainPage';
function App() {
  const navigate = useNavigate();
  const [data, setData] = useState(DataObj);
  return (
    <div className="App">


      <Routes>
        <Route path='/' element={
          <>
            <MainPage />
            <List data={data} />
          </>
        } />
        <Route path="/list" element={
          <List data={data} navigate={navigate} />
        } />
        <Route path="/detail/:id" element={
          <Detail data={data} navigate={navigate} />
        } />
        <Route path='/login' element={
          <Login />
        } />
      </Routes>
    </div>
  );
}

export default App;
