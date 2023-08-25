import { useNavigate } from 'react-router-dom';
import { TodayNewsCard } from '../AboutCompany/TodayNewsCard';
import styles from './TodayTopicList.module.css'
export function TodayTopicList(props){
  const navigate = useNavigate();
  return(
    <div className={styles.head}>
      <div className={styles.headerTag}>
        <h2 className={styles.newItem}>오늘의 뉴스</h2>
        <div onClick={()=> navigate("/todayTopic/1")} className={styles.moreItem}>
          더보기&nbsp;<i className="far fa-chevron-right"/>
        </div>
      </div>
      <TodayNewsCard todayTopicData={props.todayTopicData} setTodayTopicData={props.setTodayTopicData}/>
    </div>
  )
}