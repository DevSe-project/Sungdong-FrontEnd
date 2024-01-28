import { useEffect, useState } from 'react';
import styles from './Receipt.module.css'
import { useNavigate } from 'react-router-dom';
import { useDeliveryInfo, useOrderActions, useOrderInfo, useOrderList, useUserData } from '../../Store/DataStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { GetCookie } from '../../customFn/GetCookie';


export function Receipt(props){
  const navigate = useNavigate();

  const userData = useUserData();
  const orderList = useOrderList();

  const queryClient = useQueryClient();

  //주문 목록 추가 요청 함수
  const orderTo = async (orderData) => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.post("/order", 
        JSON.stringify(orderData),
        {
          headers : {
            "Content-Type" : "application/json",
            'Authorization': `Bearer ${token}`,
          }
        }
      )
      // 성공 시 추가된 상품 정보를 반환합니다.
      return response.data;
    } catch (error) {
      // 실패 시 예외를 throw합니다.
      throw new Error('상품을 주문 목록에 요청하던 중 오류가 발생했습니다.');
    }
  };
  //재고 감소 요청
  const lowSupply = async (filteredData) => {
    try {
      const response = await axios.put(`/data/supply`, 
        JSON.stringify(filteredData),
        {
          headers : {
            "Content-Type" : "application/json",
          }
        }
      )
      // 성공 시 추가된 상품 정보를 반환합니다.
      return response.data;
    } catch (error) {
      // 실패 시 예외를 throw합니다.
      throw new Error('재고를 변경하던 중 오류가 발생했습니다.');
    }
  };
  //데이터 재고 감소 요청 함수
  const { mutate:supplyMutation } = useMutation({mutationFn: lowSupply})


  //주문 신청 함수
  const { mutate:orderMutation } = useMutation({mutationFn: orderTo})


  // 데이터 항목 저장
  const orderInformation = useOrderInfo();
  const deliveryInformation = useDeliveryInfo();
  const {setOrderInformation, setDeliveryInformation, setDetailInformation, resetOrderInfo} = useOrderActions();

  const [inputUser, setInputUser] = useState("사업자정보");

  // 성동 택배 날짜 계산 로직 ~
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택한 날짜를 Date 객체로 저장


  // 주소창으로 접근 등 잘못된 접근 시 경고창 표시 후 홈으로 이동 
  useEffect(()=>{ 
    if (props.activeTab !== 2) {
      alert("잘못된 접근입니다.")
      props.setActiveTab(1);
      resetOrderInfo();
      navigate("/");
    }
  }, [props, navigate])

  // 다음(카카오) 주소찾기 API 기능
  const openPopup = () => {
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = () => {
        new window.daum.Postcode({
          oncomplete: (data) => {
            setOrderInformation("address", data);
          }
      }).open();
  }
  document.body.appendChild(script);
}
  

  const handleChangeOrderField = (fieldName, value) => {
    // setOrderInformation 메서드를 사용하여 특정 필드를 변경
    setOrderInformation(fieldName,value);
  };

  const handleChangeDeliveryField = (fieldName, value) => {
    // setOrderInformation 메서드를 사용하여 특정 필드를 변경
    setDeliveryInformation(fieldName,value);
  };


  //반복되는 인풋란(주문) 렌더링
  const orderInputField = (fieldName, placeholder) => {
    return (
      <input
        type="text"
        className={styles.selectSize}
        placeholder={placeholder}
        value={orderInformation[fieldName]}
        onChange={(e) => handleChangeOrderField(fieldName, e.target.value)}
      />
    );
  };

  //정보 자동 입력
  useEffect(() => {
    if(userData){
        setOrderInformation("order_name",userData.name);
        setOrderInformation("order_tel", userData.tel);
        setOrderInformation("order_email", userData.email);
        if (inputUser === '사업자정보') {
          setOrderInformation("order_faxNum", userData.cor_fax);
          setOrderInformation("order_delName", userData.cor_ceoName);
          setOrderInformation("order_delTel", userData.cor_tel);
          setDetailInformation("address", "zonecode", userData.zonecode);
          setDetailInformation("address", "roadAddress", userData.roadAddress);
          setDetailInformation("address", "bname", userData.bname);
          setDetailInformation("address", "buildingName", userData.buildingName);
          setDetailInformation("address", "jinunAddress", userData.jibunAddress);
          setOrderInformation("addressDetail",userData.addressDetail);
        } else if (inputUser === '직접입력') {
          resetOrderInfo();
        };
    }
  }, [inputUser, userData]);



  // submit 버튼
  function submitReceipt(){
      if(props.activeTab===2){

        //결제 방식이 CMS일때
        if(orderInformation.payRoute === 'CMS'){
          const orderData = {
            ...orderInformation,
            ...orderInformation.address,
            deliveryInformation
          }
          orderMutation(orderData,{
          onSuccess: (success) => {
            // 메세지 표시
            alert(success.message);
            console.log('주문이 완료되었습니다.', success);
            // 주문 상태를 다시 불러와 갱신합니다.
            queryClient.invalidateQueries(['order']);
            //재고 상태 수량만큼 감소
            
            supplyMutation(orderList,{
              onSuccess: (success) => {
                console.log("재고 상태를 업데이트 하였습니다.", success);
                queryClient.invalidateQueries(['data']);
                props.setActiveTab(4);
                navigate("/basket/order");
              },
              onError: (error) => {
                // 상품 추가 실패 시, 에러 처리를 수행합니다.
                console.error('상품을 수정하던 중 오류가 발생했습니다.', error);
              }
            });
          },
          onError: (error) => {
            // 상품 추가 실패 시, 에러 처리를 수행합니다.
            console.error('상품을 주문목록에 넣는 중 오류가 발생했습니다.', error);
          },
        })
          // 결제방식이 무통장 입금일때
        } else if (orderInformation.payRoute === '무통장입금') {
          props.setActiveTab(3);
          navigate("/basket/pay");
        }
      }
    }

  const deliveryMessageExample=[
  {value: '빠른배송 부탁드립니다.'},
  {value: '벨 누르지 말고 배송 전 연락바랍니다.'},
  {value: '배송 전 연락 바랍니다.'},
  {value: '문 앞에 두고 가주세요.'},
]

  const smtMessageExample=[
    {value: '빠른 출고 부탁드립니다.'},
    {value: '명세서 제외 바랍니다.'},
    {value: '발송자 표시 바랍니다.(고객 직송 건)'}
  ]

  // 성동 택배 일 때 택배 날짜 로직
  useEffect(() => {
    if(deliveryInformation.deliveryType === "성동택배")
      updateDateList();
  }, []);

  const updateDateList = () => {
    const currentHour = currentDate.getHours();

    // 만약 현재 시간이 12시 이후라면 모레 날짜를 계산합니다.
    if (currentHour >= 12) {
      const tomorrow = new Date(currentDate);
      tomorrow.setDate(currentDate.getDate() + 1);
      setCurrentDate(tomorrow);
    }
    // 그렇지 않으면 내일 날짜를 계산합니다.
    else {
      const tomorrow = new Date(currentDate);
      tomorrow.setDate(currentDate.getDate());
      setCurrentDate(tomorrow);
    }
  };

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formatDate = selectedDate.toLocaleDateString(undefined, dateOptions);

  // 선택 가능한 날짜 목록을 생성합니다.
  const dateSelectOptions = [];
  for (let i = 0; i < 10; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i);
    const dayOfWeek = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일


  // 날짜의 요일이 일요일(0)이 아닌 경우에만 옵션추가
  if (dayOfWeek !== 0) {
    const formattedOption = date.toLocaleDateString(undefined, dateOptions);
    dateSelectOptions.push(
      <option key={i} value={formattedOption}>
        {formattedOption}
      </option>
    );
  } else {
    continue;
  }
}


  const handleDateChange = (event) => {
    const selectedDateStr = event.target.value;
  
    // "년", "월", "요일" 등의 문자를 "-"로 대체하고 공백을 제거하여 "YYYY-MM-DD" 형식의 문자열로 변환합니다.
    const formattedDateStr = selectedDateStr
      .replace(/년|월/g, '-')
      .replace(/(일요일|월요일|화요일|수요일|목요일|금요일|토요일|일|요일|-)/g, '')
      .trim();
  
    // 요일 정보를 제외한 "YYYY-MM-DD" 형식의 문자열을 Date 객체로 파싱합니다.
    const selectedDateObj = new Date(formattedDateStr);
  
    // 날짜 파싱이 올바르게 되었는지 확인하기 위해 콘솔에 출력합니다.
    if (!isNaN(selectedDateObj)) {
      setSelectedDate(selectedDateObj);
      setDeliveryInformation(
        "delivery_date",selectedDateStr
      )
    }
  };

  return(
    <div>
      <div className={styles.container}>
        <h1 className={styles.headTag}>자동 정보 입력</h1>
        <div className={styles.form}>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>구분</label>
            </div>
            <div className={styles.input}>
              <input 
              name='inputUser'
              onChange={()=>setInputUser("사업자정보")}
              value="사업자정보" 
              checked={inputUser === "사업자정보"} 
              type="radio"
              />
              사업자 정보로 입력
              <input 
              name='inputUser'
              onChange={()=>setInputUser("직접입력")} 
              value="직접입력" 
              checked={inputUser === "직접입력"} 
              type="radio"
              />
              직접입력
            </div>
          </div>
        </div>
        <h1 className={styles.headTag}>주문자 정보</h1>
        <form className={styles.form}>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>성함</label>
            </div>
            <div className={styles.input}>
              {orderInputField("order_name","주문자의 성함을 입력해주세요")}
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>전화번호</label>
            </div>
            <div className={styles.input}>
              {orderInputField("order_tel","주문자의 전화번호를 입력해주세요")}
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>이메일</label>
            </div>
            <div className={styles.input}>
              {orderInputField("order_email","주문자의 이메일을 입력해주세요")}
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>성동 메세지</label>
            </div>
            <div style={{flexDirection: 'row', width: '60%'}} className={styles.searchResult}>
              <input 
              style={{flexDirection: 'row', width: '50%'}}
              className={styles.selectSize} 
              value={orderInformation?.smtMessage}
              type="text" 
              list="smtMessages"
              placeholder='성동물산에 남길 메세지를 적어주세요'
              onChange={(e)=>handleChangeOrderField("smtMessage", e.target.value)}
              />
              <datalist id="smtMessages">
                <option value="" label="/----메세지 선택----/" disabled/>
                <option value="" label="직접 입력" />
                {smtMessageExample.map((item, index) => (
                  <option key={index} value={item.value} label={item.value} />
                ))}
              </datalist>
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
              {orderInputField("order_delName","배송 받으실 분의 성함을 입력해주세요")}
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>전화번호</label>
            </div>
            <div className={styles.input}>
              {orderInputField("order_delTel","배송 받으실 분의 전화번호를 입력해주세요")}
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
                  type="text" 
                  value={orderInformation.address && orderInformation.address.zonecode} 
                  placeholder="우편번호"
                  required
                  readOnly
                />
                <input 
                  className={styles.button} 
                  type="button" 
                  onClick={()=>{
                    openPopup();
                  }}
                  value="우편번호 찾기"
                />
              </div>
              <input 
                className={styles.inputSize} 
                type="text" 
                value={orderInformation.address && orderInformation.address.roadAddress}
                placeholder="도로명 주소"
                required
                readOnly
              />
              <input 
                className={styles.inputSize}
                type="text" 
                value={orderInformation.address.buildingName ? `(${orderInformation.address.bname}, ${orderInformation.address.buildingName})` : orderInformation.address && `(${orderInformation.address.bname}, ${orderInformation.address.jibunAddress})`}  
                placeholder="건물 이름 또는 지번 주소"
                required
                readOnly
              />       
              <input
              type="text"
              className={styles.inputSize}
              placeholder="상세 주소를 입력하세요"
              value={orderInformation.addressDetail}
              onChange={(e) => setOrderInformation("addressDetail",e.target.value)}
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
              value="성동택배" 
              checked={deliveryInformation.deliveryType === '성동택배'} 
              type="radio"
              onChange={(e)=>handleChangeDeliveryField("deliveryType", e.target.value)}
              />
              성동 택배
              <input 
              name='delivery' 
              value="화물" 
              checked={deliveryInformation.deliveryType === '화물'} 
              type="radio"
              onChange={(e)=>handleChangeDeliveryField("deliveryType", e.target.value)}
              />
              화물
              <input 
              name='delivery' 
              value="일반택배" 
              checked={deliveryInformation.deliveryType === '일반택배'} 
              type="radio"
              onChange={(e)=>handleChangeDeliveryField("deliveryType", e.target.value)}
              />
              일반택배
              <input 
              name='delivery' 
              value="직접픽업" 
              checked={deliveryInformation.deliveryType === '직접픽업'} 
              type="radio"
              onChange={(e)=>handleChangeDeliveryField("deliveryType", e.target.value)}
              />
              직접 픽업
            </div>
          </div>
          {deliveryInformation.deliveryType === '성동택배'
          &&
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>희망 택배일자</label>
            </div>
            <div className={styles.input}>
              <input 
                name='deliveryDate' 
                className={styles.inputSize}
                value={deliveryInformation.delivery_date} 
                type="text"
                readOnly
                />
              <select 
              onChange={(e) => handleDateChange(e)}
              name='deliveryDate'
              value={formatDate || ""}
              className={styles.selectSize}
              >
                <option value="">
                  /---배송 일자 선택---/
                </option>
                {dateSelectOptions}
              </select>
            </div>
          </div>
          }
          {deliveryInformation.deliveryType === '화물'
          &&
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>배송 업체</label>
            </div>
            <div className={styles.input}>
              <input 
              name='deliverySel' 
              value="kr.daesin" 
              checked={deliveryInformation.delivery_selectedCor === 'kr.daesin'} 
              type="radio"
              onChange={(e)=>handleChangeDeliveryField("delivery_selectedCor", e.target.value)}
              />
              대신화물
              <input 
              name='deliverySel' 
              value="kr.kdexp" 
              checked={deliveryInformation.delivery_selectedCor === 'kr.kdexp'} 
              type="radio"
              onChange={(e)=>handleChangeDeliveryField("delivery_selectedCor", e.target.value)}
              />
              경동화물
            </div>
          </div>
          }
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>배송 메세지</label>
            </div>
            <div style={{flexDirection: 'row', width: '60%'}} className={styles.searchResult}>
              <input 
              style={{flexDirection: 'row', width: '50%'}}
              className={styles.selectSize} 
              value={deliveryInformation.delivery_message}
              type="text" 
              list="deliveryMessages"
              placeholder='택배 기사님께 남길 메세지를 적어주세요'
              onChange={(e)=>handleChangeDeliveryField("delivery_message", e.target.value)}
              />
              <datalist id="deliveryMessages">
                <option value="" label="/----메세지 선택----/" disabled/>
                <option value="" label="직접 입력" />
                {deliveryMessageExample.map((item, index) => (
                  <option key={index} value={item.value} label={item.value} />
                ))}
              </datalist>
            </div>
          </div>
        </form>

        <h1 className={styles.headTag}>결제 수단</h1>
        <form className={styles.form}>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>결제 방법</label>
            </div>
            <div className={styles.input}>
              <input 
              name='payroute' 
              type="radio"
              value="무통장입금"
              checked={orderInformation.order_payRoute === '무통장입금'} 
              onChange={(e)=>handleChangeOrderField("order_payRoute", e.target.value)}
              />
              무통장 입금
              <input 
              name='payroute' 
              type="radio"
              value="CMS"
              checked={orderInformation.order_payRoute === 'CMS'} 
              onChange={(e)=>handleChangeOrderField("order_payRoute", e.target.value)}
              />
              CMS (매달 정기일 자동 결제)
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
              checked={orderInformation.order_moneyReceipt === '발행안함'} 
              onChange={(e)=>handleChangeOrderField("order_moneyReceipt", e.target.value)}
              /> 발행안함
              <input 
              name='moneyreceipt' 
              type="radio"
              value="현금영수증"
              checked={orderInformation.order_moneyReceipt === '현금영수증'} 
              onChange={(e)=>handleChangeOrderField("order_moneyReceipt", e.target.value)}
              /> 현금영수증
              <input 
              name='moneyreceipt' 
              type="radio"
              value="세금계산서"
              checked={orderInformation.order_moneyReceipt === '세금계산서'} 
              onChange={(e)=>handleChangeOrderField("order_moneyReceipt", e.target.value)}
              /> 세금계산서
            </div>
          </div>
          {orderInformation.order_moneyReceipt !== '' && 
          <div className={styles.formInner}>
            <div className={styles.label}>
            <label>명세서</label>
            </div>
            <input 
            name='transaction' 
            type="radio"
            value={orderInformation.printFax}
            checked={orderInformation.printFax === true} 
            onChange={(e)=>handleChangeOrderField("printFax", !orderInformation.printFax)}
            /> 명세서 FAX 출력 여부 (원본은 동봉되어 발송됩니다)
            </div>
          }
          {orderInformation.printFax === true &&
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>FAX 번호</label>
            </div>
            <div className={styles.input}>
              {orderInputField("order_faxNum","fax 번호를 입력해주세요")}
            </div>
          </div>
          }
        </form>
        <div className={styles.formInner}>
          <input 
          checked={orderInformation.checked} 
          onChange={(e) => setOrderInformation(
            "checked",!orderInformation.checked
          )} 
          type="checkbox"
          />
            구매동의 및 결제대행서비스 이용약관 등에 모두 동의합니다.
          <button className={styles.button}>약관보기</button>
        </div>
        <div>
          <button  
          onClick={()=> {
            submitReceipt()
          }} 
          className={styles.submitButton}
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  )
}