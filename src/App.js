import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Detail } from './component/Detail';
import { useEffect, useState } from 'react';
import { DataObj } from './component/DataObj'
import { List } from './component/List';
import { Login } from './component/Login';
import MainPage from './MainPage';
import { Basket } from './component/Basket';
import { LikeItem } from './component/LikeItem';
function App() {
  const navigate = useNavigate();
  const [data, setData] = useState();
  useEffect(()=>{
    const dataload = setTimeout(()=>{
      setData(DataObj);
      return clearTimeout(dataload)
    },3000)
  },[])
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
        <Route path='/basket' element={
          <Basket />
        } />
        <Route path='/likeitem' element={
          <LikeItem />
        } />
      </Routes>
    </div>
  );
}

export default App;
