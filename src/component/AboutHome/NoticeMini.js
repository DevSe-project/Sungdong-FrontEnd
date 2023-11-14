import React, { useEffect } from "react";
import { useListActions, useNoticePostList } from "../../Store/DataStore";
import { NoticePostObj } from "../Data/NoticePostObj";
import styles from "./NoticeMini.module.css"; // Import your CSS module

export default function NoticeMini() {
  const postList = useNoticePostList();
  const { setNoticePostList } = useListActions();

  useEffect(() => {
    // Load data from the local file (NoticePostObj.js)
    setNoticePostList(NoticePostObj);
  }, [setNoticePostList]);

  return (
    <div className={styles.noticeMiniContainer}>
      <h3>공지사항</h3>
      <ol className={styles.noticeList}>
        {postList.map((item, index) => (
          <li key={index} className={styles.noticeItem}>
            <ul>
              <li>{item.title}</li>
              <li>{item.contents}</li>
              <li>{item.writer}</li>
              <li>{item.date}</li>
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
