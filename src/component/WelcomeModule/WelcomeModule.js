import styles from './WelcomeModule.module.css';
import { useQuery } from '@tanstack/react-query';
import { GetCookie } from '../../customFn/GetCookie';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../customFn/useFetch'

export default function WelcomeModule() {
    const navigate = useNavigate();
    const {fetchServer, fetchGetServer} = useFetch();

    // -----UserData fetch
    const fetchUserData = async () => {
        return fetchGetServer(`/auth/info`, 1);
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