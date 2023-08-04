import '../App.css';
import styles from './SearchBar.module.css';

export default function() {

  return (
<<<<<<< HEAD
    <div className='search-container'>
      
      {/* Input창 */}
      <div className='search-input-container'>
        <input className='search-input' type='text'/>
        <i class="fas fa-search"></i>
      </div>

=======
    <div className={styles.searchContainer}>

      {/* 돋보기 아이콘 들어갈 예정 */}
      
      {/* Input창 */}
      <div className={styles.searchInputContainer}>
        <input className={styles.searchInput} type='text'/>
      </div>
      {/* 검색Link */}
      <nav className={styles.searchLinkContainer}>
          <a className={styles.searchLink} href="">검색</a>
      </nav>
>>>>>>> 4399c62891cc561e44e6c99857ab3b043d59653e
    </div>
  )
}