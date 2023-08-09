import './App.css';
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { DataObj } from './component/Data/DataObj'
import MainPage from './MainPage';
import Join from './component/AboutLogin/Join';
import { Login } from './component/AboutLogin/Login';

import { Detail } from './component/AboutDetail/Detail';
import { Basket } from './component/AboutDetail/Basket';
import { LikeItem } from './component/AboutDetail/LikeItem';

import { List } from './component/AboutHome/List';

import { Pay } from './component/AboutPay/Pay';
import { Order } from './component/AboutPay/Order';
import { Receipt } from './component/AboutPay/Receipt';


function App() {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [orderList, setOrderList] = useState([]);
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
          <Detail data={data} navigate={navigate} wishlist={wishlist} setWishlist={setWishlist} orderList={orderList} setOrderList={setOrderList} />
        } />
        <Route path='/login' element={
          <Login />
        } />
        <Route path='/join' element={<Join />}>
        </Route>
        <Route path='/likeitem' element={
          <LikeItem orderList={orderList} setOrderList={setOrderList} setWishlist={setWishlist} wishlist={wishlist} />
        } />
        <Route path='/basket' element={
          <Basket orderList={orderList} setOrderList={setOrderList}/>
        }>
          <Route path='receipt' element={
            <Receipt/>
          }/>
          <Route path='pay' element={
            <Pay/>
          }/>
          <Route path='order' element={
            <Order/>
          }/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
