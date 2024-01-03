import styles from './Deli_Filter.module.css';

export default function Deli_Filter() {

    function deliStateFtilter() {
        return (
            <div className={styles.deliState_container}>
                <input type='checkbox' /> <label>전체</label>
                <input type='checkbox' /> <label>배송 준비</label>
                <input type='checkbox' /> <label>배송 진행</label>
                <input type='checkbox' /> <label>배송 완료</label>
                <input type='checkbox' /> <label>배송 지연</label>
            </div>
        )
    }

    function dateFilter() {
        return (
            <div className={styles.dateFilter_container}>
                <input type='date' />
                ~
                <input type='date' />
                <div className={styles.dateButton} onClick={ () => {} }> 오늘 </div>
                <div className={styles.dateButton} onClick={ () => {} }> 1 주일 </div>
                <div className={styles.dateButton} onClick={ () => {} }> 1 개월 </div>
                <div className={styles.dateButton} onClick={ () => {} }> 3 개월 </div>
                <div className={styles.dateButton} onClick={ () => {} }> 6 개월 </div>
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
                    <input className={styles.button} type='submit' value='검색' />
                    <input className={styles.button} type='reset' onClick={() => {}} />
                </div>
            </form>
        </div>
    )
}