import { useNavigate } from 'react-router-dom';
import styles from './OrderDetail.module.css'
import axios from 'axios';
import { GetCookie } from '../../customFn/GetCookie';
import { useDetailData } from '../../store/DataStore';

export function OrderDetail(props){
  const navigate = useNavigate();
  function gotoLink(){
    navigate("/");
  }
  const detailData = useDetailData();
  
  const orderInputValue = [
    { 
      id : 0, 
      title : '성함', 
      value : detailData.order_name,
    },
    { 
      id : 1, 
      title : '전화번호', 
      value : detailData.order_tel,
    },
    { 
      id : 2, 
      title : '주소', 
      value : 
      `${detailData.roadAddress} 
      (${detailData.bname}, 
        ${detailData.buildingName 
      ? detailData.buildingName
      : detailData.jibunAddress})
      ${detailData.addressDetail}` 
    },
    { 
      id : 3, 
      title : '배송방식', 
      value : 
      detailData.deliveryType &&
      detailData.deliveryType === '화물'

      ? detailData.delivery_selectedCor === 'kr.daesin' 
      ? `${detailData && detailData.deliveryType} (배송 업체 : 대신화물)` 
      : `${detailData && detailData.deliveryType} (배송 업체 : 경동화물)`

      : detailData.deliveryType === '성동택배'

      ? `${detailData.deliveryType} 
      (배송 예정일 : ${detailData && new Date(detailData.delivery_date).toLocaleDateString()})`
      : detailData.deliveryType
    },
    { 
      id : 4, 
      title : '배송 메세지', 
      value : detailData.delivery_message,
    },
    { 
      id : 5, 
      title : '성동 메세지', 
      value : detailData.smtMessage,
    },
  ];
  const payInputValue = [
    { 
      id : 0, 
      title : '결제 방법', 
      value : detailData.order_payRoute === '무통장입금' ? `${detailData.order_payRoute} 입금계좌 : ~~ | 입금자명 : ${detailData.order_payName}` : detailData.order_payRoute,
    },
    {
      id : 1, 
      title : '증빙 서류 발급', 
      value : detailData.order_moneyReceipt,
    },
    {
      id: 2,
      title : '명세서',
      value : detailData.printFax === true 
      ? `명세서 실물 발부 + 출력 (FAX : ${detailData.order_faxNum})`
      : `명세서 실물 발부`
    }
  ]
  return(
    <div>
      <div className={styles.container}>
        <h1 className={styles.getInformation}>받으시는 분 정보</h1>
        <form className={styles.form}>
          {/* 주문자 정보 */}
          {detailData ? orderInputValue.map((item, index) => 
          <div key={index} className={styles.formInner}>
            <div className={styles.label}>
              <label>{item.title}</label>
            </div>
            <div className={styles.input}>
              <span>{item.value}</span>
            </div>
          </div>
          )
          : 
          // 스켈레톤 처리
          <div className={styles.colskeleton}>
            <div className={styles.frameskeleton}>
            &nbsp;
            </div>
            <div className={styles.nameskeleton}>
              &nbsp;
            </div>
            <div className={styles.priceskeleton}>
            &nbsp;
            </div>
          </div>
          }
        </form>

      <h1 className={styles.getInformation}>결제 수단</h1>
      <form className={styles.form}>
        {/* 결제 방식 정보 */}
        {detailData ? payInputValue.map((item, index) => 
        <div key={index} className={styles.formInner}>
          <div className={styles.label}>
            <label>{item.title}</label>
          </div>
          <div className={styles.input}>
            <span> {item.value} </span>
          </div>
        </div>
        )
      : 
      // 스켈레톤 처리
        <div className={styles.colskeleton}>
          <div className={styles.frameskeleton}>
          &nbsp;
          </div>
          <div className={styles.nameskeleton}>
            &nbsp;
          </div>
          <div className={styles.priceskeleton}>
          &nbsp;
          </div>
        </div>}
      </form>
      <div>
        <button onClick={()=>gotoLink()} className={styles.button}>홈으로 가기</button>
      </div>
    </div>
  </div>
  )
}