import '../App.css';
import './SearchBar.css';

export default function() {

  return (
    <div className='search-container'>

      {/* 돋보기 아이콘 들어갈 예정 */}
      
      {/* Input창 */}
      <div className='search-input-container'>
        <input className='search-input' type='text'/>
      </div>
      {/* 검색Link */}
      <nav className='search-link-container'>
          <a className='search-link' href="">검색</a>
      </nav>
    </div>
  )
}