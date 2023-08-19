import { useState } from 'react';
import styles from './Receipt.module.css'
import { useNavigate } from 'react-router-dom';

export function Receipt({orderData, setOrderData, activeTab, setActiveTab}){
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  // 다음(카카오) 주소찾기 API 기능
  const openPopup = (setAddress) => {
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = () => {
        new window.daum.Postcode({
          oncomplete: (data) => {
            setAddress(data);
            setDeliveryInformation(prevdata=>
              ({
                ...prevdata,
                address : {
                  ...prevdata.address,
                  address : data,
                }
              }))
          }
      }).open();
  }
  document.body.appendChild(script);
}
  const [orderInformation, setOrderInformation] = useState([{
    name : "",
    tel : "",
    email : "",
    payRoute : "",
    moneyReceipt : "",
  }])
  const [deliveryInformation, setDeliveryInformation] = useState([{
    name : "",
    tel : "",
    address : {
      address : "",
      addressDetail : "",
    },
    deliveryType : "",
    deliveryMessage : "",
  }])
  // submit 버튼
  function gotoLink(){
    if(activeTab===2) {
      setOrderData(prevdata => ({
        ...prevdata,
        order : orderInformation,
        delivery : deliveryInformation,
      }))
      setActiveTab(3);
      navigate("/basket/pay");
    }
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
              <input 
              type="text" 
              className={styles.inputSize}
              placeholder="성함을 입력하세요"
              value={orderInformation.name} 
              onChange={(e)=>setOrderInformation(
                prevdata=> ({
                  ...prevdata,
                  name : e.target.value,
                })
              )}
              />
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>전화번호</label>
            </div>
            <div className={styles.input}>
              <input 
              type="tel" 
              className={styles.inputSize} 
              placeholder="전화번호를 입력하세요"
              value={orderInformation.tel} 
              onChange={(e)=>setOrderInformation(
                prevdata=> ({
                  ...prevdata,
                  tel : e.target.value,
                })
              )}
              />
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>이메일</label>
            </div>
            <div className={styles.input}>
              <input 
              type="email" 
              className={styles.inputSize} 
              placeholder="이메일을 입력하세요"
              value={orderInformation.email} 
              onChange={(e)=>setOrderInformation(
                prevdata=> ({
                  ...prevdata,
                  email : e.target.value,
                })
              )}
              />
            </div>
          </div>
        </form>

        <h1 className={styles.headTag}>배송지 정보</h1>
        <form className={styles.form}>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>성함</label>
            </div>
            <div className={styles.input}>
              <input 
              type="text" 
              className={styles.inputSize} 
              placeholder="성함을 입력하세요"
              value={deliveryInformation.name} 
              onChange={(e)=>setDeliveryInformation(
                prevdata=> ({
                  ...prevdata,
                  name : e.target.value,
                })
              )}
              />
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>전화번호</label>
            </div>
            <div className={styles.input}>
              <input 
              type="tel"
              className={styles.inputSize} 
              placeholder="전화번호를 입력하세요"
              value={deliveryInformation.tel} 
              onChange={(e)=>setDeliveryInformation(
                prevdata=> ({
                  ...prevdata,
                  tel : e.target.value,
                })
              )}
              />
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
                  type="text" value={address && address.zonecode} 
                  placeholder="우편번호"
                  readOnly
                />
                <input 
                  className={styles.button} 
                  type="button" 
                  onClick={()=>{
                    openPopup(setAddress);
                  }}
                  value="우편번호 찾기"
                />
              </div>
              <input 
                className={styles.inputSize} 
                type="text" 
                value={address && address.roadAddress}
                placeholder="도로명 주소"
                readOnly
              />
              <input 
                className={styles.inputSize}
                type="text" 
                value={address && address.buildingName ? `(${address.bname}, ${address.buildingName})` : address && `(${address.bname}, ${address.jibunAddress})`}  
                placeholder="건물 이름 또는 지번 주소"
                readOnly
              />
              <input 
              className={styles.inputSize} 
              type="text" 
              placeholder="상세주소를 입력해주세요."
              value={deliveryInformation.addressDetail} 
              onChange={(e)=>setDeliveryInformation(
                prevdata=> ({
                  ...prevdata,
                  address : {
                    ...prevdata.address,
                    addressDetail : e.target.value,
                  },
                })
              )}
              />
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>배송 방식</label>
            </div>
            <div className={styles.input}>
              <input 
              name='delivery' 
              value="일반택배(선불)" 
              checked={deliveryInformation.deliveryType === '일반택배(선불)'} 
              type="radio"
              onChange={(e)=>
                setDeliveryInformation(prevdata=>
                  ({
                      ...prevdata,
                      deliveryType : e.target.value, 
                  })
                )
              }
              />
              일반 택배(선불)
              <input 
              name='delivery' 
              value="일반택배(착불)" 
              checked={deliveryInformation.deliveryType === '일반택배(착불)'} 
              type="radio"
              onChange={(e)=>
                setDeliveryInformation(prevdata=>
                  ({
                    ...prevdata,
                    deliveryType : e.target.value, 
                  })
                )
              }
              />
              일반 택배(착불)
              <input 
              name='delivery' 
              value="화물(선불)" 
              checked={deliveryInformation.deliveryType === '화물(선불)'} 
              type="radio"
              onChange={(e)=>
                setDeliveryInformation(prevdata=>
                  ({
                    ...prevdata,
                    deliveryType : e.target.value, 
                  })
                )
              }
              />
              화물(선불)
              <input 
              name='delivery' 
              value="화물(착불)" 
              checked={deliveryInformation.deliveryType === '화물(착불)'} 
              type="radio"
              onChange={(e)=>
                setDeliveryInformation(prevdata=>
                  ({
                    ...prevdata,
                    deliveryType : e.target.value, 
                  })
                )
              }
              />
              화물(착불)
              <input 
              name='delivery' 
              value="화물택배(선불)" 
              checked={deliveryInformation.deliveryType === '화물택배(선불)'} 
              type="radio"
              onChange={(e)=>
                setDeliveryInformation(prevdata=>
                  ({
                    ...prevdata,
                    deliveryType : e.target.value, 
                  })
                )
              }
              />
              화물 택배(선불)
              <input 
              name='delivery' 
              value="화물택배(착불)" 
              checked={deliveryInformation.deliveryType === '화물택배(착불)'} 
              type="radio"
              onChange={(e)=>
                setDeliveryInformation(prevdata=>
                  ({
                    ...prevdata,
                    deliveryType : e.target.value, 
                  })
                )
              }
              />
              화물 택배(착불)
              <input 
              name='delivery' 
              value="직접픽업" 
              checked={deliveryInformation.deliveryType === '직접픽업'} 
              type="radio"
              onChange={(e)=>
                setDeliveryInformation(prevdata=>
                  ({
                    ...prevdata,
                    deliveryType : e.target.value, 
                  })
                )
              }
              />
              직접 픽업
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>배송 메세지</label>
            </div>
            <div className={styles.searchResult}>
              <input 
              className={styles.inputSize} 
              type="text" 
              placeholder='택배 기사님께 남길 메세지를 적어주세요'
              onChange={(e)=>setDeliveryInformation(
                prevdata=> ({
                  ...prevdata,
                  deliveryMessage : e.target.value,
                })
              )}
              />
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
              <input 
              className={styles.inputSize} 
              type="text"
              readOnly
              />원 
              <button className={styles.button}>
                쿠폰조회 및 적용
              </button>
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>적립금 사용</label>
            </div>
            <div className={styles.input}>
              <input 
              className={styles.inputSize} 
              type="num" 
              />원 
              [ 보유 적립금 : ] 
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>결제 방법</label>
            </div>
            <div className={styles.input}>
              <input 
              name='payroute' 
              type="radio"
              value="신용카드"
              checked={orderInformation.payRoute === '신용카드'} 
              onChange={(e)=>setOrderInformation(
                prevdata=> ({
                  ...prevdata,
                  payRoute : e.target.value,
                })
              )}
              />
              신용카드
              <input 
              name='payroute' 
              type="radio"
              value="무통장입금"
              checked={orderInformation.payRoute === '무통장입금'} 
              onChange={(e)=>setOrderInformation(
                prevdata=> ({
                  ...prevdata,
                  payRoute : e.target.value,
                })
              )}
              />
              무통장입금
              <input 
              name='payroute' 
              type="radio"
              value="가상계좌"
              checked={orderInformation.payRoute === '가상계좌'} 
              onChange={(e)=>setOrderInformation(
                prevdata=> ({
                  ...prevdata,
                  payRoute : e.target.value,
                })
              )}
              />
              가상계좌
              <input 
              name='payroute' 
              type="radio"
              value="계좌이체"
              checked={orderInformation.payRoute === '계좌이체'} 
              onChange={(e)=>setOrderInformation(
                prevdata=> ({
                  ...prevdata,
                  payRoute : e.target.value,
                })
              )}
              />
              계좌이체
              <input 
              name='payroute' 
              type="radio"
              value="카카오페이"
              checked={orderInformation.payRoute === '카카오페이'} 
              onChange={(e)=>setOrderInformation(
                prevdata=> ({
                  ...prevdata,
                  payRoute : e.target.value,
                })
              )}
              />
              카카오페이
              <input 
              name='payroute' 
              type="radio"
              value="삼성페이"
              checked={orderInformation.payRoute === '삼성페이'} 
              onChange={(e)=>setOrderInformation(
                prevdata=> ({
                  ...prevdata,
                  payRoute : e.target.value,
                })
              )}
              />
              삼성페이
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>증빙서류 발급</label>
            </div>
            <div className={styles.input}>
              <input 
              name='moneyreceipt' 
              type="radio"
              value="발행안함"
              checked={orderInformation.moneyReceipt === '발행안함'} 
              onChange={(e)=>setOrderInformation(
                prevdata=> ({
                  ...prevdata,
                  moneyReceipt : e.target.value,
                })
              )}
              /> 발행안함
              <input 
              name='moneyreceipt' 
              type="radio"
              value="현금영수증"
              checked={orderInformation.moneyReceipt === '현금영수증'} 
              onChange={(e)=>setOrderInformation(
                prevdata=> ({
                  ...prevdata,
                  moneyReceipt : e.target.value,
                })
              )}
              /> 현금영수증
              <input 
              name='moneyreceipt' 
              type="radio"
              value="세금계산서"
              checked={orderInformation.moneyReceipt === '세금계산서'} 
              onChange={(e)=>setOrderInformation(
                prevdata=> ({
                  ...prevdata,
                  moneyReceipt : e.target.value,
                })
              )}
              /> 세금계산서
            </div>
          </div>
        </form>
        <div className={styles.formInner}>
          <input required type="checkbox"/> 구매동의 및 결제대행서비스 이용약관 등에 모두 동의합니다.
          <button className={styles.button}>약관보기</button>
        </div>
        <div>
          <button onClick={()=>gotoLink()} className={styles.submitButton}>결제하기</button>
        </div>
      </div>
    </div>
  )
}