import styles from './WelcomeModule.module.css';
import { useQuery } from '@tanstack/react-query';
import axios from '../../axios';
import { GetCookie } from '../../customFn/GetCookie';
import { useNavigate } from 'react-router-dom';

export default function WelcomeModule() {
    const navigate = useNavigate();
    let errorDisplayed = false;

    // -----UserData fetch
    const fetchUserData = async () => {
        try {
            const token = GetCookie('jwt_token');
            const response = await axios.get("/auth/info",
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
            handleUnauthorizedError(error.response.data.message);
            return {};
        } else if(error.response && error.response.status === 403){
            handleForbiddenError(error.response.data.message);
            return (
                <div>
                <input></input>
                <input></input>
                    <div>
                        <button>로그인</button>
                    </div>
                </div>
            );
        } else {
            handleOtherErrors('상품을 장바구니에 추가하는 중 오류가 발생했습니다.');
            return {};
        }}
    }

    const handleUnauthorizedError = (errorMessage) => {
        if (!errorDisplayed) {
            console.error(errorMessage);
        }
        errorDisplayed = true;
    }
    
    const handleForbiddenError = (errorMessage) => {
        if (!errorDisplayed) {
            alert(errorMessage);
            navigate("/login");
        }
        errorDisplayed = true;
    }
    
    const handleOtherErrors = (errorMessage) => {
        if (!errorDisplayed) {
            alert(errorMessage);
        }
        errorDisplayed = true;
    }

    const { isLoading, isError, data: userData } = useQuery({ 
        queryKey: ['user'],
        queryFn: fetchUserData,
    });

    if (isLoading) {
        return <p>Loading..</p>;
    }
    if (isError) {
        return (               
        <div>
        <input></input>
        <input></input>
            <div>
                <button>로그인</button>
            </div>
        </div>
    )
    }



    return (
        <div >
            {userData && GetCookie('jwt_token') !== null &&
            <div className={styles.container}>
                {/* 환영문구 */}
                <div className={styles.header}>
                    <span style={{ textAlign: 'left' }}>
                        <span style={{ fontWeight: '900' }}>{userData.cor_corName ? userData.cor_corName : '렌더링 중'}</span> 님</span>
                    <span style={{ textAlign: 'right' }}> 환영합니다.</span>
                </div>
                {/* 담당자명 | 연락처 */}
                <div className={styles.managerInfo}>
                    <div><span>담당자: </span><span>박형조</span></div>
                    <div><span>연락처: </span><span>010-1234-5678</span></div>
                </div>
            </div>
            }
        </div>
    )
}