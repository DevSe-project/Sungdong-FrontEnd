import { useState } from 'react';
import styles from './Receipt.module.css'

export function Receipt(){
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const openPopup = (setAddress) => {
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = () => {
        new window.daum.Postcode({
          oncomplete: (data) => {
            setAddress(data);
          }
      }).open();
  }
  document.body.appendChild(script);
}

  return(
    <div>
      <div className={styles.container}>
        <h1 className={styles.headTag}>주문자 정보</h1>
        <form className={styles.form}>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>성함</label>
            </div>
            <div className={styles.input}>
              <input type="text" className={styles.inputSize} placeholder="성함을 입력하세요"/>
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>전화번호</label>
            </div>
            <div className={styles.input}>
              <input type="tel" className={styles.inputSize} placeholder="전화번호를 입력하세요"/>
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>이메일</label>
            </div>
            <div className={styles.input}>
              <input type="email" className={styles.inputSize} placeholder="이메일을 입력하세요"/>
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>주소</label>
            </div>
            <div className={styles.searchResult}>
              <div className={styles.searchAddress}>
                <input 
                  className={styles.inputSize} 
                  type="text" value={address1 && address1.zonecode} 
                  placeholder="우편번호"
                  readOnly
                />
                <input 
                  className={styles.button} 
                  type="button" 
                  onClick={()=>{
                    openPopup(setAddress1);
                  }}
                  value="우편번호 찾기"
                />
              </div>
              <input 
                className={styles.inputSize} 
                type="text" 
                value={address1 && address1.roadAddress}
                placeholder="도로명 주소"
                readOnly
              />
              <input 
                className={styles.inputSize}
                type="text" 
                value={address1 && address1.buildingName ? `(${address1.bname}, ${address1.buildingName})` : address1 && `(${address1.bname}, ${address1.jibunAddress})`}  placeholder="건물 이름 또는 지번 주소"
                readOnly
              />
              <input 
                className={styles.inputSize} 
                type="text" 
                placeholder="상세주소를 입력해주세요."
              />
            </div>
          </div>
        </form>

        <h1 className={styles.headTag}>상품 받으시는 분</h1>
        <form className={styles.form}>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>성함</label>
            </div>
            <div className={styles.input}>
              <input type="text" className={styles.inputSize} placeholder="성함을 입력하세요"/>
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>전화번호</label>
            </div>
            <div className={styles.input}>
              <input type="tel" className={styles.inputSize} placeholder="전화번호를 입력하세요"/>
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>주소</label>
            </div>
            <div className={styles.searchResult}>
              <div className={styles.searchAddress}>
                <input 
                  className={styles.inputSize} 
                  type="text" value={address2 && address2.zonecode} 
                  placeholder="우편번호"
                  readOnly
                />
                <input 
                  className={styles.button} 
                  type="button" 
                  onClick={()=>{
                    openPopup(setAddress2);
                  }}
                  value="우편번호 찾기"
                />
              </div>
              <input 
                className={styles.inputSize} 
                type="text" 
                value={address2 && address2.roadAddress}
                placeholder="도로명 주소"
                readOnly
              />
              <input 
                className={styles.inputSize}
                type="text" 
                value={address2 && address2.buildingName ? `(${address2.bname}, ${address2.buildingName})` : address2 && `(${address2.bname}, ${address2.jibunAddress})`}  placeholder="건물 이름 또는 지번 주소"
                readOnly
              />
              <input 
                className={styles.inputSize} 
                type="text" 
                placeholder="상세주소를 입력해주세요."
              />
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>배송 방식</label>
            </div>
            <div className={styles.input}>
              <input name='delivery' type="radio"/>일반 택배(선불)
              <input name='delivery' type="radio"/>일반 택배(착불)
              <input name='delivery' type="radio"/>화물(선불)
              <input name='delivery' type="radio"/>화물(착불)
              <input name='delivery' type="radio"/>화물 택배(선불)
              <input name='delivery' type="radio"/>화물 택배(착불)
              <input name='delivery' type="radio"/>직접 픽업
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>배송 메세지</label>
            </div>
            <div className={styles.searchResult}>
              <input className={styles.inputSize} type="text" placeholder='택배 기사님께 남길 메세지를 적어주세요'/>
            </div>
          </div>
        </form>

        <h1 className={styles.headTag}>결제 수단</h1>
        <form className={styles.form}>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>쿠폰사용</label>
            </div>
            <div className={styles.input}>
              <input className={styles.inputSize} type="text"/>원 <button className={styles.button}>쿠폰조회 및 적용</button>
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>적립금 사용</label>
            </div>
            <div className={styles.input}>
              <input className={styles.inputSize} type="num" />원 [ 보유 적립금 : ] 
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>결제 방법</label>
            </div>
            <div className={styles.input}>
              <input name='payroute' type="radio"/> 신용카드
              <input name='payroute' type="radio"/> 무통장입금
              <input name='payroute' type="radio"/> 가상계좌
              <input name='payroute' type="radio"/> 계좌이체
              <input name='payroute' type="radio"/> 카카오페이
              <input name='payroute' type="radio"/> 삼성페이
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>증빙서류 발급</label>
            </div>
            <div className={styles.input}>
              <input name='moneyreceipt' type="radio"/> 발행안함
              <input name='moneyreceipt' type="radio"/> 현금영수증
              <input name='moneyreceipt' type="radio"/> 세금계산서
            </div>
          </div>
        </form>
        <div className={styles.formInner}>
        <input required type="checkbox"/> 구매동의 및 결제대행서비스 이용약관 등에 모두 동의합니다.
        <button className={styles.button}>약관보기</button>
        </div>
      </div>
    </div>
  )
}