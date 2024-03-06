import { useEffect } from 'react';
import { useDeliveryFilter } from '../../../../store/DataStore';
import styles from './DeliFilter.module.css';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { check } from 'fontawesome';

export default function DeliFilter({search}) {
    const queryClient = useQueryClient();
    // 쭈~스텐드
    const { deliveryFilter, resetDeliveryFilter, updateCheckboxState, allUpdateCheckboxState, setDateRange, filterDate } = useDeliveryFilter();

    // 컴포넌트가 언마운트 될 때마다 deliveryFilter 상태 리셋
    useEffect(() => {
        resetDeliveryFilter();
    }, [])

    // 🪲Debugging: 필터링에 변경사항이 있을 때마다 deliveryFilter 객체의 상태 출력
    useEffect(() => {
        console.log(deliveryFilter);
    }, [dateFilter, checkboxFtilter]);


    // 배송 상태 체크박스
    function checkboxFtilter() {
        // 모든 체크박스가 체크됐는지 확인
        const allChecked = Object.values(deliveryFilter.checkboxState).every(value => value);

        // 모든 체크박스 - 체크/해제
        const handleAllCheck = () => {

            if (allChecked) { // 모든 체크박스가 체크돼있다면
                Object.keys(deliveryFilter.checkboxState).map((item) => {
                    allUpdateCheckboxState(item, false);
                });
            } else { // 체크박스가 하나라도 체크되지 않았다면
                Object.keys(deliveryFilter.checkboxState).map((item) => {
                    allUpdateCheckboxState(item, true);
                });
            }
        };

        return (
            <div className={styles.deliState_container}>
                <label className={styles.deliveryStateLabel}>
                    <input
                        className={styles.deliveryStateCheckbox}
                        type='checkbox'
                        name='전체'
                        checked={allChecked}
                        onChange={handleAllCheck}
                    />
                    <span>전체</span>
                </label>
                {Object.keys(deliveryFilter.checkboxState).map((item) => (
                    <label key={item} className={styles.deliveryStateLabel}>
                        <input
                            className={styles.deliveryStateCheckbox}
                            type='checkbox'
                            name={item}
                            checked={deliveryFilter.checkboxState[item]}
                            onChange={() => {
                                updateCheckboxState(item);
                                const changedCheckboxes = Object.keys(deliveryFilter.checkboxState).filter(key => deliveryFilter.checkboxState[key]);
                                console.log(`현재 체크된 체크박스: ${changedCheckboxes.join(', ')}`);
                            }}
                        />
                        {item}
                    </label>
                ))}
            </div>
        );
    }


    // 배송일자 조회
    function dateFilter() {
        const handleDateFilter = (days) => {
            const today = new Date();
            const newEndDate = new Date(today);
            const newStartDate = new Date(today);

            newStartDate.setDate(today.getDate() - days);

            if (newStartDate > newEndDate) {
                setDateRange(today.toISOString().split('T')[0], today.toISOString().split('T')[0]);
            } else {
                setDateRange(newStartDate.toISOString().split('T')[0], newEndDate.toISOString().split('T')[0]);
            }

            // 이 부분에 필터링할 데이터를 가져오고 상태 업데이트 예정
            const data = []; // 데이터 가져오는 로직을 구현해야 함
            filterDate(data);
            console.log(`조회 기간: ${deliveryFilter.date.startDate} ~ ${deliveryFilter.date.endDate}`);
        };

        return (
            <div className={styles.dateFilter_container}>
                {/* 시작일 */}
                <input
                    className='date'
                    type='date'
                    value={deliveryFilter.date.startDate}
                    onChange={(e) => setDateRange(e.target.value, deliveryFilter.date.endDate)}
                />
                {/* 종료일 */}
                <input
                    className='date'
                    type='date'
                    value={deliveryFilter.date.endDate}
                    onChange={(e) => setDateRange(deliveryFilter.date.startDate, e.target.value)}
                />

                {/* 날짜 필터 버튼들 */}
                <div className='white_round_button' onClick={() => handleDateFilter(0)}> 오늘 </div>
                <div className='white_round_button' onClick={() => handleDateFilter(7)}> 1 주일 </div>
                <div className='white_round_button' onClick={() => handleDateFilter(30)}> 1 개월 </div>
                <div className='white_round_button' onClick={() => handleDateFilter(90)}> 3 개월 </div>
                <div className='white_round_button' onClick={() => handleDateFilter(180)}> 6 개월 </div>
                <div className='white_round_button' onClick={() => handleDateFilter(365)}> 12 개월 </div>
            </div>
        );
    }


    const filterList = [
        { label: '배송상태', content: checkboxFtilter() },
        { label: '기간', content: dateFilter() },
    ]

    return (
        <div style={{ width: '100%' }}>
            <form className={styles.main}>
                <div style={{ width: '90%', textAlign: 'left', padding: '1.5em', borderBottom: '1px solid lightgray' }}>
                    <h4 style={{ fontSize: '1.2em', fontWeight: '650' }}>필터</h4>
                </div>
                {/* Map */}
                {filterList.map((item, index) => (
                    // List Container
                    <div key={index} className={styles.container}>

                        {/* Label */}
                        <div className={styles.label}>
                            {item.label}
                        </div>

                        {/* Content */}
                        <div className={styles.content}>
                            {item.content}
                        </div>

                    </div>
                ))}
                <div style={{ display: 'flex', gap: '0.5em' }}>
                    <input className='original_button' type='submit' value='검색' onClick={search} />
                    <input className='white_button' type='reset' onClick={() => resetDeliveryFilter()} />
                </div>
            </form>
        </div>
    )
}