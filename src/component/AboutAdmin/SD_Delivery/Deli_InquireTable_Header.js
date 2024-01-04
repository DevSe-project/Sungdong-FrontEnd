import styles from './Deli_InquireTable_Header.module.css';

export default function Deli_InquireTable_Header() {

    return (
        <div className={styles.body}>
            {/* Post */}
            <div className={styles.header_txt}>
                목록
            </div>
            {/* Number of Denote */}
            <select className={styles.denoteNumber_select}>
                <option>10</option>
                <option>30</option>
                <option>50</option>
            </select>
        </div>
    )
}