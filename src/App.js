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
import { DeliveryMain } from './component/AboutPay/DeliveryMain';
import AskHome from './component/AboutAsk/UserService';
import { OrderObj } from './component/Data/OrderObj';
// 고객서비스 관련
import UserService from './component/AboutAsk/UserService';
import Questions from './component/AboutAsk/Questions';
import EachChat from './component/AboutAsk/EachChat';

function App() {
  const navigate = useNavigate();
  // 주문 스탭 부분
  const [activeTab, setActiveTab] = useState(1); // 현재 활성화된 스탭을 추적하는 State 
  const [data, setData] = useState();
  const [orderData, setOrderData] = useState();
  const [basketList, setBasketList] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {
    //localStorage에서 likelist를 파싱 
    const savedWishlist = JSON.parse(localStorage.getItem('likelist')) || []; //localStorage의 likelist가 없으면 공백 배열로 변수 저장
    setWishlist(savedWishlist); //setWishlist라는 State에 저장
  }, []);
  useEffect(() => {
    const dataload = setTimeout(() => {
      setData(DataObj);
      setOrderData(OrderObj);
      return clearTimeout(dataload)
    }, 3000)
  }, [])

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
          <Detail data={data} navigate={navigate} wishlist={wishlist} setWishlist={setWishlist} basketList={basketList} setBasketList={setBasketList} />
        } />
        <Route path='/likeitem' element={
          <LikeItem basketList={basketList} setBasketList={setBasketList} setWishlist={setWishlist} wishlist={wishlist} />
        } />
        <Route path='/basket' element={
          <Basket activeTab={activeTab} setActiveTab={setActiveTab} basketList={basketList} setBasketList={setBasketList} />
        }>
          <Route path='receipt' element={<Receipt activeTab={activeTab} setActiveTab={setActiveTab} orderData={orderData} setOrderData={setOrderData} />} />
          <Route path='pay' element={<Pay activeTab={activeTab} setActiveTab={setActiveTab} orderData={orderData} setOrderData={setOrderData}/>} />
          <Route path='order' element={<Order activeTab={activeTab} setActiveTab={setActiveTab} orderData={orderData} setOrderData={setOrderData}/>} />
        </Route>
        <Route path='/delivery' element={<DeliveryMain />} />
        
        {/* 로그인 */}
        <Route path='/login' element={<Login />} />
        <Route path='/join' element={<Join />} />

        {/* 문의하기 */}
        <Route path='/userservice' element={<UserService/>}>
          <Route path='questions' element={<Questions/>}/>
          <Route path='eachchat' element={<EachChat/>}/>
          </Route>
      </Routes>
    </div>
  );
}

export default App;
