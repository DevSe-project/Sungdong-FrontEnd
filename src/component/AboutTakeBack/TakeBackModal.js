import styles from './Modal.module.css';
import { useEffect, useState } from 'react';
import { useModalActions, useTakeBack, useTakeBackActions } from '../../store/DataStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '../../customFn/useFetch';
import { useNavigate } from 'react-router-dom';

export default function TakeBackModal({ modalItem }) {
  const { closeModal } = useModalActions();
  const takeBackOption = useTakeBack();
  const { setTakeBackOption, setTakeBackItemOption, resetTakeBackOption } = useTakeBackActions();
  const queryClient = useQueryClient();
  // 선택된 아이템의 인덱스를 상태로 관리합니다.
  const [selectedItem, setSelectedItem] = useState(modalItem[0]?.order_product_id);
  const {fetchServer} = useFetch();
  const navigate = useNavigate();

  // 라디오 버튼 클릭 이벤트 핸들러
  const handleRadioClick = (index) => {
    setSelectedItem(index); // 선택된 아이템의 인덱스를 업데이트합니다.
  };

  useEffect(() => {
    setTakeBackOption(modalItem);
  }, [modalItem]);

  //fetch 함수
  const tradeFetch = async (rae) => {
    return await fetchServer(rae, `post`, `/rae/create`, 1);
  };

  //교환 신청 함수
  const { mutate:requestTradeMutation } = useMutation({mutationFn: tradeFetch})

  function handleRaeClicked(){
    requestTradeMutation(takeBackOption, {
      onSuccess: (success) => {
        // 메세지 표시
        alert(success.message);
        console.log('반품 신청이 완료되었습니다.', success);
        // 상태를 다시 불러와 갱신합니다.
        queryClient.invalidateQueries(['rae']);
        closeModal();
        navigate("/return/list");
      },
      onError: (error) => {
        // 상품 추가 실패 시, 에러 처리를 수행합니다.
        console.error('반품을 신청하는 중 오류가 발생했습니다.', error);
      },
    })
  }

  // esc키를 누르면 모달창 닫기.
  useEffect(() => {
    const onClose = (event) => {
      if (event.key === 'Escape') {
        closeModal();
        resetTakeBackOption();
      }
    };

    window.addEventListener('keydown', onClose);

    return () => {
      window.removeEventListener('keydown', onClose);
    };
  }, [closeModal]);

  // 반품 상태 옵션
  function returnStatusOption() {
    return (
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <div>
          <select
            className={styles.inputStyle}
            value={modalItem.find((item) => item.order_product_id === selectedItem) ? takeBackOption.find((item)=>item.order_product_id === selectedItem)?.returnStatus : ''}
            onChange={(e) => setTakeBackItemOption(selectedItem, "returnStatus", e.target.value)}
            name="returnStatus"
          >
            <option name="returnStatus" value="">선택</option>
            <option name="returnStatus" value="영업직원">영업직원</option>
            <option name="returnStatus" value="용차회수">용차회수</option>
            <option name="returnStatus" value="매장방문">매장방문</option>
            <option name="returnStatus" value="화물발송">화물발송</option>
          </select>
        </div>
      </div>
    )
  }

  // 바코드 상태 옵션
  function barcodeStatusOption() {
    return (
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <div>
          <select
            className={styles.inputStyle}
            name="barcodeStatus"
            defaultValue={''}
            value={modalItem.find((item) => item.order_product_id === selectedItem) ? takeBackOption.find((item)=>item.order_product_id === selectedItem)?.barcodeStatus : ''}
            onChange={(e) => setTakeBackItemOption(selectedItem, "barcodeStatus", e.target.value)}
          >
            <option name="barcodeStatus" value="">선택</option>
            <option name="barcodeStatus" value="정상부착">정상부착</option>
            <option name="barcodeStatus" value="미부착">미부착</option>
            <option name="barcodeStatus" value="바코드훼손">바코드 훼손</option>
            <option name="barcodeStatus" value="입고시미부착">입고시 미 부착</option>
          </select>
        </div>
      </div>
    )
  }
  // 포장 상태 옵션
  function wrapStatusOption() {
    return (
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <div>
          <select
            className={styles.inputStyle}
            name="wrapStatus"
            value={modalItem.find((item) => item.order_product_id === selectedItem) ? takeBackOption.find((item)=>item.order_product_id === selectedItem)?.wrapStatus :''}
            onChange={(e) => setTakeBackItemOption(selectedItem, "wrapStatus", e.target.value)}
          >
            <option name="warpStatus" value="">선택</option>
            <option name="wrapStatus" value="정상포장">정상포장</option>
            <option name="wrapStatus" value="포장개봉">포장개봉</option>
            <option name="wrapStatus" value="포장훼손">포장훼손</option>
          </select>
        </div>
      </div>
    )
  }

  // 상품 상태 옵션
  function productStatusOption() {
    return (
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <div>
          <select
            className={styles.inputStyle}
            name="productStatus"
            value={modalItem.find((item) => item.order_product_id === selectedItem) ? takeBackOption.find((item)=>item.order_product_id === selectedItem)?.productStatus : ''}
            onChange={(e) => setTakeBackItemOption(selectedItem, "productStatus", e.target.value)}
          >
            <option name="productStatus" value="">선택</option>
            <option name="productStatus" value="정상작동">정상작동</option>
            <option name="productStatus" value="불량작동">불량작동</option>
          </select>
        </div>
      </div>
    )
  }

  // 상품 상태 옵션
  function raeOption() {
    return (
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <div>
          <select
            className={styles.inputStyle}
            name="reaOption"
            value={modalItem.find((item) => item.order_product_id === selectedItem) ? takeBackOption.find((item)=>item.order_product_id === selectedItem)?.rae_type : ''}
            onChange={(e) => setTakeBackItemOption(selectedItem, "rae_type", e.target.value)}
          >
            <option name="raeOption" value={0}>반품</option>
            <option name="raeOption" value={1}>불량교환</option>
          </select>
        </div>
      </div>
    )
  }

  const takeBackList = [
    { label: '작성자', content: <input className={styles.inputStyle} value={modalItem.find((item) => item.order_product_id === selectedItem) ? takeBackOption.find((item)=>item.order_product_id === selectedItem)?.name : ''} onChange={(e) => setTakeBackItemOption(selectedItem, "name", e.target.value)} style={{ width: '100%' }} type='text' /> },
    { label: '포장상태', content: wrapStatusOption() },
    { label: '처리사항', content: raeOption() },
    { label: '상품상태', content: productStatusOption() },
    {
      label: '반품수량',
      content:
        <>
          <input style={{ width: '20%' }} className={styles.inputStyle} type='number' value={modalItem.find((item) => item.order_product_id === selectedItem) ? takeBackOption.find((item)=>item.order_product_id === selectedItem)?.rae_count : ''} onChange={(e) => {
            setTakeBackItemOption(selectedItem, "rae_count", e.target.value)
            setTakeBackItemOption(selectedItem, "rae_amount", (modalItem.find((item) => item.order_product_id === selectedItem)?.order_productPrice/modalItem.find((item) => item.order_product_id === selectedItem)?.order_cnt) * parseInt(e.target.value))
            }} />
          <span style={{ width: '10%', background: 'lightgray' }} className={styles.inputStyle}>단가</span>
          <input style={{ width: '20%' }} value={modalItem.find((item) => item.order_product_id === selectedItem) ? modalItem.find((item) => item.order_product_id === selectedItem)?.order_productPrice/modalItem.find((item) => item.order_product_id === selectedItem)?.order_cnt : ''} className={styles.inputStyle} type='text' disabled />
          <span style={{ width: '10%', background: 'lightgray' }} className={styles.inputStyle}>금액</span>
          <input style={{ width: '20%' }} value={modalItem.find((item) => item.order_product_id === selectedItem) ? parseInt(modalItem.find((item) => item.order_product_id === selectedItem)?.order_productPrice/modalItem.find((item) => item.order_product_id === selectedItem)?.order_cnt) * (takeBackOption.find((item)=>item.order_product_id === selectedItem)?.rae_count) : ''} className={styles.inputStyle} type='text' disabled />
        </>
    },
    { label: '바코드상태', content: barcodeStatusOption() },
    { label: '반품사유', content: <input className={styles.inputStyle} value={modalItem.find((item) => item.order_product_id === selectedItem) ? takeBackOption.find((item)=>item.order_product_id === selectedItem)?.reason : ''} onChange={(e) => setTakeBackItemOption(selectedItem, "reason", e.target.value)} style={{ width: '100%' }} type='text' /> },
    { label: '반품배송', content: returnStatusOption() }
  ]


  return (
    <div className={styles.modalContainer}>
      {/* 종료 버튼 */}
      <div className={styles.closeButton}>
        <span onClick={() => closeModal()}>
          <i className="fas fa-times"></i>
        </span>
      </div>
      {/* 본문 컨테이너 */}
      <div className={styles.contentContainer}>
        {/* 제목 */}
        <div className={styles.title}>
          반품/교환증 작성 작업
        </div>
        {/* 작성일과 반품상담자 */}
        <div className={styles.details}>
          <div className={styles.date}>
            작성일: {new Date().toLocaleDateString()}
          </div>
          <div className={styles.writer}>
            반품상담자: 성동물산(주)
          </div>
        </div>
        {/* 글 내용 */}
        <div className={styles.contentsBox}>
          <div className={styles.contents}>
            <div className={styles.productInfo}>
              <table>
                <thead>
                  <tr>
                    <th>선택</th>
                    <th>상품코드</th>
                    <th>상품정보</th>
                    <th>배송구분</th>
                    <th>주문일자</th>
                  </tr>
                </thead>
                <tbody>
                  {modalItem.map((item, index) =>
                    <tr key={index} onClick={()=> handleRadioClick(item.order_product_id)}>
                      <td>              
                        <input
                        name="raeItem"
                        type="radio"
                        checked={selectedItem === item.order_product_id} // 선택된 항목인 경우 체크됩니다.
                        onChange={() => handleRadioClick(item.order_product_id)} // 라디오 버튼 클릭 이벤트 핸들러를 호출합니다.
                      /></td>
                      <td>{item.product_id}</td>
                      <td>{item.product_brand}/{item.product_title}/{item.product_spec}</td>
                      <td>{item.deliveryType}</td>
                      <td>{new Date(item.order_date).toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className={styles.productInfo}>
              {takeBackList.map((item, key) =>
                <label key={key} className={styles.container}>
                  <div className={styles.label}>
                    {item.label}:
                  </div>
                  <div className={styles.content}>
                    {item.content}
                  </div>
                </label>
              )}
            </div>
            <div className={styles.buttonContainer}>
              <label>최종 환불금액 : <input className={styles.inputStyle} value={takeBackOption.reduce((sum, item) => 
                sum + parseInt(item.rae_amount), 0)}  type='text' disabled /> 원</label>
              <button onClick={()=> handleRaeClicked()} className="original_round_button">반품 신청</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

