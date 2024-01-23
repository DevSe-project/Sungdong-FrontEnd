import styles from './MyInfoSummary.module.css';
import { useQuery } from '@tanstack/react-query';
import fetchDataMiddleware from '../../middleware/FetchDataMiddleware';

export default function MyInfoSummary() {

    const fetchUserData = async () => {
        const userData = await fetchDataMiddleware('/auth/users');
        console.log(userData);
    };

    const { isLoading, isError, error, data: users } = useQuery({ queryKey: ['users'] });

    // 백앤드 연결 후, 실사용 코드
    // const { isLoading, isError, error, data: users } = useQuery(
    //     ['users'], // Query Key
    //     async () => {
    //         const userData = await fetchDataMiddleware('/auth/users'); // middleware사용하여 코드 간소화함
    //         return userData;
    //     }
    // );


    if (isLoading) {
        return <p>Loading..</p>;
    }
    if (isError) {
        return <p>에러 : {error.message}</p>;
    }


    return (
        <div className={styles.container}>
            {/* 환영문구 */}
            <div className={styles.header}>
                <span>(주)BIGDEV</span>
                <span>님 환영합니다.</span>
            </div>
            {/* 담당자명 | 연락처 */}
            <div>
                <span>담당자</span>
                <span>박형조</span>
                <span>연락처 010-1234-5678</span>
            </div>
        </div>
    )
}