import React, { useEffect } from "react";
import { useListActions, useNoticePostList } from "../../Store/DataStore";
import { NoticePostObj } from "../Data/NoticePostObj";
import styles from "./NoticeMini.module.css";
import { useNavigate } from "react-router-dom";

export default function NoticeMini() {
    const navigate = useNavigate();
    const noticePostList = useNoticePostList();
    const { setNoticePostList } = useListActions();

    useEffect(() => {
        setNoticePostList(NoticePostObj);
    }, [setNoticePostList]);

    // 추후에 date를 기준으로 가장 최근에 작성한 순으로 정렬해야 한다(백앤드)
    const latestNotices = noticePostList.slice(0, 5);

    return (
        <div className={styles.noticeMiniContainer}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                borderBottom: "1px solid lightgray",
                alignItems: "center" }}>
                <span style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                }}>공지사항</span>
                <span
                    className={styles.view_all}
                    onClick={() => { navigate('/userservice/notice') }}>전체 보기</span>
            </div>
            <ol className={styles.noticeList}>
                {latestNotices.map((item, index) => (
                    <li key={index} className={styles.noticeItem}>
                        <span className={styles.itemTitle}>{item.title}</span>
                    </li>
                ))}
            </ol>
        </div>
    );
}
