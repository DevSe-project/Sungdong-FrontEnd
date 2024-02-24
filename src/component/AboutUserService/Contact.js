import styles from './Contact.module.css';


export function Contact(props) {

  //로그인 정보 불러오기
  return (
    <div className={styles.contact_window}>
      <div className={styles.hello}>
        저희 성동 물산을 찾아주셔서 감사합니다.<br />
        문의 사항은 아래의 문의처로 부탁드리겠습니다.<br />
        감사합니다
      </div>
      <div className={styles.tell}>
        문의처 - 052)269-1840
      </div>
    </div>
  )
}