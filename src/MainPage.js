import './MainPage.css'
import CategoryBar from './component/CategoryBar'
import { TopBanner } from './component/TopBanner'
import MainLogo from './component/MainLogo'
import SearchBar from './component/SearchBar'


export default function MainPage() {

  return (
    <div>

      <TopBanner />
      
      <MainLogo />

      <SearchBar />
      
      <CategoryBar />

    </div>
  )
}