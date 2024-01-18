import { useDeliveryFilterState, useDeliveryFilterActions } from '../../../../Store/DataStore';
import styles from './Deli_Filter.module.css';

export default function Deli_Filter() {

    const { checkedState, date } = useDeliveryFilterState();
    const { updateCheckedState } = useDeliveryFilterActions();


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
        return (
            <div className={styles.dateFilter_container}>
                {/* 시작 */}
                <input className={styles.date} type='date' />
                ~
                {/* 끝 */}
                <input className={styles.date} type='date' />
                <div className={styles.dateButton} onClick={() => { }}> 오늘 </div>
                <div className={styles.dateButton} onClick={() => { }}> 1 주일 </div>
                <div className={styles.dateButton} onClick={() => { }}> 1 개월 </div>
                <div className={styles.dateButton} onClick={() => { }}> 3 개월 </div>
                <div className={styles.dateButton} onClick={() => { }}> 6 개월 </div>
            </div>
        )
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