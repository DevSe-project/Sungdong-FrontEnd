import React from 'react';
import styles from './Footer.module.css'; // CSS 파일 불러오기

export function Footer() {
  return (
    <div className={styles.footer_container}>
      <div className={styles.footer_content}>
        <div className={styles.footer_section}>
          <h2>회사 정보</h2>
          <ul>
            <li>회사명: Sungdong </li>
            <li>대표명: 김웅규</li>
            <li>주소: 울산광역시 남구 산업로 440번길 8 (주)성동물산 </li>
            <li>사업자등록번호: 589-88-00817</li>
          </ul>
        </div>
        <div className={styles.footer_section}>
          <h2>고객 지원</h2>
          <ul>
            <li>고객센터: 010-8507-0880</li>
            <li>이메일: sd2691840@naver.com</li>
          </ul>
        </div>
        <div className={styles.footer_section}>
          <h2>소셜 미디어</h2>
          <ul>
            <li>Blog</li>
            <li>Naver Cafe</li>
            <li>Facebook</li>
            <li>Band</li>
          </ul>
        </div>
      </div>
      <div className={styles.footer_bottom}>
        © 2024 SUNGDONG Shopping. All rights reserved.
      </div>
    </div>
  );
}
