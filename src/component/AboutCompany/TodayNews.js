import styles from './TodayNews.module.css'
import { TopBanner } from '../AboutHeader/TopBanner'
import { useState } from 'react'
import { TodayNewsCard } from './TodayNewsCard'
import { TodayNewsList } from './TodayNewsList'
export function TodayNews(props){
  const [filterList, setFilterList] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [filterSearch, setFilterSearch] = useState('제목');

  return( 
    <div>
      <TopBanner data={props.data} setData={props.setData} categoryData={props.categoryData} setCategoryData={props.setCategoryData} login={props.login} setLogin={props.setLogin} iconHovered={props.iconHovered} iconMouseEnter={props.iconMouseEnter} iconMouseLeave={props.iconMouseLeave} icon_dynamicStyle={props.icon_dynamicStyle} text_dynamicStyle={props.text_dynamicStyle} category_dynamicStyle={props.category_dynamicStyle} iconOnClick={props.iconOnClick} menuOnClick={props.menuOnClick} menu_dynamicStyle={props.menu_dynamicStyle} />
      <main className={styles.body}>
        <div className={styles.title}>
          <h1>오늘의 뉴스</h1>
          <div className={styles.contentsFilter}>
            <p 
            style={{cursor: 'pointer'}} 
            onClick={()=>setFilterList(false)}>
              <i className="fas fa-object-ungroup"/> 
              카드 별 보기
            </p>
            <p 
            style={{cursor: 'pointer'}} 
            onClick={()=>setFilterList(true)}>
              <i className="fas fa-bars"/> 
              목록 별 보기
            </p>
          </div>
        </div>
        <div className={styles.searchContainer}>
          <div onClick={()=>setFilterModal(!filterModal)} className={styles.searchFilter}>
            <div>
              <span>
                {filterSearch}
              </span>
            </div>
            <div>
              <i 
              style={{color:'gray'}} 
              className={filterModal 
              ? 'fas fa-angle-up' 
              : 'fas fa-angle-down'}
              />
            </div>
            {props.todayTopicData && filterModal &&
            <div className={styles.filterUI}>
              <ul className={styles.filter}>
                <li 
                style={filterSearch === '제목' ? {fontWeight: '650'} : null}
                onClick={()=>setFilterSearch('제목')}
                className={styles.filterInner}
                > 제목 </li>
                <li 
                style={filterSearch === '내용' ? {fontWeight: '650'} : null} 
                onClick={()=>setFilterSearch('내용')}
                className={styles.filterInner}
                > 내용 </li>
              </ul>
            </div>
            }
          </div>
          <div className={styles.searchInputBox}>
            <input className={styles.searchInput} type='search'/>
          </div>
          <button className={styles.searchButton}>검색</button>
        </div>
        {/* 필터에 따라 표시되는 형태가 다름 */}
        {!filterList 
        ? <TodayNewsCard todayTopicData={props.todayTopicData} setTodayTopicData={props.setTodayTopicData} />
        : <TodayNewsList todayTopicData={props.todayTopicData} setTodayTopicData={props.setTodayTopicData} />
        }
      </main>
    </div>
  )
}