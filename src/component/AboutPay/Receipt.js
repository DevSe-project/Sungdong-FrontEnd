import { useEffect, useState } from 'react';
import styles from './Receipt.module.css'
import { useNavigate } from 'react-router-dom';
import { useBasketList, useDataActions, useDeliveryInfo, useListActions, useListStore, useOrderActions, useOrderData, useOrderInfo, useOrderList, useUserData } from '../../Store/DataStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { GetCookie } from '../../customFn/GetCookie';


export function Receipt(props){
  const navigate = useNavigate();

  // react-query : 서버에서 받아온 데이터 캐싱, 변수에 저장
  const { isLoading, isError, error, data } = useQuery({queryKey:['data']});

  const queryClient = useQueryClient();

  //주문 목록 추가 요청 함수
  const orderTo = async () => {
    if (isLoading) {
      // 데이터가 없으면 아무것도 하지 않고 종료
      return;
    }
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.post("/order", 
        JSON.stringify({
          productId: orderList.id,  // 예시: product가 객체이고 id 속성이 있는 경우
          optionSelect: orderList.optionSelect ? orderList.optionSelect : null,
          cnt: orderList.cnt,
          order: orderInformation,
          delivery: deliveryInformation,
          orderState: orderInformation.payRoute === 'CMS' ? 2 : 0, //0 => 결제대기, 1 => 결제완료 2 => 배송준비중 3 => 배송중 4 => 배송완료 
        }),
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
  const lowSupply = async () => {
    try {
      const filteredData = data.filter((item) => item.id === orderList.id);
      const response = await axios.put(`/data/${filteredData.id}`, 
        JSON.stringify({
          supply: filteredData.supply - orderList.cnt,
        }),
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
  const { supplyMutation } = useMutation({mutationFn: lowSupply,
    onSuccess: (success) => {
      console.log("재고 상태를 업데이트 하였습니다.", success);
      queryClient.invalidateQueries(['data']);
    },
    onError: (error) => {
      // 상품 추가 실패 시, 에러 처리를 수행합니다.
      console.error('상품을 수정하던 중 오류가 발생했습니다.', error);
    }
  });

  //주문 신청 함수
  const { orderMutation } = useMutation({mutationFn: orderTo,
    onSuccess: (success) => {
      // 메세지 표시
      alert(success.message);
      console.log('주문이 완료되었습니다.', success);
      // 주문 상태를 다시 불러와 갱신합니다.
      queryClient.invalidateQueries(['order']);
      supplyMutation.mutate();
      // 선택된 아이템들 초기화
      if(orderInformation.payRoute === 'CMS'){
        navigate("/basket/order");
      } else {
        navigate("/basket/pay");
      }
    },
    onError: (error) => {
      // 상품 추가 실패 시, 에러 처리를 수행합니다.
      console.error('상품을 주문목록에 넣는 중 오류가 발생했습니다.', error);
    },
  })

  const orderData = useOrderData();
  const userData = useUserData();

  const { setOrderData } = useDataActions();

  const orderList = useOrderList();
  const basketList = useBasketList();
  
  const { setBasketList } = useListActions();


  // 데이터 항목 저장
  const orderInformation = useOrderInfo();
  const deliveryInformation = useDeliveryInfo();
  const {setOrderInformation, setDeliveryInformation, setDetailInformation} = useOrderActions();

  const [address, setAddress] = useState("");
  const [inputUser, setInputUser] = useState("사업자정보");
  const inLogin = JSON.parse(sessionStorage.getItem('saveLoginData'));
  // 유효성검사 State
  const [isFormValid, setIsFormValid] = useState(false);  

  // 성동 택배 날짜 계산 로직 ~
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택한 날짜를 Date 객체로 저장


  // 주소창으로 접근 등 잘못된 접근 시 경고창 표시 후 홈으로 이동 
  useEffect(()=>{ 
    if (props.activeTab !== 2) {
      alert("잘못된 접근입니다.")
      props.setActiveTab(1);
      navigate("/");
    }
  }, [props, navigate])

  // 다음(카카오) 주소찾기 API 기능
  const openPopup = (setAddress) => {
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = () => {
        new window.daum.Postcode({
          oncomplete: (data) => {
            setAddress(data);
            setDetailInformation("address", "address", data);
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

    //반복되는 인풋란(배송) 렌더링
    const deliveryInputField = (fieldName, placeholder) => {
      return (
        <input
          type="text"
          className={styles.selectSize}
          placeholder={placeholder}
          value={deliveryInformation[fieldName]}
          onChange={(e) => handleChangeDeliveryField(fieldName, e.target.value)}
        />
      );
    };

  //정도 자동 입력
  useEffect(() => {
    if(userData){
      const findUser = userData.find(userData => userData.id == inLogin.id);
      if (findUser) {
        setOrderInformation("name",findUser.corporationData.ceoName);
        setOrderInformation("tel", `${findUser.num1}-${findUser.num2}-${findUser.num3}`);
        setOrderInformation("email", findUser.email);
        if (inputUser === '사업자정보') {
          setAddress(findUser.address);
          setOrderInformation("fax",findUser.corporationData.FAX);
          setDeliveryInformation("name",findUser.corporationData.ceoName);
          setDeliveryInformation("tel",`${findUser.num1}-${findUser.num2}-${findUser.num3}`);
          setDetailInformation("address", "address", address);
          setDetailInformation("address","addressDetail",findUser.addressDetail);
        } else if (inputUser === '직접입력') {
          setAddress("")
        };
      }
    }
  }, [inputUser, userData, inLogin.id, address]);

  // Input란 유효성 검사
  const validateForm = () => {
    if (!orderInformation || !deliveryInformation) {
      alert("주문 정보 및 배송 정보가 정의되지 않았습니다.");
      return;
    }
    const isOrderInformationValid = () => {
      if(
      orderInformation.name !== "" &&
      orderInformation.tel !== "" &&
      orderInformation.email !== "" &&
      orderInformation.payRoute !== ""
      ){
        if(orderInformation.moneyReceipt === '명세서'){
          if(orderInformation.transAction === '명세서출력'){
            return (
              orderInformation.moneyReceipt !== "" &&
              orderInformation.transAction !== "" &&
              orderInformation.fax !== ""
            );
          } else {
            return (
            orderInformation.moneyReceipt !== "" &&
            orderInformation.transAction !== ""
            )
          }
        } else {
          return(
            orderInformation.moneyReceipt !== ""
          )
        }
      } else {
      return false;
      }
  }
      
      
      
    const isDeliveryInformationValid = () => {
      if(deliveryInformation.name !== "" &&
      deliveryInformation.tel !== "" &&
      deliveryInformation.address.address !== "" &&
      deliveryInformation.address.addressDetail !== "" 
      ){
        if(deliveryInformation.deliveryType === '화물'){
          return(
            deliveryInformation.deliveryType !== "" &&
            deliveryInformation.deliverySelect !== "" &&
            deliveryInformation.deliveryMessage !== ""
          );
          } else if (deliveryInformation.deliveryType === '성동택배'){
            return(
              deliveryInformation.deliveryType !== "" &&
              deliveryInformation.deliveryDate !== "" &&
              deliveryInformation.deliveryMessage !== ""
            );
          }
          else {
          return(
            deliveryInformation.deliveryType !== "" &&
            deliveryInformation.deliveryMessage !== ""
          )
        }
      } else {
        return false;
      }
    }
  
    const isCheckboxChecked = orderInformation.checked === true;

    const isOrderValid = isOrderInformationValid();
    const isDeliveryValid = isDeliveryInformationValid();

    setIsFormValid(isOrderValid && isDeliveryValid && isCheckboxChecked);

    if (!isOrderValid || !isDeliveryValid || !isCheckboxChecked){
      alert("작성이 되지 않은 란이 있습니다. 다시 확인해주세요!");
    }
  };



  // submit 버튼
  function submitReceipt(){
    try{
      orderMutation.mutate();
    } catch(error) {
      validateForm();
      const isValidSupply = orderList.every((orderItem) => {
      const productMatchingId = data.find((item) => item.id === orderItem.id);
      return productMatchingId && productMatchingId.supply > 0;
    });
    
    if (!isValidSupply) {
      alert("주문 요청한 상품 중에 재고가 없는 상품이 있습니다!");
      return;
    }
    if(props.activeTab===2 && isFormValid && isValidSupply) {
    // supply 수정
      const productData = data.map((item) => {
        const isProductInOrderList = orderList.some(
          (orderListItem) => orderListItem.productId === item.id
        );
      if (isProductInOrderList) {
        return {
          ...item,
          supply: item.supply - 1,
        };
      }
      return item;
    });
      // 현재 날짜와 시간을 가져오기
      const currentDate =  new Date();
      const formattedDate = currentDate.toLocaleString();
      const newOrderId = orderData.length + 1;
      const editedData = JSON.parse(sessionStorage.getItem('orderData'));
      const newOrderData = editedData.map((item) => ({
        ...item,
        orderId: newOrderId,
        order: orderInformation,
        delivery: deliveryInformation,
        date: formattedDate,
        orderState: orderInformation.payRoute === 'CMS' ? 2 : 0, //0 => 결제대기, 1 => 결제완료 2 => 배송준비중 3 => 배송중 4 => 배송완료 
      }));
        // 데이터 삽입
        //orderData (주문 진행 객체) 업데이트
        const copyData = [...orderData];
        copyData.push(...newOrderData);
        setOrderData(copyData);
        // sessionStorage 변경
        sessionStorage.removeItem('orderData');
        sessionStorage.setItem('newOrderData', JSON.stringify(newOrderData));
        setBasketList(basketList.filter((item)=>!orderList.some((orderItem) =>
        orderItem.optionSelected 
        ? 
        orderItem.optionSelected === item.optionSelected &&
        orderItem.userId === item.userId &&
        orderItem.productId === item.id
        :  
        orderItem.userId === item.userId &&
        orderItem.productId === item.id)))
        //결제 방식이 CMS일때
        if(orderInformation.payRoute === 'CMS'){
          props.setActiveTab(4);
          navigate("/basket/order");

          // 결제방식이 일반결제 일때
        } else if (orderInformation.payRoute === '일반결제') {
        props.setActiveTab(3);
        navigate("/basket/pay");
        }
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
        "deliveryDate",selectedDateStr
      )
    }
  };

  if(isLoading){
    return <p>Loading..</p>;
  }
  if(isError){
    return <p>에러 : {error.message}</p>;
  }

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
              {orderInputField("name","주문자의 성함을 입력해주세요")}
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>전화번호</label>
            </div>
            <div className={styles.input}>
              {orderInputField("tel","주문자의 전화번호를 입력해주세요")}
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>이메일</label>
            </div>
            <div className={styles.input}>
              {orderInputField("email","주문자의 이메일을 입력해주세요")}
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
              {deliveryInputField("name","배송 받으실 분의 성함을 입력해주세요")}
            </div>
          </div>
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>전화번호</label>
            </div>
            <div className={styles.input}>
              {deliveryInputField("tel","배송 받으실 분의 전화번호를 입력해주세요")}
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
                  required
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
                required
                readOnly
              />
              <input 
                className={styles.inputSize}
                type="text" 
                value={address && address.buildingName ? `(${address.bname}, ${address.buildingName})` : address && `(${address.bname}, ${address.jibunAddress})`}  
                placeholder="건물 이름 또는 지번 주소"
                required
                readOnly
              />       
              <input
              type="text"
              className={styles.inputSize}
              placeholder="상세 주소를 입력하세요"
              value={deliveryInformation.address.addressDetail}
              onChange={(e) => setDetailInformation("address","addressDetail",e.target.value)}
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
                value={deliveryInformation.deliveryDate} 
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
              checked={deliveryInformation.deliverySelect === 'kr.daesin'} 
              type="radio"
              onChange={(e)=>handleChangeDeliveryField("deliverySelect", e.target.value)}
              />
              대신화물
              <input 
              name='deliverySel' 
              value="kr.kdexp" 
              checked={deliveryInformation.deliverySelect === 'kr.kdexp'} 
              type="radio"
              onChange={(e)=>handleChangeDeliveryField("deliverySelect", e.target.value)}
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
              value={deliveryInformation.deliveryMessage}
              type="text" 
              list="deliveryMessages"
              placeholder='택배 기사님께 남길 메세지를 적어주세요'
              onChange={(e)=>handleChangeDeliveryField("deliveryMessage", e.target.value)}
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
              value="일반결제"
              checked={orderInformation.payRoute === '일반결제'} 
              onChange={(e)=>handleChangeOrderField("payRoute", e.target.value)}
              />
              일반결제 (무통장 입금)
              <input 
              name='payroute' 
              type="radio"
              value="CMS"
              checked={orderInformation.payRoute === 'CMS'} 
              onChange={(e)=>handleChangeOrderField("payRoute", e.target.value)}
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
              checked={orderInformation.moneyReceipt === '발행안함'} 
              onChange={(e)=>handleChangeOrderField("moneyReceipt", e.target.value)}
              /> 발행안함
              {/* <input 
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
              /> 세금계산서 */}
              <input 
              name='moneyreceipt' 
              type="radio"
              value="명세서"
              checked={orderInformation.moneyReceipt === '명세서'} 
              onChange={(e)=>handleChangeOrderField("moneyReceipt", e.target.value)}
              /> 명세서
            </div>
          </div>
          {orderInformation.moneyReceipt === '명세서' && 
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>명세서</label>
            </div>
            <div className={styles.input}>
              <input 
              name='transaction' 
              type="radio"
              value="명세서실물"
              checked={orderInformation.transAction === '명세서실물'} 
              onChange={(e)=>handleChangeOrderField("transAction", e.target.value)}
              /> 명세서 실물 동봉
              <input 
              name='transaction' 
              type="radio"
              value="명세서출력"
              checked={orderInformation.transAction === '명세서출력'} 
              onChange={(e)=>handleChangeOrderField("transAction", e.target.value)}
              /> 명세서 FAX 출력
            </div>
          </div>
          }
          {orderInformation.transAction === '명세서출력' &&
          <div className={styles.formInner}>
            <div className={styles.label}>
              <label>FAX 번호</label>
            </div>
            <div className={styles.input}>
              {orderInputField("fax","fax 번호를 입력해주세요")}
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