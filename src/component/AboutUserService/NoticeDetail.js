import styles from './NoticeDetail.module.css';


export default function NoticeDetail(props) {
    

    return (
        <div className={styles.detailContainer}>
            제목 : {props.list[0].title}
        </div>
    )
}