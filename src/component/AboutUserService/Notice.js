import React, { useState } from 'react';
import styles from './Notice.module.css';
import { TopBanner } from '../AboutHeader/TopBanner';
import NoticeDetail from './NoticeDetail';
import { NoticeObj } from '../Data/NoticeObj';

export function Notice(props) {
  const [list, setList] = useState(NoticeObj);
  const [isDetailModal, setIsDetailModal] = useState(false);
  // 글 클릭 > 해당 글의 상세페이지로 이동

  // modal escape
  const onClose = (event) => {
    if(event.key === 'Escape' || event.key === 'esc')
      setIsDetailModal(false);
  }

  return (
    <div className={styles.body}>
    {/* TopBanner */}
    <TopBanner menuOnClick={props.menuOnClick} menu_dynamicStyle={props.menu_dynamicStyle} data={props.data} setData={props.setData} categoryData={props.categoryData} setCategoryData={props.setCategoryData} login={props.login} setLogin={props.setLogin} iconHovered={props.iconHovered} iconMouseEnter={props.iconMouseEnter} iconMouseLeave={props.iconMouseLeave} icon_dynamicStyle={props.icon_dynamicStyle} text_dynamicStyle={props.text_dynamicStyle} category_dynamicStyle={props.category_dynamicStyle} iconOnClick={props.iconOnClick} />
    
    <div className={styles.noticeContainer}>
      {/* --------------header-------------- */}
      <div className={styles.header}>
        <h1 className={styles.title}>공지사항</h1>
        <div className={styles.searchContainer}>
          <label className={styles.search_label} htmlFor="search">검색:</label>
          <input
            className={styles.search_input}
            type="text"
            id="search"
            placeholder="검색어를 입력하세요"
          />
        </div>
      </div>
      {/* --------------listContainer-------------- */}
      <div className={styles.listContainer}>
        <table className={styles.listTable}>
          <thead>
            <tr>
              <th>구분</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index} 
                className={styles.row}
                onClick={() => { setIsDetailModal(!isDetailModal) }}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.writer}</td>
                <td>{item.date}</td>
                <td>{item.view}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* --------------Detail-Modal-------------- */}
      {isDetailModal ? 
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <NoticeDetail list={list} setList={setList} />
          </div>
        </div>
      : null}
    </div>
    </div>
  );
}
