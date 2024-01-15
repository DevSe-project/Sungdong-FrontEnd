import { db } from "./firebase"; // 파이어베이스 데이터베이스 임포트
import './App.css';
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Data 객체들 불러오기
import { OrderObj } from './component/Data/OrderObj';
import { TodayTopicPostObj } from './component/Data/TodayTopicPostObj';
import { UserDataObj } from './component/Data/UserDataObj';
import { CategoryDataObj } from './component/Data/CategoryDataObj';
import { Category } from './component/TemplateLayout/AboutHeader/Category';

// 메인페이지
import MainPage from './MainPage';

// 로그인
import Join from './component/AboutLogin/Join';
import { Login } from './component/AboutLogin/Login';

// 고객서비스 관련
import { Notice } from './component/AboutUserService/Notice';
import { Contact } from './component/AboutUserService/Contact';

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
import { AdminMain } from './component/AboutAdmin/Main/AdminMain';
import MyPage from './component/AboutMyPage/MyPage';
import ManageCode from './component/AboutAdmin/ManageCode/ManageCode';

// 관리자 관련
import { AdminDetail } from './component/AboutAdmin/Detail/AdminDetail';
import { AdminProductList } from './component/AboutAdmin/Product/AdminProductList';
import { AdminCategory } from './component/AboutAdmin/Category/AdminCategory';
import { AdminCategoryEdit } from './component/AboutAdmin/Category/AdminCategoryEdit';
import { AdminSoldList } from './component/AboutAdmin/Sold/AdminSoldList';
import { AdminNotSoldList } from './component/AboutAdmin/Sold/AdminNotSoldList';
import { AdminRefund } from './component/AboutAdmin/Refund/AdminRefund';
import AdminNotice from './component/AboutAdmin/Notice/AdminNotice';
import DeliveryManagement from "./component/AboutAdmin/SD_Delivery/State_M/DeliveryManagement";
import TotalCal_Manage from "./component/AboutAdmin/SD_Account/TotalCal_Manage";
import CMSaccount_Manage from "./component/AboutAdmin/SD_Account/CMSaccount_Manage";

// 템플릿 컴포넌트
import { TopBanner } from './component/TemplateLayout/AboutHeader/TopBanner';
import { MenuData } from './component/TemplateLayout/AboutMenuData/MenuData';
import { Footer } from './component/TemplateLayout/AboutFooter/Footer';

// State Management (Zustand) Store
import { useUserData, useDataActions, useListActions, useOrderData, useIsLogin, useSetLogin } from "./Store/DataStore";
import { useQuery } from "@tanstack/react-query";
import { getDocs, collection } from 'firebase/firestore'
import { AccountBook } from "./component/AboutMyPage/AccountBook/AccountBook";
import { DepositHistory } from "./component/AboutMyPage/AccountBook/DepositHistory";
import Manage_Users from "./component/AboutAdmin/Users/Manage_Users";
import { EstimateBox } from "./component/AboutEstimate/EstimateBox";
import { EstimateManager } from "./component/AboutEstimate/EstimateManager";
import { TackBackRequest } from "./component/AboutTakeBack/TakeBackRequest";
import { TakeBackList } from "./component/AboutTakeBack/TakeBackList";
import { ErrorTrade } from "./component/AboutTakeBack/ErrorTradeRequest";
import { ErrorTradeList } from "./component/AboutTakeBack/ErrorTradeList";
import { AdminEditDetail } from "./component/AboutAdmin/Detail/AdminEditDetail";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  // 주문 스탭 부분 State
  const [activeTab, setActiveTab] = useState(1); // 현재 활성화된 스탭을 추적하는 State 

  // 데이터액션 State 불러오기
  const { setOrderData, setUserData, setCategoryData, setTodayTopicData } = useDataActions();

  // 상품 데이터 State
  const userData = useUserData();
  const orderData = useOrderData();
  const isLogin = useIsLogin();

  const { setLogin } = useSetLogin();
  // 리스트 State 불러오기
  const { setWishList, setPostList } = useListActions();

  //데이터 fetch
  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, 'ProductData')); // 'ProductData'는 컬렉션 이름
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  };

  //카테고리 데이터 fetch
  const fetchCategoryData = async () => {
    const querySnapshot = await getDocs(collection(db, 'CategoryData')); // 'ProductData'는 컬렉션 이름
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  };

  //딜리버리 데이터 fetch
  const fetchDeliveryData = async () => {
    const querySnapshot = await getDocs(collection(db, 'DeliveryData')); // 'ProductData'는 컬렉션 이름
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  };
  
  //주문 데이터 fetch
  const fetchOrderData = async () => {
    const querySnapshot = await getDocs(collection(db, 'OrderData')); // 'ProductData'는 컬렉션 이름
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  };

  //반품 데이터 fetch
  const fetchRefundData = async () => {
    const querySnapshot = await getDocs(collection(db, 'RefundData')); // 'ProductData'는 컬렉션 이름
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), rae_id: doc.id }));
  };
  

  // react-query : 서버에서 받아온 데이터 캐싱, 변수에 저장
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ['data'],
    queryFn: () => fetchData()
  });

    // react-query : 서버에서 받아온 데이터 캐싱, 변수에 저장
    const { data:categoryData } = useQuery({
      queryKey: ['category'],
      queryFn: () => fetchCategoryData()
    });

    // react-query : 서버에서 받아온 데이터 캐싱, 변수에 저장
    const { data:deliveryData } = useQuery({
      queryKey: ['delivery'],
      queryFn: () => fetchDeliveryData()
    });

    const { data:orderedData } = useQuery({
      queryKey: ['ordered'],
      queryFn: () => fetchOrderData()
    });

    const { data:refundData } = useQuery({
      queryKey: ['refund'],
      queryFn: () => fetchRefundData()
    })

  // -----UserData fetch
  const fetchUserData = async () => {
    const querySnapshot = await getDocs(collection(db, 'UserData'));
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  };

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUserData()
  });
  // -----UserData fetch

  useEffect(() => {
    if (isLogin === false) {
      // 세션 스토리지의 데이터 파싱
      const inLogin = JSON.parse(sessionStorage.getItem('saveLoginData'));
      if (inLogin) {
        setLogin(true); //로그인상태유지
      } else {
        console.log("사용자를 찾을 수 없습니다.");
      }
    }
  }, []);

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
    const savedwishList = JSON.parse(localStorage.getItem('likelist')) || []; //localStorage의 likelist가 없으면 공백 배열로 변수 저장
    setWishList(savedwishList); //setWishList라는 State에 저장
  }, [setWishList]);



  // 데이터 불러오기
  useEffect(() => {
    const dataload = setTimeout(() => {
      setOrderData(OrderObj);
      setUserData(UserDataObj);
      setTodayTopicData(TodayTopicPostObj);
      setCategoryData(CategoryDataObj);
    }, 1000)

    return () => clearTimeout(dataload)
  }, [setOrderData, setUserData, setTodayTopicData, setCategoryData])


  useEffect(() => {
    // 페이지 이동시 항상 스크롤을 최상단으로 이동
    window.scrollTo(0, 0);
  }, [navigate]); // navigate가 변경될 때마다 실행

  // const {logout, setIsLogin} = useContext(UserContext);
  // // 백엔드 에서 세션 정보 받아오는 코드
  // useEffect(() => {
  //   axios.get(
  //     "/user/session"
  //   )
  //   .then(res => {
  //     if (res.data.sessionId != null) {
  //       setIsLogin(true)
  //     }
  //   })
  //   .catch(()=>{setIsLogin(false)})
  // }, [])

  // 이 부분 zustand State화 시켜줘
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
  const text_dynamicStyle = {
    transition: `color ${transitionDurate}ms, font-size ${transitionDurate}ms, font-weight ${transitionDurate}ms`,
    color: iconClicked ? '#6d3535 ' : '#000',
    fontSize: '1.1em',
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

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }
  // setData(query);
  return (
    <div className="App">
      <Routes>
        {/* 메인페이지 */}
        <Route path='/' element={
          <>
            <MainPage
              iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              category_dynamicStyle={category_dynamicStyle} menuOnClick={menuOnClick} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle} />
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
              iconHovered={iconHovered}
              iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              text_dynamicStyle={text_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
              menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} />
            <div className='main'>
              <MenuData menu_dynamicStyle={menu_dynamicStyle} />
              <div className='container'>
                <Category menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} navigate={navigate} setActiveTab={setActiveTab} activeTab={activeTab}
                  iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
                <footer className='footer'>
                  <Footer />
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
              iconHovered={iconHovered}
              iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              text_dynamicStyle={text_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
              menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} />
            <div className='main'>
              <MenuData menu_dynamicStyle={menu_dynamicStyle} />
              <div className='container'>
                <Detail menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} navigate={navigate} setActiveTab={setActiveTab} activeTab={activeTab}
                  iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
                <footer className='footer'>
                  <Footer />
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
              iconHovered={iconHovered}
              iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              text_dynamicStyle={text_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
              menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} />
            <div className='main'>
              <MenuData menu_dynamicStyle={menu_dynamicStyle} />
              <div className='container'>
                <LikeItem menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
                <footer className='footer'>
                  <Footer />
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
              iconHovered={iconHovered}
              iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              text_dynamicStyle={text_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
              menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} />
            <div className='main'>
              <MenuData menu_dynamicStyle={menu_dynamicStyle} />
              <div className='container'>
                <Basket menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} activeTab={activeTab} setActiveTab={setActiveTab} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>
        }>
          <Route path='receipt' element={<Receipt activeTab={activeTab} setActiveTab={setActiveTab} />} />
          <Route path='pay' element={<Pay activeTab={activeTab} setActiveTab={setActiveTab} />} />
          <Route path='order' element={<Order activeTab={activeTab} setActiveTab={setActiveTab} />} />
        </Route>

        {/* 주문 조회 */}
        <Route path='/delivery' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              iconHovered={iconHovered}
              iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              text_dynamicStyle={text_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
              menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} />
            <div className='main'>
              <MenuData menu_dynamicStyle={menu_dynamicStyle} />
              <div className='container'>
                <DeliveryMain menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
                <footer className='footer'>
                  <Footer />
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
              iconHovered={iconHovered}
              iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              text_dynamicStyle={text_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
              menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} />
            <div className='main'>
              <MenuData menu_dynamicStyle={menu_dynamicStyle} />
              <div className='container'>
                <OrderDetail menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>
        } />

        {/* 로그인 */}
        <Route path='/login' element={<Login />} />
        <Route path='/join' element={<Join />} >
        </Route>

        {/* 고객센터 */}
        <Route path='/userservice/notice' element={<Notice />} />
        <Route path='/userservice/contact' element={<Contact />} />

        {/* 마이페이지 */}
        <Route path='/mypages' element={<MyPage menu_dynamicStyle={menu_dynamicStyle} />} />
        <Route path='/accountBook' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              iconHovered={iconHovered}
              iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              text_dynamicStyle={text_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
              menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} />
            <div className='main'>
              <MenuData menu_dynamicStyle={menu_dynamicStyle} />
              <div className='container'>
                <AccountBook />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>} />
        <Route path='/depositHistory' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              iconHovered={iconHovered}
              iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              text_dynamicStyle={text_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
              menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} />
            <div className='main'>
              <MenuData menu_dynamicStyle={menu_dynamicStyle} />
              <div className='container'>
                <DepositHistory />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
            </>}/>

        <Route path='/estimateBox' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              iconHovered={iconHovered}
              iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              text_dynamicStyle={text_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
              menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} />
            <div className='main'>
              <MenuData menu_dynamicStyle={menu_dynamicStyle} />
              <div className='container'>
                <EstimateBox />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
            </>}/>

        <Route path='/estimateManager' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              iconHovered={iconHovered}
              iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              text_dynamicStyle={text_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
              menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} />
            <div className='main'>
              <MenuData menu_dynamicStyle={menu_dynamicStyle} />
              <div className='container'>
                <EstimateManager />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
            </>}/>
        
        {/* 반품 관련 */}
        {/* 반품 신청 */}
        <Route path='/return/request' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              iconHovered={iconHovered}
              iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              text_dynamicStyle={text_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
              menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} />
            <div className='main'>
              <MenuData menu_dynamicStyle={menu_dynamicStyle} />
              <div className='container'>
                <TackBackRequest />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
            </>}/>

        {/* 반품조회 */}
        <Route path='/return/list' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              iconHovered={iconHovered}
              iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              text_dynamicStyle={text_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
              menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} />
            <div className='main'>
              <MenuData menu_dynamicStyle={menu_dynamicStyle} />
              <div className='container'>
                <TakeBackList />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
            </>}/>

        {/* 불량 교환 관련 */}
        <Route path='/error/request' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              iconHovered={iconHovered}
              iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              text_dynamicStyle={text_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
              menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} />
            <div className='main'>
              <MenuData menu_dynamicStyle={menu_dynamicStyle} />
              <div className='container'>
                <ErrorTrade/>
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
            </>}/>
        <Route path='/error/list' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              iconHovered={iconHovered}
              iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              text_dynamicStyle={text_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
              menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} />
            <div className='main'>
              <MenuData menu_dynamicStyle={menu_dynamicStyle} />
              <div className='container'>
                <ErrorTradeList />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
            </>}/>

        {/* 회사 관련 */}
        <Route path='/comeway' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              iconHovered={iconHovered}
              iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              text_dynamicStyle={text_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
              menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} />
            <div className='main'>
              <MenuData menu_dynamicStyle={menu_dynamicStyle} />
              <div className='container'>
                <Comeway menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
                <footer className='footer'>
                  <Footer />
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
              iconHovered={iconHovered}
              iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              text_dynamicStyle={text_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
              menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} />
            <div className='main'>
              <MenuData menu_dynamicStyle={menu_dynamicStyle} />
              <div className='container'>
                <TodayNews menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>
        } />
        <Route path='/todayTopicPost/:id' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              iconHovered={iconHovered}
              iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              text_dynamicStyle={text_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
              menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} />
            <div className='main'>
              <MenuData menu_dynamicStyle={menu_dynamicStyle} />
              <div className='container'>
                <TodayNewsInner menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>
        } />
        <Route path='/event' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              iconHovered={iconHovered}
              iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave}
              text_dynamicStyle={text_dynamicStyle}
              category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick}
              menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} />
            <div className='main'>
              <MenuData menu_dynamicStyle={menu_dynamicStyle} />
              <div className='container'>
                <Event menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} iconHovered={iconHovered} iconMouseEnter={iconMouseEnter} iconMouseLeave={iconMouseLeave} category_dynamicStyle={category_dynamicStyle} iconOnClick={iconOnClick} text_dynamicStyle={text_dynamicStyle} />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>
        } />

        {/* 관리자페이지 - 메인 */}
        <Route path='/adminMain' element={<AdminMain />} />

        {/* 상품관리 - 상품등록 */}
        <Route path='/adminMain/addProduct' element={<AdminDetail />} />
        {/* 상품관리 - 상품조회 */}
        <Route path='/adminMain/searchProduct' element={<AdminProductList />} />
        {/* 상품관리 - 상품수정 */}
        <Route path='/adminMain/editProduct/:id' element={<AdminEditDetail />} />
        {/* 상품관리 - 카테고리 */}
        <Route path='/adminMain/category' element={<AdminCategory data={data} />} />
        {/* 상품관리 - 카테고리 수정 */}
        <Route path='/adminMain/categoryEdit/:id' element={<AdminCategoryEdit data={data} />} />

        {/* 주문관리 - 주문 관리*/}
        <Route path='/adminMain/sold' element={<AdminSoldList data={data} orderData={orderedData} />} />
        {/* 주문관리 - 미결제 주문 관리 */}
        <Route path='/adminMain/yetPay' element={<AdminNotSoldList orderData={orderedData} />} />
        {/* 주문관리 - 반품 관리 */}
        <Route path='/adminMain/refund' element={<AdminRefund orderData={orderedData} />} />

        {/* 배송관리 - 배송 상태 관리 */}
        <Route path='/adminMain/SD_delivery/DeliveryManager' element={<DeliveryManagement />}/> 

        {/* 정산관리 - 누적정산 */}
        <Route path='/adminMain/SD_account/total' element={<TotalCal_Manage />} />
        {/* 정산관리 - CMS정산 */}
        <Route path='/adminMain/SD_account/cms' element={<CMSaccount_Manage />} />

        {/* 고객센터 - 공지사항 */}
        <Route path='/adminMain/customerCenter/notice' element={<AdminNotice />} />

        {/* 회원관리 - 고객관리 */}
        <Route path='/adminMain/user' element={<Manage_Users />} />
        {/* 회원관리 - 회원가입 코드 관리 */}
        <Route path='/adminMain/printCode' element={<ManageCode />} />
        
      </Routes>
    </div>
  );
}
