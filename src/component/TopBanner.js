import '../App.css'
import './TopBanner.css';

export default function () {


  return (
    <div className='top_container'>
      {/* 회사소개 */}
      <nav className='top_nav'>
        <div>
          <a className='link' href="">회사소개</a>
        </div>
      </nav>
      {/* 오시는 길 */}
      <nav className='top_nav'>
        <div>
          <a className='link' href="">오시는 길</a>
        </div>
      </nav>
      {/* 오늘의 소식 */}
      <nav className='top_nav' href="">
        <div>
          <a className='link' href="">오늘의 소식</a>
        </div>
      </nav>
      {/* 이달의 이벤트 */}
      <nav className='top_nav'>
        <div>
          <a className='link' href="">이달의 이벤트</a>
        </div>
      </nav>
      {/* 문의하기 */}
      <nav className='top_nav'>
        <div>
          <a className='link'  href="">문의하기</a>
        </div>
      </nav>
      {/* 로그인 */}
      <nav className='top_nav'>
        <div className='top_div'>
          <a className='link_signIn' href="">로그인</a>
        </div>
      </nav>
    </div>
  )
}