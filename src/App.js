import { firestore } from "./firebase"; // 파이어베이스 데이터베이스 임포트
import './App.css';
import CryptoJS from 'crypto-js';
import { useContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// Data 객체들 불러오기
import { OrderObj } from './component/Data/OrderObj';
import { DataObj } from './component/Data/DataObj'
import { TodayTopicPostObj } from './component/Data/TodayTopicPostObj';
import { UserData } from './component/Data/UserData';
import { CategoryDataObj } from './component/Data/CategoryDataObj';
import { Category } from './component/TemplateLayout/AboutHeader/Category';
import { NoticeObj } from './component/Data/NoticeObj';

// 메인페이지
import MainPage from './MainPage';

// 로그인
import Join from './component/AboutLogin/Join';
import { Login } from './component/AboutLogin/Login';

// 고객서비스 관련
import { Notice } from './component/AboutUserService/Notice';
import { Ask } from './component/AboutUserService/Ask';

// 상세보기, 장바구니, 찜하기
import { Detail } from './component/AboutDetail/Detail';
import { Basket } from './component/AboutDetail/Basket';
import { LikeItem } from './component/AboutDetail/LikeItem';

// 주문, 결제, 주문서 작성
import { Pay } from './component/AboutPay/Pay';
import { Order } from './component/AboutPay/Order';
import { Receipt } from './component/AboutPay/Receipt';
import { DeliveryMain } from './component/AboutPay/DeliveryMain';
import { OrderDetail } from './component/AboutPay/OrderDetail';

// 회사 이벤트 관련
import { Comeway } from './component/AboutCompany/Comeway';
import { TodayNews } from './component/AboutCompany/TodayNews';
import { TodayNewsInner } from './component/AboutCompany/TodayNewsInner';
import { Event } from './component/AboutCompany/Event'
import { AdminMain } from './component/AboutAdmin/AdminMain';
import MyPage from './component/AboutMyPage/MyPage';
import ManageCode from './component/AboutAdmin/Code/ManageCode';

import axios from 'axios';
import UserContext, { UserProvider } from './component/AboutContext/UserContext';
import { AdminDetail } from './component/AboutAdmin/AdminDetail';
import { AdminProductList } from './component/AboutAdmin/AdminProductList';
import { AdminCategory } from './component/AboutAdmin/AdminCategory';
import { AdminCategoryEdit } from './component/AboutAdmin/AdminCategoryEdit';
import { AdminSoldList } from './component/AboutAdmin/AdminSoldList';
import { AdminNotSoldList } from './component/AboutAdmin/AdminNotSoldList';
import { AdminRefund } from './component/AboutAdmin/AdminRefund';
import AdminNotice from './component/AboutAdmin/Notice/AdminNotice';
import AdminContact from './component/AboutAdmin/Contact/AdminContact';
import { TopBanner } from './component/TemplateLayout/AboutHeader/TopBanner';
import { MenuData } from './component/TemplateLayout/AboutMenuData/MenuData';
import { Footer } from './component/TemplateLayout/AboutFooter/Footer';
import { useDataStore, useListStore } from "./store/DataStore";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  // 주문 스탭 부분 State
  const [activeTab, setActiveTab] = useState(1); // 현재 활성화된 스탭을 추적하는 State 

  // 데이터 State 불러오기
  const {
    data, setData, 
    orderData, setOrderData, 
    userData, setUserData, 
    categoryData, setCategoryData
  } = useDataStore();
  // 리스트 State 불러오기
  const {
    orderList, setOrderList,
    basketList, setBasketList,
    wishlist, setWishlist
  } = useListStore();

  const [todayTopicData, setTodayTopicData] = useState();
  const [login, setLogin] = useState(false);
  const [postList, setPostList] = useState([]);

  // 세션 스토리지에서 데이터를 가져와서 복호화(백엔드에서 꽁꽁 숨기기 필요)
  const encryptionKey = 'bigdev2023!';

  // 복호화 함수
  const decryptData = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      const decryptedDataString = bytes.toString(CryptoJS.enc.Utf8);
      // 역직렬화하여 객체로 변환
      const decryptedData = JSON.parse(decryptedDataString);
      return decryptedData;
    } catch (error) {
      console.error('데이터를 복호화 하는데에 실패했습니다:', error);
      return null;
    }
  };
  
  useEffect(() => {
    // 세션 스토리지의 데이터 파싱
    const parseId = JSON.parse(sessionStorage.getItem('saveLoginData'))
    if(parseId){ // 파싱된 데이터가 있으면
      const inLogin = decryptData(parseId);  // 복호화 실행
      if (inLogin) {   //복호화 성공 시
        setLogin(true); //로그인상태유지
        if (data) {   
          const findUser = userData.find((item) => item.id === inLogin.id); // 유저 아이디에 해당하는 데이터 찾기
          if (findUser) {
            // 등급별 할인율 적용
            let newData = data.map((item) => ({ ...item }));
            switch (findUser.grade) {
              case 'D':
                newData = newData.map((item) => ({
                  ...item,
                  discount: 0,
                }));
                break;
              case 'C':
                newData = newData.map((item) => ({
                  ...item,
                  discount: 5,
                }));
                break;
              case 'B':
                newData = newData.map((item) => ({
                  ...item,
                  discount: 10,
                }));
                break;
              case 'A':
                newData = newData.map((item) => ({
                  ...item,
                  discount: 15,
                }));
                break;
              default:
            }
            // 상태 업데이트
            setData(newData);
          } else {
            console.log("사용자를 찾을 수 없습니다.");
          }
        }
      }
    }
  }, [setData, userData, setLogin]);

  // 특정 주소에서만 SessionStorage 사용하기
  useEffect(() => {
    if (
      location.pathname !== '/basket/order' &&
      location.pathname !== '/basket/receipt' &&
      location.pathname !== '/basket/pay' &&
      location.pathname !== '/orderDetail'
    ) {
      sessionStorage.removeItem('orderData');
      sessionStorage.removeItem('newOrderData');
    }
    if (
      location.pathname !== '/category'
    ) {
      sessionStorage.removeItem('category');
      sessionStorage.removeItem('categoryTabState');
      sessionStorage.removeItem('subCategory');
      sessionStorage.removeItem('filterSearch');
      sessionStorage.removeItem('filterSearchBrand');
      sessionStorage.removeItem('filterSearchCode');
      sessionStorage.removeItem('filterSearchOption');
    }
  }, [location])

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
      setCategoryData(CategoryDataObj);
      setPostList(NoticeObj);
    }, 1000)

    return () => clearTimeout(dataload)
  }, [])


  useEffect(() => {
    // 페이지 이동시 항상 스크롤을 최상단으로 이동
    window.scrollTo(0, 0);
  }, [navigate]); // navigate가 변경될 때마다 실행

  const {logout, setIsLogin} = useContext(UserContext);
  // 백엔드 에서 세션 정보 받아오는 코드
  useEffect(() => {
    axios.get(
      "/user/session"
    )
    .then(res => {
      if (res.data.sessionId != null) {
        setIsLogin(true)
      }
    })
    .catch(()=>{setIsLogin(false)})
  }, [])

  // (START) 아이콘 클릭 관련 객체, 함수, state //
  const [iconHovered, setIconHovered] = useState(false);
  const [iconClicked, setIconClicked] = useState(true);
  const [menuClicked, setMenuClicked] = useState(true);
  const iconMouseEnter = () => {
    setIconHovered(true);
  };
  const iconMouseLeave = () => {
    setIconHovered(false);
  };
  const iconOnClick = () => {
    setIconClicked(!iconClicked);
  }
  const menuOnClick = () => {
    setMenuClicked(!menuClicked);
  }
  // 카테고리 변하는 스타일 지정
  const transitionDurate = 350; // 애니메이션 지속 시간(ms)
  const icon_dynamicStyle = {
    transition: `color ${transitionDurate}ms, font-size ${transitionDurate}ms`,
    color: menuClicked ? '#cc0000' : '#000',
    fontSize: menuClicked ? '2.5em' : '2em',
  };
  const text_dynamicStyle = {
    transition: `color ${transitionDurate}ms, font-size ${transitionDurate}ms, font-weight ${transitionDurate}ms`,
    color: iconClicked ? '#6d3535 ' : '#000',
    fontSize: '1.2em',
    fontWeight: iconClicked ? '800' : '600',
  }
  const category_dynamicStyle = {
    transition: `opacity ${transitionDurate}ms, transform ${transitionDurate}ms, height ${transitionDurate}ms`,
    opacity: iconClicked ? 1 : 0,
    height: iconClicked ? '100%' : '0px',
    visibility: iconClicked ? 'visible' : 'hidden',
  }
  const menu_dynamicStyle = {
    transition: `opacity ${transitionDurate}ms, transform ${transitionDurate}ms, height ${transitionDurate}ms`,
    opacity: menuClicked ? 1 : 0,
    visibility: menuClicked ? 'visible' : 'hidden',
  }
  // (END) 아이콘 클릭 관련 객체, 함수, state //

  // 
  return (
    <div className="App">
      <Routes>
        {/* 메인페이지 */}
        <Route path='/' element={
          <>
            <MainPage decryptData={decryptData} login={login} setLogin={setLogin}
              iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} menuOnClick={menuOnClick} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle}
              todayTopicData={todayTopicData} setTodayTopicData={setTodayTopicData} menu_dynamicStyle={menu_dynamicStyle} />
            <div
              className='topButton'
              onClick={() =>
                window.scrollTo({ top: '0', behavior: 'smooth' })}
            >
              <i style={{ color: 'black', fontSize: '1.4em' }} className="fas fa-arrow-up"
              />
            </div>
          </>
        } />

        {/* 상품 카테고리 검색 결과 */}
        <Route path='/category' element={
        <>
          {/* 최상단배너 */}
          <TopBanner
          login={login} setLogin={setLogin} iconHovered={iconHovered} 
          iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} 
          icon_dynamicStyle={icon_dynamicStyle} text_dynamicStyle={text_dynamicStyle} 
          category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
          menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle}/>
          <div className='main'>
            <MenuData login={login} menu_dynamicStyle={menu_dynamicStyle}/>
            <div className='container'>
              <Category decryptData={decryptData} menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} login={login} setLogin={setLogin} navigate={navigate} setActiveTab={setActiveTab} activeTab={activeTab}
              iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
              <footer className='footer'>
                <Footer/>
              </footer>
            </div>
          </div>
        </>
        } />

        {/* 상세 페이지 */}
        <Route path="/detail/:id" element={
          <>
          {/* 최상단배너 */}
          <TopBanner 
          categoryData={categoryData} setCategoryData={setCategoryData} 
          login={login} setLogin={setLogin} iconHovered={iconHovered} 
          iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} 
          icon_dynamicStyle={icon_dynamicStyle} text_dynamicStyle={text_dynamicStyle} 
          category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
          menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle}/>
          <div className='main'>
            <MenuData login={login} menu_dynamicStyle={menu_dynamicStyle}/>
            <div className='container'>
              <Detail decryptData={decryptData} menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} categoryData={categoryData} setCategoryData={setCategoryData} login={login} setLogin={setLogin} setData={setData} data={data} navigate={navigate} wishlist={wishlist} setWishlist={setWishlist} basketList={basketList} setBasketList={setBasketList} setActiveTab={setActiveTab} activeTab={activeTab}
                orderList={orderList} setOrderList={setOrderList} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
              <footer className='footer'>
                <Footer/>
              </footer>
            </div>
          </div>
          </>
        } />

        {/* 찜 목록 */}
        <Route path='/likeitem' element={
          <>
          {/* 최상단배너 */}
          <TopBanner 
          login={login} setLogin={setLogin} iconHovered={iconHovered} 
          iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} 
          icon_dynamicStyle={icon_dynamicStyle} text_dynamicStyle={text_dynamicStyle} 
          category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
          menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle}/>
          <div className='main'>
            <MenuData login={login} menu_dynamicStyle={menu_dynamicStyle}/>
            <div className='container'>
              <LikeItem menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} categoryData={categoryData} setCategoryData={setCategoryData} login={login} setLogin={setLogin} basketList={basketList} setBasketList={setBasketList} setWishlist={setWishlist} wishlist={wishlist} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
              <footer className='footer'>
                <Footer/>
              </footer>
            </div>
          </div>
        </>
        } />

        {/* 장바구니 ~ 주문 */}
        <Route path='/basket' element={
          <>
          {/* 최상단배너 */}
          <TopBanner  
          login={login} setLogin={setLogin} iconHovered={iconHovered} 
          iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} 
          icon_dynamicStyle={icon_dynamicStyle} text_dynamicStyle={text_dynamicStyle} 
          category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
          menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle}/>
          <div className='main'>
            <MenuData login={login} menu_dynamicStyle={menu_dynamicStyle}/>
            <div className='container'>
              <Basket decryptData={decryptData} menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} data={data} setData={setData} categoryData={categoryData} setCategoryData={setCategoryData} login={login} setLogin={setLogin} activeTab={activeTab} setActiveTab={setActiveTab} basketList={basketList} setBasketList={setBasketList} orderList={orderList} setOrderList={setOrderList} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
              <footer className='footer'>
                <Footer/>
              </footer>
            </div>
          </div>
        </>
        }>
          <Route path='receipt' element={<Receipt  decryptData={decryptData} basketList={basketList} setBasketList={setBasketList} orderList={orderList} setOrderList={setOrderList} activeTab={activeTab} setActiveTab={setActiveTab} />} />
          <Route path='pay' element={<Pay activeTab={activeTab} setActiveTab={setActiveTab} />} />
          <Route path='order' element={<Order decryptData={decryptData} activeTab={activeTab} setActiveTab={setActiveTab} />} />
        </Route>

        {/* 주문 조회 */}
        <Route path='/delivery' element={
          <>
          {/* 최상단배너 */}
          <TopBanner
          login={login} setLogin={setLogin} iconHovered={iconHovered} 
          iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} 
          icon_dynamicStyle={icon_dynamicStyle} text_dynamicStyle={text_dynamicStyle} 
          category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
          menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle}/>
          <div className='main'>
            <MenuData login={login} menu_dynamicStyle={menu_dynamicStyle}/>
            <div className='container'>       
              <DeliveryMain  decryptData={decryptData} menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} login={login} setLogin={setLogin} orderData={orderData} setOrderData={setOrderData} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
              <footer className='footer'>
                <Footer/>
              </footer>
            </div>
          </div>
        </>
        } />

        {/* 배송 조회 */}
        <Route path='/orderDetail' element={
          <>
          {/* 최상단배너 */}
          <TopBanner  
          login={login} setLogin={setLogin} iconHovered={iconHovered} 
          iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} 
          icon_dynamicStyle={icon_dynamicStyle} text_dynamicStyle={text_dynamicStyle} 
          category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
          menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle}/>
          <div className='main'>
            <MenuData login={login} menu_dynamicStyle={menu_dynamicStyle}/>
            <div className='container'>
              <OrderDetail  decryptData={decryptData} menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} login={login} setLogin={setLogin} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
              <footer className='footer'>
                <Footer/>
              </footer>
            </div>
          </div>
        </>
        } />

        {/* 로그인 */}
        <Route path='/login' element={<Login/>} />
        <Route path='/join' element={<Join/>} >
        </Route>

        {/* 고객센터 */}
        <Route path='/userservice/notice' element={
          <>
          {/* 최상단배너 */}
          <TopBanner
          login={login} setLogin={setLogin} iconHovered={iconHovered} 
          iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} 
          icon_dynamicStyle={icon_dynamicStyle} text_dynamicStyle={text_dynamicStyle} 
          category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
          menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle}/>
          <div className='main'>
            <MenuData login={login} menu_dynamicStyle={menu_dynamicStyle}/>
            <div className='container'>        
              <Notice decryptData={decryptData} menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} data={data} setData={setData} categoryData={categoryData} setCategoryData={setCategoryData} userData={userData} setUserData={setUserData} login={login} setLogin={setLogin} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
              <footer className='footer'>
                <Footer/>
              </footer>
            </div>
          </div>
        </>
        } />
        <Route path='/userservice/ask' element={<Ask />} />

        {/* 마이페이지 */}
        <Route path='/mypages' element={
          <>
          {/* 최상단배너 */}
          <TopBanner
          categoryData={categoryData} setCategoryData={setCategoryData} 
          login={login} setLogin={setLogin} iconHovered={iconHovered} 
          iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} 
          icon_dynamicStyle={icon_dynamicStyle} text_dynamicStyle={text_dynamicStyle} 
          category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
          menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle}/>
          <div className='main'>
            <MenuData login={login} menu_dynamicStyle={menu_dynamicStyle}/>
            <div className='container'>           
              <MyPage decryptData={decryptData} menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} data={data} setData={setData} categoryData={categoryData} setCategoryData={setCategoryData} userData={userData} setUserData={setUserData} login={login} setLogin={setLogin} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
              <footer className='footer'>
                <Footer/>
              </footer>
            </div>
          </div>
        </>
        }>

        </Route>
        {/* 회사 관련 */}
        <Route path='/comeway' element={
          <>
          {/* 최상단배너 */}
          <TopBanner 
          categoryData={categoryData} setCategoryData={setCategoryData} 
          login={login} setLogin={setLogin} iconHovered={iconHovered} 
          iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} 
          icon_dynamicStyle={icon_dynamicStyle} text_dynamicStyle={text_dynamicStyle} 
          category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
          menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle}/>
          <div className='main'>
            <MenuData login={login} menu_dynamicStyle={menu_dynamicStyle}/>
            <div className='container'>           
              <Comeway decryptData={decryptData} menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} data={data} setData={setData} categoryData={categoryData} setCategoryData={setCategoryData} login={login} setLogin={setLogin} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
              <footer className='footer'>
                <Footer/>
              </footer>
            </div> 
          </div>
        </>
        } />
        {/* 오늘의 뉴스 */}
        <Route path='/todayTopic/:page' element={
          <>
          {/* 최상단배너 */}
          <TopBanner
          categoryData={categoryData} setCategoryData={setCategoryData} 
          login={login} setLogin={setLogin} iconHovered={iconHovered} 
          iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} 
          icon_dynamicStyle={icon_dynamicStyle} text_dynamicStyle={text_dynamicStyle} 
          category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
          menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle}/>
          <div className='main'>
            <MenuData login={login} menu_dynamicStyle={menu_dynamicStyle}/>
            <div className='container'>   
              <TodayNews decryptData={decryptData} menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} data={data} setData={setData} categoryData={categoryData} setCategoryData={setCategoryData} login={login} setLogin={setLogin} todayTopicData={todayTopicData} setTodayTopicData={setTodayTopicData} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
              <footer className='footer'>
                <Footer/>
              </footer>
            </div>
          </div>
        </>
        } />
        <Route path='/todayTopicPost/:id' element={
          <>
            {/* 최상단배너 */}
            <TopBanner 
            categoryData={categoryData} setCategoryData={setCategoryData} 
            login={login} setLogin={setLogin} iconHovered={iconHovered} 
            iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} 
            icon_dynamicStyle={icon_dynamicStyle} text_dynamicStyle={text_dynamicStyle} 
            category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
            menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle}/>
            <div className='main'>
              <MenuData login={login} menu_dynamicStyle={menu_dynamicStyle}/>
              <div className='container'>             
                <TodayNewsInner menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} data={data} setData={setData} categoryData={categoryData} setCategoryData={setCategoryData} login={login} setLogin={setLogin} todayTopicData={todayTopicData} setTodayTopicData={setTodayTopicData} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
                <footer className='footer'>
                  <Footer/>
                </footer>
              </div>
            </div>
          </>  
          } />
        <Route path='/event' element={
          <>
          {/* 최상단배너 */}
          <TopBanner
          categoryData={categoryData} setCategoryData={setCategoryData} 
          login={login} setLogin={setLogin} iconHovered={iconHovered} 
          iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} 
          icon_dynamicStyle={icon_dynamicStyle} text_dynamicStyle={text_dynamicStyle} 
          category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
          menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle}/>
          <div className='main'>
            <MenuData login={login} menu_dynamicStyle={menu_dynamicStyle}/>
            <div className='container'>           
              <Event menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} data={data} setData={setData} categoryData={categoryData} setCategoryData={setCategoryData} login={login} setLogin={setLogin} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} icon_dynamicStyle={icon_dynamicStyle} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
              <footer className='footer'>
                <Footer/>
              </footer>
            </div>
          </div>
        </>
        } />

        {/* 관리자페이지 - 메인 */}
        <Route path='/adminMain' element={<AdminMain />} />
        {/* 관리자페이지 - 코드관리 */}
        <Route path='/adminMain/printCode' element={<ManageCode />}/>
        {/* 관리자페이지 - 고객센터 */}
        <Route path='/adminMain/customerCenter'>
          <Route path='/adminMain/customerCenter/notice'element={<AdminNotice list={postList} setList={setPostList}/>}/>
          <Route path='/adminMain/customerCenter/ask' element={<AdminContact/>}/>
        </Route>
        {/* 관리자페이지 - 상품등록 */}
        <Route path='/adminMain/addProduct' element={<AdminDetail/>} />
        {/* 관리자페이지 - 상품수정 */}
        <Route path='/adminMain/editProduct' element={<AdminProductList data={data}/>}/>
        {/* 관리자페이지 - 카테고리 */}
        <Route path='/adminMain/category' element={<AdminCategory data={data}/>}/>
        {/* 관리자페이지 - 카테고리 수정 */}
        <Route path='/adminMain/categoryEdit/:id' element={<AdminCategoryEdit data={data}/>}/>
        {/* 관리자페이지 - 주문 관리*/}
        <Route path='/adminMain/sold' element={<AdminSoldList data={data} orderData={orderData}/>}/>
        {/* 관리자페이지 - 미결제 주문 관리 */}
        <Route path='/adminMain/yetPay' element={<AdminNotSoldList orderData={orderData} />}/>
        {/* 관리자페이지 - 반품 관리 */}
        <Route path='/adminMain/refund' element={<AdminRefund orderData={orderData}/>}/>
      </Routes>
    </div>
  );
}

export default App;
