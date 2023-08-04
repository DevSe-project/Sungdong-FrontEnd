import '../App.css';
import styles from './SearchBar.module.css';

export default function() {

  return (
    <div className={styles.searchContainer}>

      {/* 돋보기 아이콘 들어갈 예정 */}
      
      {/* Input창 */}
      <div className={styles.searchInputContainer}>
        <input className={styles.searchInput} type='text'/>
        <i class="fas fa-search"></i>
      </div>
    </div>
  )
}