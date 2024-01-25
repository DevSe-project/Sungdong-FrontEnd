import styles from './WelcomeModule.module.css';
import { useQuery } from '@tanstack/react-query';
import axios from '../../axios';
import { GetCookie } from '../../customFn/GetCookie';

export default function WelcomeModule() {

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
            return response.data.data;
        } catch (error) {
            if (error.response?.status === 401) {
                return null;
            } else {
            // 실패 시 예외를 throw합니다.
                throw new Error('확인 중 오류가 발생했습니다.');
            }
        }
    }

    const { isLoading, isError, error, data: userData } = useQuery({ 
        queryKey: ['user'],
        queryFn: fetchUserData,
    });

    if (isLoading) {
        return <p>Loading..</p>;
    }
    if (isError) {
        return null;
    }



    return (
        userData &&
        <div className={styles.container}>
            {userData && GetCookie('jwt_token') !== null &&
            <div>
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