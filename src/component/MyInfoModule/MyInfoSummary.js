import styles from './MyInfoSummary.module.css';
import { GetCookie } from '../../customFn/GetCookie';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export default function MyInfoSummary() {

    // -----UserData fetch-----
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
            // 실패 시 예외를 throw합니다.
            throw new Error('확인 중 오류가 발생했습니다.');
        }
    }

    const { isLoading, isError, error, data: users } = useQuery({queryKey: ['users'] });

    if (isLoading) {
        return <p>Loading..</p>;
    }
    if (isError) {
        return <p>에러 : {error.message}</p>;
    }


    return (
        <div>
            {/* 환영문구 */}
            <div>
                <strong>{users.corporationData.companyName && users.corporationData.companyName}</strong>
                <span>님 환영합니다.</span>
            </div>
            {/* 담당자명 | 연락처 */}
            <div>
                <label>
                    담당자
                </label>
            </div>
        </div>
    )
}