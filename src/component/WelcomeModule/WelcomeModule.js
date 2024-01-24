import styles from './WelcomeModule.module.css';
import { useQuery } from '@tanstack/react-query';
import fetchDataMiddleware from '../../middleware/FetchDataMiddleware';

export default function WelcomeModule() {

    const { isLoading, isError, error, data: userData } = useQuery({
        queryKey: ['users'],
        queryFn: fetchDataMiddleware('/auth/users')
    });


    if (isLoading) {
        return <p>Loading..</p>;
    }
    if (isError) {
        return <p>에러 : {error.message}</p>;
    }


    if (userData) {
        return (
            <div className={styles.container}>
                {/* 환영문구 */}
                <div className={styles.header}>
                    <span style={{textAlign: 'left'}}>
                        <span style={{fontWeight: '900'}}>(주)BIGDEV</span> 님</span>
                    <span style={{textAlign: 'right'}}> 환영합니다.</span>
                </div>
                {/* 담당자명 | 연락처 */}
                <div className={styles.managerInfo}>
                    <div><span>담당자: </span><span>박형조</span></div>
                    <div><span>연락처: </span><span>010-1234-5678</span></div>
                </div>
            </div>
        )
    } else {
        <p>null</p>
    }
}