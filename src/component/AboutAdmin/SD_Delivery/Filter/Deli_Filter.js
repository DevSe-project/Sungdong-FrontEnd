import { search } from 'fontawesome';
import { useDeliveryFilter_checkbox, useDeliveryFilter_date } from '../../../../Store/DataStore';
import styles from './Deli_Filter.module.css';

export default function Deli_Filter() {
    // Checkbox State
    const { checkboxState, resetCheckboxState, updateCheckboxState, allUpdateCheckboxState } = useDeliveryFilter_checkbox();
    // Date
    const { startDate, endDate, setDateRange, resetDateFilter, filterDate } = useDeliveryFilter_date();


    // 배송 상태 체크박스
    function checkboxFtilter() {
        // 모든 체크박스가 체크됐는지 확인
        const allChecked = Object.values(checkboxState).every(value => value);

        // 모든 체크박스 - 체크/해제
        const handleAllCheck = () => {

            if (allChecked) { // 모든 체크박스가 체크돼있다면
                Object.keys(checkboxState).map((item) => {
                    allUpdateCheckboxState(item, false);
                }); 
            } else { // 체크박스가 하나라도 체크되지 않았다면
                Object.keys(checkboxState).map((item) => {
                    allUpdateCheckboxState(item, true);
                });
            }
        };

        return (
            <div className={styles.deliState_container}>
                <label className={styles.state_checkbox}>
                    <input
                        type='checkbox'
                        name='전체'
                        checked={allChecked}
                        onChange={handleAllCheck}
                    />
                    전체
                </label>
                {Object.keys(checkboxState).map((item) => (
                    <label key={item} className={styles.state_checkbox}>
                        <input
                            type='checkbox'
                            name={item}
                            checked={checkboxState[item]}
                            onChange={() => {
                                updateCheckboxState(item);
                                const changedCheckboxes = Object.keys(checkboxState).filter(key => checkboxState[key]);
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

            console.log(`조회 기간: ${startDate} ~ ${endDate}`);
        };

        return (
            <div className={styles.dateFilter_container}>
                {/* 시작일 */}
                <input
                    type='date'
                    value={startDate}
                    onChange={(e) => setDateRange(e.target.value, endDate)}
                />
                {/* 종료일 */}
                <input
                    type='date'
                    value={endDate}
                    onChange={(e) => setDateRange(startDate, e.target.value)}
                />

                {/* 날짜 필터 버튼들 */}
                <div className={styles.dateButton} onClick={() => handleDateFilter(0)}> 오늘 </div>
                <div className={styles.dateButton} onClick={() => handleDateFilter(7)}> 1 주일 </div>
                <div className={styles.dateButton} onClick={() => handleDateFilter(30)}> 1 개월 </div>
                <div className={styles.dateButton} onClick={() => handleDateFilter(90)}> 3 개월 </div>
                <div className={styles.dateButton} onClick={() => handleDateFilter(180)}> 6 개월 </div>
                <div className={styles.dateButton} onClick={() => handleDateFilter(365)}> 12 개월 </div>
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
                    <input className={styles.search_button} type='submit' value='검색' onClick={search}/>
                    <input className={styles.button} type='reset' onClick={() => {
                        resetCheckboxState();
                        resetDateFilter();
                    }} />
                </div>
            </form>
        </div>
    )
}