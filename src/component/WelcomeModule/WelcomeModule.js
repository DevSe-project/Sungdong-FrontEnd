import styles from './WelcomeModule.module.css';
import { useQuery } from '@tanstack/react-query';
import { GetCookie } from '../../customFn/GetCookie';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../customFn/useFetch';
import axios from '../../axios';

export default function WelcomeModule() {
  const navigate = useNavigate();
  const { handleForbiddenError, handleOtherErrors, handleNoAlertOtherErrors } = useFetch();

  // -----UserData fetch
  const fetchUserData = async () => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.get("/auth/welcomeInfo",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      )
      // 성공 시 추가된 상품 정보를 반환합니다.
      return response.data.data || {};
    } catch (error) {
      // 서버 응답이 실패인 경우
      if (error.response && error.response.status === 401) {
        // 서버가 401 UnAuthorazation를 반환한 경우
        handleNoAlertOtherErrors(error.response.data.message);
        return new Error(error.response.data.message);
      } else if (error.response && error.response.status === 403) {
        handleForbiddenError(error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        handleOtherErrors(error.response.data.message);
        throw new Error(error.response.data.message);
      }
    }
  }
  // userData fetch
  const { isUserLoading, isUserError, userError, data: userData } = useQuery({
    queryKey: ['welcome'],
    queryFn: fetchUserData,
  });

  if (isUserLoading) {
    return <p>Loading..</p>;
  }

  if (isUserError) {
    return <p style={{ color: 'red' }}>User Error: {userError.message}</p>
  }
  return (
    <div className={styles.wrapper}>
      {userData && GetCookie('jwt_token') !== null &&
        <div className={styles.container}>

          {/* 환영문구 */}
          <div className={styles.header}>
            <div className={styles.corName_container}>
              {/* 아이콘 */}
              <i class="fa-solid fa-user"></i>
              {/* 기업명 */} <span style={{ fontWeight: '900' }}>{userData.cor_corName ? userData.cor_corName : '렌더링 중'}</span> 님
            </div>
            {/* 문구 */} <div className={styles.welcomeMessage}> 환영합니다 <i class="fa-solid fa-exclamation"></i></div>
          </div>

          {/* 주문현황 */}
          <div className={styles.itemContainer}>
            <div className={styles.itemsTitle}>
              <span>주문 현황</span>
              {userData.userType_id > 2 ? <span className={styles.goAdmin} onClick={() => navigate('/adminMain')}>Admin<i class="fa-solid fa-gears"></i></span> : null}
            </div>

            {/* 아이템 */}
            <div className={styles.items}>
              {/* 요소들을 맵핑하여 표시합니다. */}
              {[
                { title: '신규주문', content: userData.ordersCount },
                { title: '배송준비', content: userData.preparing_orders },
                { title: '배송중', content: userData.shipping_orders },
                { title: '배송완료', content: userData.completed_orders },
              ].map((item, index) => (
                <div key={index} className={styles.orderList}>
                  <div className={styles.title}>{item.title}</div>
                  {/* styles 객체 내부에 정의된 클래스 이름을 동적으로 결정하여 적용합니다. */}
                  <div className={styles.content}>{item.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    </div>
  )
}
