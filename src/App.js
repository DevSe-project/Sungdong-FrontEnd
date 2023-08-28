import './App.css';
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
// Data 객체들 불러오기
import { OrderObj } from './component/Data/OrderObj';
import { DataObj } from './component/Data/DataObj'
import { TodayTopicPostObj } from './component/Data/TodayTopicPostObj';
import { UserData } from './component/Data/UserData';

// 메인페이지
import MainPage from './MainPage';
import { List } from './component/AboutHome/List';
import { Product } from './component/AboutHome/Product';
import { TodayTopicList } from './component/AboutHome/TodayTopicList';
import { ComewayList } from './component/AboutHome/ComewayList';

// 로그인
import Join from './component/AboutLogin/Join';
import { Login } from './component/AboutLogin/Login';

// 상세보기, 장바구니, 찜하기
import { Detail } from './component/AboutDetail/Detail';
import { Basket } from './component/AboutDetail/Basket';
import { LikeItem } from './component/AboutDetail/LikeItem';

// 주문, 결제, 주문서 작성
import { Pay } from './component/AboutPay/Pay';
import { Order } from './component/AboutPay/Order';
import { Receipt } from './component/AboutPay/Receipt';
import { DeliveryMain } from './component/AboutPay/DeliveryMain';
import { ReviewPage } from './component/AboutPay/ReviewPage';
import { OrderDetail } from './component/AboutPay/OrderDetail';

// 고객서비스 관련
import UserService from './component/AboutAsk/UserService';
import Questions from './component/AboutAsk/Questions';
import EachChat from './component/AboutAsk/EachChat';

// 회사 이벤트 관련
import { Comeway } from './component/AboutCompany/Comeway';
import { TodayNews } from './component/AboutCompany/TodayNews';
import { TodayNewsInner } from './component/AboutCompany/TodayNewsInner';
import { Event } from './component/AboutCompany/Event'

function App() {
  const navigate = useNavigate();
  // 주문 스탭 부분 State
  const [activeTab, setActiveTab] = useState(1); // 현재 활성화된 스탭을 추적하는 State 

  // 데이터 State
  const [data, setData] = useState();
  const [orderData, setOrderData] = useState();
  const [basketList, setBasketList] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [userData, setUserData] = useState();
  const [todayTopicData, setTodayTopicData] = useState();

  // 찜 데이터(캐쉬) 불러오기
  useEffect(() => {
    //localStorage에서 likelist를 파싱 
    const savedWishlist = JSON.parse(localStorage.getItem('likelist')) || []; //localStorage의 likelist가 없으면 공백 배열로 변수 저장
    setWishlist(savedWishlist); //setWishlist라는 State에 저장
  }, []);

  // 데이터 불러오기
  useEffect(() => {
    const dataload = setTimeout(() => {
      setData(DataObj);
      setOrderData(OrderObj);
      setUserData(UserData);
      setTodayTopicData(TodayTopicPostObj);
      return clearTimeout(dataload)
    }, 1500)
  }, [])

  useEffect(() => {
    // 페이지 이동시 항상 스크롤을 최상단으로 이동
    window.scrollTo(0 ,0);
  }, [navigate]); // navigate가 변경될 때마다 실행


  return (
    <div className="App">
      <Routes>
        <Route path='/' element={
          <>
            <MainPage />
            <List data={data}/>
            <TodayTopicList todayTopicData={todayTopicData} setTodayTopicData={setTodayTopicData} />
            <ComewayList/>
          </>
        } />
        
        {/* 상품 */}
        <Route path='/product' element={<Product data={data}/>}/>
        {/* 상세 페이지 */}
        <Route path="/detail/:id" element={
          <Detail setData={setData} data={data} navigate={navigate} wishlist={wishlist} setWishlist={setWishlist} basketList={basketList} setBasketList={setBasketList} setActiveTab={setActiveTab} activeTab={activeTab}
          orderList={orderList} setOrderList={setOrderList} />
        } />
        
        {/* 찜 목록 */}
        <Route path='/likeitem' element={
          <LikeItem basketList={basketList} setBasketList={setBasketList} setWishlist={setWishlist} wishlist={wishlist} />
        } />

        {/* 장바구니 ~ 주문 */}
        <Route path='/basket' element={
          <Basket activeTab={activeTab} setActiveTab={setActiveTab} basketList={basketList} setBasketList={setBasketList} orderList={orderList} setOrderList={setOrderList} />
        }>
          <Route path='receipt' element={<Receipt data={data} activeTab={activeTab} setActiveTab={setActiveTab} orderData={orderData} setOrderData={setOrderData} />} />
          <Route path='pay' element={<Pay activeTab={activeTab} setActiveTab={setActiveTab} orderData={orderData} setOrderData={setOrderData}/>} />
          <Route path='order' element={<Order activeTab={activeTab} setActiveTab={setActiveTab} orderData={orderData} setOrderData={setOrderData}/>} />
        </Route>
        {/* 주문 조회 */}
        <Route path='/delivery' element={<DeliveryMain orderData={orderData} setOrderData={setOrderData}/>} />
        {/* 배송 조회 */}
        <Route path='/orderDetail' element={<OrderDetail/>}/>

        {/* 로그인 */}
        <Route path='/login' element={<Login userData={userData} setUserData={setUserData} />} />
        <Route path='/join' element={<Join userData={userData} setUserData={setUserData}/>} />

        {/* 문의하기 */}
        <Route path='/userservice' element={<UserService/>}>
          <Route path='questions' element={<Questions/>}/>
          <Route path='eachchat' element={<EachChat/>}/>
        </Route>
        {/* 리뷰 작성하기 */}
        <Route path='/review/:id' element={<ReviewPage data={data} setData={setData} />}/>

        {/* 회사 관련 */}
        <Route path='/comeway' element={<Comeway/>}/>
        <Route path='/todayTopic/:page' element={
          <TodayNews todayTopicData={todayTopicData} setTodayTopicData={setTodayTopicData} />}/>
        <Route path='/todayTopicPost/:id' 
        element={<TodayNewsInner todayTopicData={todayTopicData} setTodayTopicData={setTodayTopicData} />}/>
        <Route path='/event' element={<Event/>}/>
      </Routes>
    </div>
  );
}

export default App;
