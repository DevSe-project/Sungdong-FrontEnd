import { useEffect, useState } from "react";
import styles from './Step.module.css'
import { useOrderData, useOrderList } from "../../Store/DataStore";
import { Outlet, useNavigate } from 'react-router-dom';
import { StepModule } from "./StepModule";

export function OrderStep({activeTab}){
    const orderList = useOrderList();
    const orderData = useOrderData();

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
                    <p>상품 표준가 : <span className={styles.price}>\{(item.product_price).toLocaleString()}</span></p>
                    </div>
                </td>
                <td>{item.cnt}</td>
                <td className={styles.price}>
                    {item.product_discount
                    ?
                    <>
                    <span style={{color: 'red', fontWeight: '750'}}>
                    ({item.product_discount}%)
                    </span>
                    &nbsp;<i className="fal fa-long-arrow-right"/>&nbsp;
                    {parseInt(item.product_price * item.cnt - (((item.product_price/100)*item.product_discount)*item.cnt)).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                    </>
                    : `${(item.product_price * item.cnt).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
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
                        sum + ((item.product_price * item.cnt) - (((item.product_price / 100) * item.product_discount) * item.cnt))
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
                            sum + ((item.product_price * item.cnt) - (((item.product_price / 100) * item.product_discount) * item.cnt))
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