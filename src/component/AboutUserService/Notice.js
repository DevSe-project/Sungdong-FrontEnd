import React, { useState } from 'react';
import styles from './Notice.module.css';
import { TopBanner } from '../TemplateLayout/AboutHeader/TopBanner';
import NoticeDetail from './NoticeDetail';
import { NoticeObj } from '../Data/NoticeObj';

export function Notice(props) {
  const [list, setList] = useState(NoticeObj);
  const [isModal, setIsModal] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  // 글 위치에서 enter를 누르면 해당 페이지가 열림
  const onOpen = (event, index) => {
    if (event.key === 'Enter') {
      setIsModal(true);
      setSelectedItemIndex(index);
    }
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
              </tr>
            </thead>
            <tbody>
              {list.map((item, index) => (
                <tr key={index}
                  className={styles.row}
                  onClick={() => { setIsModal(true); setSelectedItemIndex(index); }}
                  onKeyPress={(event) => onOpen(event, index)} // Enter 키 이벤트 처리
                  tabIndex={0} // 이렇게 하면 포커스를 받을 수 있게 됩니다
                >
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.writer}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* --------------Detail-Modal-------------- */}
        {isModal ?
          <div className={styles.modalOverlay}>
            <NoticeDetail
              list={list}
              setList={setList}
              isModal={isModal}
              setIsModal={setIsModal}
              onClose={() => setSelectedItemIndex(null)} // 모달이 닫힐 때 selectedItemIndex 초기화
              selectedItemIndex={selectedItemIndex} // 선택된 항목 인덱스 전달
            />
          </div>
          : null}
      </div>
    </div>
  );
}
