import { CategoryBar } from './component/AboutHeader/CategoryBar'
import { SlideImg } from './component/AboutHeader/SlideImg'
import { TopBanner } from './component/AboutHeader/TopBanner'

export default function MainPage(props) {
  return (
    <div>
      <TopBanner/>
    
      <CategoryBar />

      <SlideImg />
      
    </div>
  )
}