import styles from './Modal.module.css';
import { useEffect } from 'react';
import { useModalActions } from '../../Store/DataStore';
import { GetCookie } from '../../customFn/GetCookie';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function TakeBackModal({modalItem}) {
  const {closeModal} = useModalActions();
  const queryClient = useQueryClient();

  //fetch 함수
  const tradeFetch = async () => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.post("/takeBack", 
        JSON.stringify({
          productId: modalItem.id,  // 예시: product가 객체이고 id 속성이 있는 경우
          optionSelect: modalItem.optionSelect ? modalItem.optionSelect : null,
          cnt: modalItem.cnt
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

  //교환 신청 함수
  const { requestTradeMutation } = useMutation({mutationFn: tradeFetch,
    onSuccess: (success) => {
      // 메세지 표시
      alert(success.message);
      console.log('반품 신청이 완료되었습니다.', success);
      // 상태를 다시 불러와 갱신합니다.
      queryClient.invalidateQueries(['takeBack']);
    },
    onError: (error) => {
      // 상품 추가 실패 시, 에러 처리를 수행합니다.
      console.error('반품을 신청하는 중 오류가 발생했습니다.', error);
    },
  })

    // esc키를 누르면 모달창 닫기.
    useEffect(() => {
        const onClose = (event) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        window.addEventListener('keydown', onClose);

        return () => {
            window.removeEventListener('keydown', onClose);
        };
    }, [closeModal]);

    const productList = [
        { label : '상품정보', content : modalItem.title},
        { label : '배송구분', content : '배송구분'},
        { label : '승인시간', content : '미정'},
        { label : '판매일자', content : '구매한 일자'},
        { label : '전표번호', content : modalItem.id},
        { label : '경과일', content : '구매일로부터 n일'},
      ];

    const takeBackList = [
        { label : '작성자', content : <input className={styles.inputStyle} style={{width: '100%'}} type='text'/>},
        { label : '포장상태', content : wrapStatus()},
        { label : '처리사항', content : '반품처리'},
        { label : '상품상태', content : productStatus()},
        { label : '반품수량', 
          content : 
          <>
          <input style={{width: '20%'}} className={styles.inputStyle} type='number'/>
          <span style={{width: '10%', background: 'lightgray'}} className={styles.inputStyle}>단가</span>
          <input style={{width: '20%'}} value={modalItem.price} className={styles.inputStyle} type='text' disabled/>
          <span style={{width: '10%', background: 'lightgray'}} className={styles.inputStyle}>금액</span>
          <input style={{width: '20%'}} value={modalItem.price} className={styles.inputStyle} type='text' disabled/>          
          </>},
        { label : '바코드상태', content : barcodeStatus() },
        { label : '반품사유', content : <input className={styles.inputStyle} style={{width: '100%'}} type='text'/>},
        { label : '반품배송', content : returnStatus()}
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
                    반품증 작성 작업
                </div>
                {/* 작성일과 반품상담자 */}
                <div className={styles.details}>
                    <div className={styles.date}>
                        작성일: 
                    </div>
                    <div className={styles.writer}>
                        반품상담자: 성동물산(주)
                    </div>
                </div>
                {/* 글 내용 */}
                <div className={styles.contentsBox}>
                    <div className={styles.contents}>
                        <div className={styles.productInfo}>
                            {productList.map((item,key) => 
                            <div key={key} className={styles.container}>
                                <div className={styles.label}>
                                    {item.label}:
                                </div>
                                <div className={styles.content}>
                                    {item.content}
                                </div>
                            </div>
                            )}
                        </div>
                        <div className={styles.productInfo}>
                            {takeBackList.map((item,key) => 
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
                          <label>최종 환불금액 : <input className={styles.inputStyle} value={modalItem.price} type='text' disabled/> 원</label>
                          <button onClick={()=> requestTradeMutation.mutate()} className={styles.button}>반품 신청</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 상품 상태 옵션
function wrapStatus(){
    return(
      <div style={{display: 'flex', gap: '0.5em'}}>
        <div>
          <select className={styles.inputStyle}  name="wrapStatus">
            <option name="wrapStatus" type="정상포장">정상포장</option>
            <option name="wrapStatus" type="포장개봉">포장개봉</option>
            <option name="wrapStatus" type="포장훼손">포장훼손</option>
          </select>
        </div>
      </div>
    )
}

// 상품 상태 옵션
function productStatus(){
    return(
      <div style={{display: 'flex', gap: '0.5em'}}>
        <div>
          <select className={styles.inputStyle}  name="productStatus">
            <option name="productStatus" type="정상작동">정상작동</option>
            <option name="productStatus" type="불량작동">불량작동</option>
            <option name="productStatus" type="A/S수리">A/S 수리</option>
          </select>
        </div>
      </div>
    )
  }

  // 바코드 상태 옵션
function barcodeStatus(){
    return(
      <div style={{display: 'flex', gap: '0.5em'}}>
        <div>
          <select className={styles.inputStyle} name="barcodeStatus">
            <option name="barcodeStatus" type="정상부착">정상부착</option>
            <option name="barcodeStatus" type="미부착">미부착</option>
            <option name="barcodeStatus" type="바코드훼손">바코드 훼손</option>
            <option name="barcodeStatus" type="입고시미부착">입고시 미 부착</option>
          </select>
        </div>
      </div>
    )
  }

    // 반품 상태 옵션
function returnStatus(){
    return(
      <div style={{display: 'flex', gap: '0.5em'}}>
        <div>
          <select className={styles.inputStyle} name="returnStatus">
            <option name="returnStatus" type="영업직원">영업직원</option>
            <option name="returnStatus" type="용차회수">용차회수</option>
            <option name="returnStatus" type="매장방문">매장방문</option>
            <option name="returnStatus" type="화물발송">화물발송</option>
          </select>
        </div>
      </div>
    )
  }