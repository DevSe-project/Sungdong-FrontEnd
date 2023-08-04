import '../App.css';
import './SearchBar.css';

export default function() {

  return (
    <div className='search-container'>
      
      {/* Input창 */}
      <div className='search-input-container'>
        <input className='search-input' type='text'/>
        <i class="fas fa-search"></i>
      </div>

    </div>
  )
}