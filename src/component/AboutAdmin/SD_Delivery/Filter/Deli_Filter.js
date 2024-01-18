import { useDeliveryFilter_checkbox, useDeliveryFilter_date } from '../../../../Store/DataStore';
import styles from './Deli_Filter.module.css';

export default function Deli_Filter() {
    // Checkbox State
    const { checkedState, resetDeliveryFilter, updateCheckedState } = useDeliveryFilter_checkbox();
    // Date
    const { startDate, endDate, setDateRange, filterData } = useDeliveryFilter_date();


    function deliStateFtilter() {
        return (
            <div className={styles.deliState_container}>
                {
                    Object.keys(checkedState).map((item) => (
                        <label key={item} className={styles.state_checkbox}>
                            <input
                                type='checkbox'
                                name={item}
                                checked={checkedState[item]}
                                onChange={() => {
                                    updateCheckedState(item)

                                }}
                            />
                            {item}
                        </label>
                    ))
                }
            </div>
        )
    }

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
            filterData(data);

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
        { label: '배송상태', content: deliStateFtilter() },
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
                    <input className={styles.search_button} type='submit' value='검색' />
                    <input className={styles.button} type='reset' onClick={() => { }} />
                </div>
            </form>
        </div>
    )
}