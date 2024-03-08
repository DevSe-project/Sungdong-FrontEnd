import { useEffect, useState } from "react";
import styles from './Step.module.css'
import { useListActions, useOrderData, useOrderList } from "../../store/DataStore";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { StepModule } from "./StepModule";

export function OrderStep({setActiveTab, activeTab}){
    const orderList = useOrderList();
    const orderData = useOrderData();
    const navigate = useNavigate();
    const location = useLocation();
    const {setOrderList} = useListActions();

    // 배송가
    const delivery = 3000;

    const [openDeliveryModal, setOpenDeliveryModal] = useState(true);
    // 일정 시간 후 팝업 닫음
    useEffect(()=> {
        const opentime = setInterval(() => {
        setOpenDeliveryModal((prev) => !prev)
        }, 1000)

        return () => clearInterval(opentime)
    }, [])

    //새로고침 전 경고
    useEffect(() => {
        const handleBeforeUnload = (e) => {
        e.preventDefault();
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // 장바구니 탭 - 결제 탭에서 뒤로가기 시 뒤로가기 방지 후 장바구니 탭으로 이동
    useEffect(() => {
        const handleBack = (e) => {
        e.preventDefault();
        const isConfirmed = 
        window.confirm(`주문서 작성 및 결제 중 뒤로가기 시 결제 정보가 초기화 됩니다. \n계속하시겠습니까?`)
        if(isConfirmed){
            setActiveTab(1);
            navigate('/basket');
        }
        };
        window.history.pushState(null, null, window.location.href);
        window.addEventListener('popstate', handleBack);

        return () => {
        window.removeEventListener('popstate', handleBack);
        };
    }, [navigate]);

    useEffect(() => {
        if (
        location.pathname !== '/orderStep/order' &&
        location.pathname !== '/orderStep/receipt' &&
        location.pathname !== '/orderStep/pay'
        ) {
        // 필요한 상태 초기화 로직을 여기에 추가
            setActiveTab(1);
            setOrderList([]);
            window.location.reload();
        }
    }, [location]);

    return(
    <div className={styles.body}>
        <StepModule activeTab={activeTab}/>
        {/* 팝업 띄우기 */}
        <div style={{display: 'block', height: '2em', width: '50%'}}>
            {openDeliveryModal &&
            <h5 style={{
            visibility: openDeliveryModal ? 'visible' : 'hidden', 
            color: '#CC0000',
            height: openDeliveryModal ? 'auto' : 0,
            overflow: 'hidden',
            }}>오후 12시 이전 주문 건 당일 배송, 오후 12시 이후 주문 건 익일 배송</h5>}
        </div>
        {activeTab===3 ? <h3>고객님께서 결제하실 상품정보입니다.</h3>
        : activeTab===4 && <h3>다음 상품을 준비하여 고객님께 보내드리겠습니다.</h3>}
        
        {/* 주문 정보 테이블 */}
        <table className={styles.table}>
        <thead>
            <tr>
            <th>상품 이미지</th>
            <th className={styles.name}>상품 정보</th>
            <th>수량</th>
            <th>공급 가격</th>
            </tr>
        </thead>
        <tbody>
        {activeTab === 2
        ? orderList && 
        orderList.map((item, key)=> (
            <tr key={key}>
                <td><img className={styles.thumnail} src={item.product_image_original} alt='이미지'/></td>
                <td>
                    <h5 className={styles.link}>
                    {item.product_title}</h5>
                    <div>
                    {item.cart_selectedOption && `옵션 : ${item.cart_selectedOption}`}
                    <p>상품 표준가 : <span className={styles.price}>\{parseInt(item.cart_price).toLocaleString()}</span></p>
                    </div>
                </td>
                <td>{item.cart_cnt}</td>
                <td className={styles.price}>
                    {item.cart_discount
                    ?
                    <>
                    <span style={{color: 'red', fontWeight: '750'}}>
                    ({parseFloat(item.cart_discount)}%)
                    </span>
                    &nbsp;<i className="fal fa-arrow-right"/>&nbsp;
                    {parseInt(item.cart_price * item.cart_cnt).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                    </>
                    : `${(item.cart_price * item.cart_cnt).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
                </td>
            </tr>
        ))
        :
        // 주문후 주문 데이터들로 나열함(수정 불가)
        activeTab > 2 &&
        orderData.length > 0 && 
        orderData.map((item, key)=> (
        <tr key={key}>
            <td><img className={styles.thumnail} src={item.product_image_original} alt='이미지'/></td>
            <td>
            <h5 className={styles.link}>
                {item.product_title}</h5>
            <div>
            {item.selectedOption && `옵션 : ${item.selectedOption}`}
            </div>
            </td>
            <td>{item.order_cnt}</td>
            <td className={styles.price}>
            {parseInt(item.order_productPrice).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
            </td>
        </tr>
        ))}
        </tbody>
    </table>
        <div className={styles.finalCalculate}>
            <div className={styles.finalContainer}>
                <div className={styles.finalBox}>
                <h2 style={{display:"flex", alignItems: 'center'}}>
                    총 상품 공급가
                </h2>
                <div className={styles.price}>
                    <h5>
                    \{
                    orderList.length > 0 ?
                    orderList.reduce((sum, item) => //reduce 사용하여 배열 객체의 합계 계산, 0으로 초기화
                    sum + ((item.cart_price * item.cart_cnt))
                    , 0).toLocaleString()
                    : 0
                    }
                    </h5>
                </div>
                </div>
                <i className="fal fa-plus"></i>
                <div className={styles.finalBox}>
                <h2>배송비</h2>
                <div className={styles.price}>
                    <h5>\{delivery ? delivery.toLocaleString() : 0}</h5>
                </div>
                </div>
                <i className="fal fa-equals"></i>
                <div className={styles.finalBox}>
                    <h2>최종 결제 금액</h2>
                    <div className={styles.price}>
                        <h5>\{
                            orderList.length > 0 ?
                            orderList.reduce((sum, item) => //reduce 함수사용하여 배열 객체의 합계 계산, delivery값으로 sum을 초기화
                            sum + ((item.cart_price * item.cart_cnt))
                            , delivery).toLocaleString()
                            : 0
                            }
                        </h5>
                    </div>
                </div>
            </div>
        </div>
        {/* Outlet부분 (스탭 2,3,4) */}
        <Outlet></Outlet>
    </div>
    )
}