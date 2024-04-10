import './App.css';
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Data 객체들 불러오기
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
import { Order } from './component/AboutPay/Order';
import { Receipt } from './component/AboutPay/Receipt';
import { DeliveryMain } from './component/AboutPay/DeliveryMain';
import { OrderDetail } from './component/AboutPay/OrderDetail';

// 회사 이벤트 관련
import { Comeway } from './component/AboutCompany/Comeway';
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
import AdminDoneUser from './component/AboutAdmin/Users/AdminDoneUser';
import AdminHoldUser from './component/AboutAdmin/Users/AdminHoldUser';
import AdminNotice from './component/AboutAdmin/Notice/AdminNotice';
import DeliList from "./component/AboutAdmin/SD_Delivery/List/DeliList";
import TotalCalManage from "./component/AboutAdmin/SD_Account/TOTAL/Manage/TotalCalManage";
import CMSaccountManage from "./component/AboutAdmin/SD_Account/CMS/Manage/CMSaccountManage";

// 템플릿 컴포넌트
import { TopBanner } from './component/TemplateLayout/AboutHeader/TopBanner';
import { MenuData } from './component/TemplateLayout/AboutMenuData/MenuData';
import { Footer } from './component/TemplateLayout/AboutFooter/Footer';

// State Management (Zustand) Store
import { useListActions, useModalState } from "./store/DataStore";
import { useQuery } from "@tanstack/react-query";
import { AccountBook } from "./component/AboutMyPage/AccountBook/AccountBook";
import { DepositHistory } from "./component/AboutMyPage/AccountBook/DepositHistory";
import { EstimateBox } from "./component/AboutEstimate/EstimateBox";
import { EstimateManager } from "./component/AboutEstimate/EstimateManager";
import { TackBackRequest } from "./component/AboutTakeBack/TakeBackRequest";
import { TakeBackList } from "./component/AboutTakeBack/TakeBackList";
import { AdminEditDetail } from "./component/AboutAdmin/Detail/AdminEditDetail";
import axios from "./axios";
import { OrderStep } from "./component/AboutPay/OrderStep";
import { EstimateWrite } from "./component/AboutEstimate/EstimateWrite";
import EstimatePrint from "./component/AboutEstimate/EstimatePrint";
import { useFetch } from "./customFn/useFetch";
import { AdminSearch } from './component/AboutAdmin/Search/AdminSearch';
import { AdminMainModule } from './component/AboutAdmin/Main/AdminMainModule';
import { AdminEventManage } from './component/AboutAdmin/Event/AdminEventManage';
import { AdminEventCreator } from './component/AboutAdmin/Event/AdminEventCreator';
import { AdminEventEditor } from './component/AboutAdmin/Event/AdminEventEditor';
import { InvoiceStatement } from './component/AboutPay/InvoiceStatement';


export default function App() {
  const navigate = useNavigate();
  // 주문 스탭 부분 State
  const [activeTab, setActiveTab] = useState(1); // 주문 - 현재 활성화된 스탭을 추적하는 State 

  // 찜 리스트 State 불러오기
  const { setWishList } = useListActions();

  //FETCH CUSTOM HOOK
  const { fetchServer, fetchGetServer } = useFetch();

  //상품 페이지 State
  const [productCurrentPage, setProductCurrentPage] = useState(1);
  const [productTotalPage, setProductTotalPage] = useState(1);

  //데이터 fetch
  const fetchData = async () => {
    const data = await fetchGetServer('/product/list', 1);
    setProductCurrentPage(data.currentPage);
    setProductTotalPage(data.totalPages);
    return data.data
  };

  //카테고리 데이터 fetch
  const fetchCategoryData = async () => {
    try {
      const response = await axios.get("/category/list",
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      )
      // 성공 시 추가된 상품 정보를 반환합니다.
      return response.data.data;
    } catch (error) {
      // 실패 시 예외를 throw합니다.
      throw new Error('확인 중 오류가 발생했습니다.');
    }
  };

  // react-query : 서버에서 받아온 데이터 캐싱, 변수에 저장 - 상품 데이터
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ['data'],
    queryFn: () => fetchData()
  });

  // react-query : 서버에서 받아온 데이터 캐싱, 변수에 저장 - 카테고리 데이터
  const { data: categoryData } = useQuery({
    queryKey: ['category'],
    queryFn: () => fetchCategoryData()
  });

  // 찜 데이터(캐쉬) 불러오기
  useEffect(() => {
    //localStorage에서 likelist를 파싱 
    const savedwishList = JSON.parse(localStorage.getItem('likelist')) || []; //localStorage의 likelist가 없으면 공백 배열로 변수 저장
    setWishList(savedwishList); //setWishList라는 State에 저장
  }, [setWishList]);


  useEffect(() => {
    // 페이지 이동시 항상 스크롤을 최상단으로 이동
    window.scrollTo(0, 0);
  }, [navigate]); // navigate가 변경될 때마다 실행


  // 이 부분 zustand State화 시켜줘
  // (START) 아이콘 클릭 관련 객체, 함수, state //
  const { isModal, modalName } = useModalState();
  const [menuClicked, setMenuClicked] = useState(true);
  const menuOnClick = () => {
    setMenuClicked(!menuClicked);
  }
  // 카테고리 변하는 스타일 지정
  const transitionDurate = 350; // 애니메이션 지속 시간(ms)
  const text_dynamicStyle = {
    transition: `color ${transitionDurate}ms, font-size ${transitionDurate}ms, font-weight ${transitionDurate}ms`,
    color: isModal ? '#6d3535 ' : '#000',
    fontSize: '1.1em',
    fontWeight: isModal ? '800' : '600',
  }
  const category_dynamicStyle = {
    transition: `opacity ${transitionDurate}ms, transform ${transitionDurate}ms, height ${transitionDurate}ms`,
    opacity: isModal ? 1 : 0,
    height: isModal ? '100%' : '0px',
    visibility: isModal ? 'visible' : 'hidden',
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
  return (
    <div className="App">
      <Routes>
        {/* 메인페이지 */}
        <Route path='/' element={
          <>
            <MainPage
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
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
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
              <div className='container'>
                <Category
                  menuOnClick={menuOnClick}
                  menu_dynamicStyle={menu_dynamicStyle}
                  navigate={navigate}
                  setActiveTab={setActiveTab}
                  activeTab={activeTab}
                  category_dynamicStyle={category_dynamicStyle}
                  text_dynamicStyle={text_dynamicStyle} />
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
            <TopBanner
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
              <div className='container'>
                <Detail
                  navigate={navigate}
                  setActiveTab={setActiveTab}
                  activeTab={activeTab} />
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
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
              <div className='container'>
                <LikeItem menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} category_dynamicStyle={category_dynamicStyle} text_dynamicStyle={text_dynamicStyle} />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>
        } />
        <Route path='/invoic' element={
          <InvoiceStatement />
        } />

        {/* 장바구니 */}
        <Route path='/basket' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
              <div className='container'>
                <Basket menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} activeTab={activeTab} setActiveTab={setActiveTab} category_dynamicStyle={category_dynamicStyle} text_dynamicStyle={text_dynamicStyle} />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>
        } />

        <Route path='/orderStep' element={
          <>
            {/* 최상단배너 */}
            <TopBanner />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
              <div className='container'>
                <OrderStep menuOnClick={menuOnClick} menu_dynamicStyle={menu_dynamicStyle} activeTab={activeTab} setActiveTab={setActiveTab} category_dynamicStyle={category_dynamicStyle} text_dynamicStyle={text_dynamicStyle} />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>
        }>
          <Route path='receipt' element={<Receipt activeTab={activeTab} setActiveTab={setActiveTab} />} />
          <Route path='order' element={<Order activeTab={activeTab} setActiveTab={setActiveTab} />} />
        </Route>

        {/* 주문 조회 */}
        <Route path='/delivery' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
              <div className='container'>
                <DeliveryMain />
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
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
              <div className='container'>
                <OrderDetail />
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
        <Route path='/userservice/notice' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
              <div className='container'>
                <Notice />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>
        } />
        <Route path='/userservice/contact' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
              <div className='container'>
                <Contact />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>
        } />

        {/* 마이페이지 */}
        <Route path='/mypages' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
              <div className='container'>
                <MyPage />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>} />
        <Route path='/accountBook' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
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
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
              <div className='container'>
                <DepositHistory />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>} />

        <Route path='/estimateBox' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
              <div className='container'>
                <EstimateBox />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>} />

        <Route path='/estimateWrite' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
              <div className='container'>
                <EstimateWrite />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>} />

        <Route path='/estimateManager' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
              <div className='container'>
                <EstimateManager />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>} />

        <Route path='/estimatePrint' element={
          <EstimatePrint />
        } />

        {/* 반품 관련 */}
        {/* 반품 신청 */}
        <Route path='/return/request' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
              <div className='container'>
                <TackBackRequest />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>} />

        {/* 반품조회 */}
        <Route path='/return/list' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
              <div className='container'>
                <TakeBackList />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>} />

        {/* 회사 관련 */}
        <Route path='/comeway' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <MenuData />
              <div className='container'>
                <Comeway />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>
        } />
        {/* 오늘의 뉴스
        <Route path='/todayTopic/:page' element={
          <>
            {/* 최상단배너 */}
        {/* <TopBanner
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
              <div className='container'>
                <TodayNews />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </> */}
        {/* } />}
        {/* <Route path='/todayTopicPost/:id' element={
          <>
            {/* 최상단배너 */}
        {/* <TopBanner
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <MenuData />
              <div className='container'>
                <TodayNewsInner />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div> */}
        {/* </> */}
        {/* } /> */}
        <Route path='/event' element={
          <>
            {/* 최상단배너 */}
            <TopBanner
              category_dynamicStyle={category_dynamicStyle}
              menuOnClick={menuOnClick}
              text_dynamicStyle={text_dynamicStyle}
              menu_dynamicStyle={menu_dynamicStyle}
            />
            <div className='main'>
              <div style={{ float: 'left' }}>
                <MenuData />
              </div>
              <div className='container'>
                <Event />
                <footer className='footer'>
                  <Footer />
                </footer>
              </div>
            </div>
          </>
        } />

        {/* 관리자 Main Route */}
        <Route path='/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj' element={<AdminMain />}>
          {/* 메인 모듈페이지 */}
          <Route path='main' element={<AdminMainModule />} />
          {/* 상품관리 - 상품등록 */}
          <Route path='addProduct' element={<AdminDetail />} />
          {/* 상품관리 - 상품조회 */}
          <Route path='searchProduct' element={<AdminProductList productCurrentPage={productCurrentPage} productTotalPage={productTotalPage} />} />
          {/* 상품관리 - 상품수정 */}
          <Route path='editProduct/:id' element={<AdminEditDetail />} />
          {/* 상품관리 - 카테고리 */}
          <Route path='category' element={<AdminCategory productCurrentPage={productCurrentPage} productTotalPage={productTotalPage} />} />
          {/* 상품관리 - 카테고리 수정 */}
          <Route path='categoryEdit/:id' element={<AdminCategoryEdit />} />

          {/* 주문관리 - 주문 관리*/}
          <Route path='sold' element={<AdminSoldList />} />
          {/* 주문관리 - 미결제 주문 관리 */}
          <Route path='yetPay' element={<AdminNotSoldList />} />
          {/* 주문관리 - 반품 관리 */}
          <Route path='refund' element={<AdminRefund />} />
          {/* 주문검색 - 검색결과 */}
          <Route path='search' element={<AdminSearch />} />

          {/* 배송관리 - 배송 상태 관리 */}
          <Route path='SD_delivery/Delivery' element={<DeliList />} />

          {/* 정산관리 - 누적정산 */}
          <Route path='SD_account/total' element={<TotalCalManage />} />
          {/* 정산관리 - CMS정산 */}
          <Route path='SD_account/cms' element={<CMSaccountManage />} />

          {/* 고객센터 - 공지사항 */}
          <Route path='customerCenter/notice' element={<AdminNotice />} />
          <Route path='event' element={<AdminEventManage />} />
          <Route path='event/create' element={<AdminEventCreator />} />
          <Route path='event/edit/:id' element={<AdminEventEditor />} />

          {/* 회원관리 - 고객관리 */}
          <Route path='doneusers' element={<AdminDoneUser />} />
          <Route path='holdusers' element={<AdminHoldUser />} />
          {/* 회원관리 - 회원가입 코드 관리 */}
          <Route path='printCode' element={<ManageCode />} />
        </Route>


      </Routes>
    </div>
  );
}
