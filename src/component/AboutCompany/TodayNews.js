import styles from './TodayNews.module.css'
import { CategoryBar } from '../AboutHeader/CategoryBar'
import { TopBanner } from '../AboutHeader/TopBanner'
import { useState } from 'react'
import { TodayNewsCard } from './TodayNewsCard'
import { TodayNewsList } from './TodayNewsList'
export function TodayNews(){
  const [filterList, setFilterList] = useState(false);
  return(
    <div>
      <TopBanner/>
      <CategoryBar/>
      <main className={styles.body}>
        <div className={styles.title}>
          <h1>오늘의 소식</h1>
          <div className={styles.contentsFilter}>
            <p style={{cursor: 'pointer'}} onClick={()=>setFilterList(false)}><i class="fas fa-object-ungroup"/> 카드 별 보기</p>
            <p style={{cursor: 'pointer'}} onClick={()=>setFilterList(true)}><i class="fas fa-bars"/> 목록 별 보기</p>
          </div>
        </div>
        <div className={styles.searchContainer}>
          <div className={styles.searchFilter}>
            <div><span>제목</span></div>
            <div><i style={{color:'gray'}} className="fas fa-angle-down"/></div>
          </div>
          <div className={styles.searchInputBox}>
            <input className={styles.searchInput} type='search'/>
          </div>
          <button className={styles.searchButton}>검색</button>
        </div>
        {!filterList 
        ? <TodayNewsCard/>
        : <TodayNewsList/>
        }
      </main>
    </div>
  )
}