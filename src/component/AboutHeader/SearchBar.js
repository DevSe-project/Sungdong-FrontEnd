import styles from './SearchBar.module.css';

export function SearchBar() {
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