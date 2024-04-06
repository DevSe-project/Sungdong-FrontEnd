import React from 'react';
import styles from './AdminUserFilter.module.css';
import { useUserFilter, useUserFilterActions } from '../../../store/DataStore';

export default function AdminUserFilter(props) {
  const userFilter = useUserFilter();
  const { setUserFilter, resetUserFilter } = useUserFilterActions();

  return (
    <div className={styles.body}>
      {/* TITLE */}
      <div className={styles.title}>
        검색필터
      </div>

      {/* FILTER OPTIONS */}
      <div className={styles.searchRow}>
        <div className={styles.searchGroup}>
          <label htmlFor="cor_corName">기업명</label>
          <input
            id="cor_corName"
            className={styles.input}
            type="text"
            placeholder="기업명"
            value={userFilter.cor_corName}
            onChange={(e) => setUserFilter("cor_corName", e.target.value)}
          />
        </div>

        <div className={styles.searchGroup}>
          <label htmlFor="cor_ceoName">대표명</label>
          <input
            id="cor_ceoName"
            className={styles.input}
            type="text"
            placeholder="대표명"
            value={userFilter.cor_ceoName}
            onChange={(e) => setUserFilter("cor_ceoName", e.target.value)}
          />
        </div>

        <div className={styles.searchGroup}>
          <label htmlFor="cor_num">사업자등록번호</label>
          <input
            id="cor_num"
            className={styles.input}
            type="text"
            placeholder="사업자등록번호"
            value={userFilter.cor_num}
            onChange={(e) => setUserFilter("cor_num", e.target.value)}
          />
        </div>
      </div>

      <div className={styles.searchRow}>
        <div className={styles.searchGroup}>
          {/* 여긴 userType의 id와 name으로 맵핑 */}
          <label htmlFor="userType">고객유형</label>
          <select
            className={styles.select} id="userType_id"
            value={userFilter.userType_id || ""}
            onChange={(e) => setUserFilter("userType_id", e.target.value)}
          >
            <option value="">고객유형</option>
            <option value={0}>비회원</option>
            <option value={1}>실사용자 A등급</option>
            <option value={2}>납품업자 A등급</option>
            <option value={12}>실사용자 B등급</option>
            <option value={13}>실사용자 C등급</option>
            <option value={14}>실사용자 D등급</option>
            <option value={22}>납풉업자 B등급</option>
            <option value={23}>납풉업자 C등급</option>
            <option value={24}>납풉업자 D등급</option>
            <option value={100}>관리자</option>
          </select>
        </div>

        <div className={styles.searchGroup}>
          {/* 여기 managers 테이블의 name들로 맵핑 */}
          <label htmlFor='managerName'>담당자</label>
          <select
            className={styles.select} id="managerName"
            value={userFilter.managerName || ""}
            onChange={e => { setUserFilter("managerName", e.target.value); console.log(`유저필터: ${userFilter.managerName}`) }}>
            <option value="">담당자</option>
            <option value="박형조">박형조</option>
            <option value="엄지석">엄지석</option>
            <option value="김태훈">김태훈</option>
            <option value="일큐이">일큐이</option>
          </select>
        </div>
      </div>

      {/* Button */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5em' }}>
        <button className='white_round_button' onClick={() => resetUserFilter()}>초기화</button>
        <button className='original_round_button' onClick={(e) => {
          e.preventDefault();
          props.onFiltering(userFilter);
        }}>검색하기</button>
      </div>
    </div>
  );
}
