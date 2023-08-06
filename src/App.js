import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Detail } from './component/Detail';
import { useEffect, useState } from 'react';
import { DataObj } from './component/Data/DataObj'
import { List } from './component/List';
import { Login } from './component/Login';
import MainPage from './MainPage';
import { Basket } from './component/Basket';
import { LikeItem } from './component/LikeItem';
import Join from './component/Join';
function App() {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {
    //localStorage에서 likelist를 파싱 
    const savedWishlist = JSON.parse(localStorage.getItem('likelist')) || []; //localStorage의 likelist가 없으면 공백 배열로 변수 저장
    setWishlist(savedWishlist); //setWishlist라는 State에 저장
  }, []);
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
            <MainPage/>
            <List data={data} />
          </>
        } />
        <Route path="/list" element={
          <List data={data} navigate={navigate} />
        } />
        <Route path="/detail/:id" element={
          <Detail data={data} navigate={navigate} wishlist={wishlist} setWishlist={setWishlist} />
        } />
        <Route path='/login' element={
          <Login />
        } />
        <Route path='/join' element={
          <Join />
        }/>
        <Route path='/basket' element={
          <Basket />
        } />
        <Route path='/likeitem' element={
          <LikeItem setWishlist={setWishlist} wishlist={wishlist} />
        } />
      </Routes>
    </div>
  );
}

export default App;
