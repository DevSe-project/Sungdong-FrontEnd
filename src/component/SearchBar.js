import '../App.css';
import styles from './SearchBar.module.css';

export default function() {

  return (
    <div>
      <div className={styles.searchInputContainer}>
        <input className={styles.searchInput} type='text'/>
        {/* 돋보기 아이콘 */}
        <i class="fas fa-search"/>
      </div>
    </div>
  )
}