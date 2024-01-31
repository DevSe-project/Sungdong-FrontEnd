import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useModalActions, useModalState } from '../../../../Store/DataStore';
import styles from './Deli_InquireTable.module.css';
import InvoiceModal from '../Modal/InvoiceModal';
import DeliveryStateModal from '../Modal/DeliveryStateModal';
import axios from '../../../../axios';
import { GetCookie } from '../../../../customFn/GetCookie';


export default function Deli_InquireTable() {

    // relative modal state
    const { isModal, modalName } = useModalState();
    const { selectedModalOpen } = useModalActions();;

    // 게시물 데이터와 페이지 번호 상태 관리    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    // FetchData
    const fetchDeliveryData = async () => {
        try {
            const token = GetCookie('jwt_token');
            const response = await axios.get(`/delivery/deliveries`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
            console.log('배송 데이터 불러오기에 성공했습니다.');
            return response.data
        } catch (error) {
            throw new Error('배송 데이터 불러오기 중 오류가 발생하였습니다.');
        }
    }
    const { isLoading, isError, error, data: deliveryData } = useQuery({
        queryKey: [`delivery`],
        queryFn: fetchDeliveryData
    })

    // 업데이트된 데이터의 체크 상태를 관리하는 state
    const [checkedItems, setCheckedItems] = useState([]);

    // 배송상태 파싱
    function parseDeliveryState(val) {
        console.log(val);
        const parseVal = parseInt(val);
        switch (parseVal) {
            case 1:
                return '배송 준비';
            case 2:
                return '배송 중';
            case 3:
                return '배송 완료';
            case 4:
                return '배송 지연';
            default:
                alert('배송 상태를 불러들이지 못했습니다.');
                return 'null';
        }
    }

    // 배송 개별 상태 업데이트
    function updateAllState(e, currentStatus) {
        const updateStatus = parseInt(e.target.value, 10);

        if (updateStatus === 1 || updateStatus === 2 || updateStatus === 3) {


        } else {
            alert("잘못된 선택입니다.");
        }
    }

    // 전체 체크박스 업데이트
    function handleAllCheckbox(e) {
        const checked = e.target.checked;

        if (checked) {
            // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
            let idArray = getCurrentPagePosts()?.map((item) => item.order_id);
            setCheckedItems(idArray);
        } else {
            // 모두 체킹 해제
            setCheckedItems([]);
        }
    }

    // 체크박스 개별 업데이트
    function handlePerCheckbox(checked, order_id) {
        if (checked) {
            // 단일 선택 시 체크된 아이템을 배열에 추가
            setCheckedItems(prev => [...prev, order_id]);
        } else {
            // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
            setCheckedItems(checkedItems.filter((el) => el !== order_id));
        }
    }

    // 현재 페이지에 해당하는 게시물 목록 가져오기
    const getCurrentPagePosts = () => {
        if (!deliveryData) {
            return [];
        }
        const startIndex = (currentPage - 1) * itemsPerPage;
        return deliveryData.slice(startIndex, startIndex + itemsPerPage);
    };


    // 배송 상태 변경 모달 열기 조건 확인
    const handleModalOpen = (name) => {
        if (checkedItems.length > 0) {
            selectedModalOpen(name); // 선택된 아이템이 있으면 배송 상태 변경 모달 열기
        } else {
            alert('아이템을 선택하세요.'); // 선택된 아이템이 없으면 경고 메시지 표시
        }
    };

    // 삭제
    const deleteData = async () => {
        if (window.confirm('삭제를 진행하시겠습니까?')) {
            console.log(checkedItems);
            try {
                const token = GetCookie('jwt_token');
                const response = await axios.delete(`/delivery/deliveries/delete/${checkedItems}`, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    }
                });

                // 성공 시 삭제된 데이터를 반환
                if (response.status === 200) {
                    window.location.reload(); // 성공했을 때만 페이지를 새로 고침
                    return response.data;
                }
            } catch (error) {
                console.error('데이터 삭제 중 에러 발생:', error);
                throw error; // 에러를 다시 던져서 호출자에게 알릴 수 있습니다.
            }
        }
    };

    // 데이터 로딩 중 또는 에러 발생 시 처리
    if (isLoading) {
        return <p>Loading...</p>;
    }
    if (isError) {
        return <p>{error.message}</p>;
    }

    return (
        <div style={{ width: '100%' }}>
            {deliveryData ?
                <div className={styles.body}>
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
                            <option value={1}>1</option>
                            <option value={3}>3</option>
                            <option value={5}>5</option>
                        </select>
                    </div>
                    {/* 선택항목일괄처리 */}
                    <div className={styles.selectedHandler}>
                        {/* 배송상태 수정 */}
                        <button
                            className='white_button'
                            onClick={() => { handleModalOpen('DeliveryStateModal') }}>
                            선택 항목 배송상태 수정
                        </button>
                        {/* 송장 수정 */}
                        <button
                            className='white_button'
                            // 송장수정 fn
                            onClick={() => { handleModalOpen('InvoiceModal') }}>
                            선택 항목 송장 수정
                        </button>
                        {/* 일괄 배송 취소 */}
                        <button
                            className='white_button'
                            onClick={() => {
                                deleteData()
                            }}>
                            {/* 배송 상태 리스트에서 삭제 */}
                            선택 항목 배송 취소
                        </button>
                    </div>
                    {/* Main - 배송관리 테이블 리스트업 */}
                    <table>
                        {/* 필드명 */}
                        <thead>
                            <tr>
                                <th>
                                    <input type='checkbox'
                                        checked={checkedItems.length === getCurrentPagePosts().length ? true : false}
                                        onChange={(e) => handleAllCheckbox(e)} />
                                </th>
                                <th>주문번호</th>
                                <th>택배사</th>
                                <th>송장 번호</th>
                                <th>처리상태</th>
                                <th>주문일자</th>
                                <th>상품코드</th>
                                <th>상품명</th>
                                <th>옵션명</th>
                                <th>표준가</th>
                                <th>공급가</th>
                            </tr>
                        </thead>
                        {/* 데이터 맵핑 */}
                        <tbody>
                            {deliveryData &&
                                getCurrentPagePosts()?.map((item, index) => (
                                    <tr key={index}>
                                        {/* 체크박스 */}
                                        <td>
                                            <input type='checkbox'
                                                checked={checkedItems.includes(item.order_id) ? true : false}
                                                onChange={(e) => handlePerCheckbox(e.target.checked, item.order_id)} />
                                        </td>
                                        {/* 주문번호 */}
                                        <td>{item.order_id}</td>
                                        {/* 택배사 */}
                                        <td>{item.delivery_selectedCor}</td>
                                        {/* 송장 번호 */}
                                        <td>{item.delivery_num}</td>
                                        {/* 배송상태 */}
                                        <td>{parseDeliveryState(item.delivery_state)}</td>
                                        {/* 주문일자 */}
                                        <td>{item.order_date}</td>
                                        {/* 상품번호 */}
                                        <td>{item.product_id}</td>
                                        {/* 상품명 */}
                                        <td>{item.product_title}</td>
                                        {/* 옵션 상세 - 선택 옵션이 있을 경우만 표시*/}
                                        <td>{item.optionSelected ? item.optionSelected : "-"}</td>
                                        {/* 표준가 */}
                                        <td>{item.product_price}</td>
                                        {/* 공급가 */}
                                        <td>{item.discountPrice}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {/* 패이지 이동 */}
                    <div className={styles.pageMoveHandler}>
                        <button className='white_button' onClick={() => {
                            if (currentPage !== 1) {
                                setCurrentPage(currentPage - 1);
                            } else {
                                alert("해당 페이지가 가장 첫 페이지 입니다.");
                            }
                        }}>
                            <i className="far fa-angle-left" />
                        </button>
                        <div className={styles.currentPage}> {currentPage} </div>
                        <button className='white_button' onClick={() => {
                            if (deliveryData.length > currentPage * 5) {
                                setCurrentPage(currentPage + 1);
                            } else {
                                alert("다음 페이지가 없습니다.");
                            }
                        }}>
                            <i className="far fa-angle-right" />
                        </button>
                    </div>
                    {/* 배송 상태 변경 모달 */}
                    {
                        isModal && modalName === 'DeliveryStateModal'
                            ?
                            <DeliveryStateModal
                                checkedItems={checkedItems}
                                setCheckedItems={setCheckedItems}
                                updateAllState={updateAllState}
                                deliveryData={deliveryData}
                            />
                            :
                            null
                    }
                    {/* 송장 변경 모달 */}
                    {
                        isModal && modalName === 'InvoiceModal'
                            ?
                            <InvoiceModal
                                checkedItems={checkedItems}
                                setCheckedItems={setCheckedItems}
                                parseDeliveryState={parseDeliveryState}
                                deliveryData={deliveryData}
                            />
                            :
                            null
                    }
                </div>
                :
                <p>정보를 불러오지 못했습니다.</p>}
        </div>
    );
}
