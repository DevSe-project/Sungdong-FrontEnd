import { AdminHeader } from "../Layout/Header/AdminHeader";
import { AdminMenuData } from "../Layout/SideBar/AdminMenuData";
import AdminUserFilter from "./AdminUserFilter";
import AdminUserSort from "./AdminUserSort";
import axios from '../../../axios';

export default function AdmiNMyUserList() {

  //유저 필터링 Fetch
  const fetchFilteredUserData = async (userFilterData) => {
    try {
      const response = await axios.post("/auth/userFilter",
        JSON.stringify(
          userFilterData
        ),
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      )
      // 성공 시 추가된 상품 정보를 반환합니다.
      return response.data;
    } catch (error) {
      // 실패 시 예외를 throw합니다.
      throw new Error('조건에 일치하는 유저가 없습니다.');
    }
  }
  const { mutate: filterMutation } = useMutation({ mutationFn: fetchFilteredUserData });
  const onFiltering = () => {
    filterMutation(userFilter, {
      onSuccess: (data) => {
        console.log('user Filtered successfully:', data);
        alert(data.message);
        // 다른 로직 수행 또는 상태 업데이트
        queryClient.setQueryData(['users'], () => {
          return data.data
        })
      },
      onError: (error) => {
        console.error('user Filtered failed:', error);
        // 에러 처리 또는 메시지 표시
        alert(error.message);
      },
    });
  };

  return (
    <div>
      <AdminHeader />
      <div className={styles.body}>
        <AdminMenuData />
        <div className={styles.mainContainer}>
          <div className={styles.filtSortContainer}>
            <AdminUserFilter onFiltering={onFiltering} />
            <AdminUserSort sortBy={sortBy} onSort={handleSort} />
          </div>
          {/* Header */}
          <div className='MediumHeader'>
            <div className='HeaderTxt'>
              목록
            </div>
            <select
              className='select'
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  )
}