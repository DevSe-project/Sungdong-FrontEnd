import '../App.css';
import styles from './SearchBar.module.css';

export default function() {

  return (
    <div>
      {/* Input창 */}
      <div className={styles.searchInputContainer}>
        {/* 돋보기 아이콘 */}
        <input className={styles.searchInput} type='text'/>
        <i class="fas fa-search"/>
      </div>
<<<<<<< HEAD
      {/* 검색Link */}
      <nav className={styles.searchLinkContainer}>
          <a className={styles.searchLink} href="">검색</a>
      </nav>
=======
>>>>>>> 77d1456894daff12628971584b224178aa0e5977
    </div>
  )
}