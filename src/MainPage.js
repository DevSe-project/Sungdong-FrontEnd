import { CategoryBar } from './component/CategoryBar'
import { SlideImg } from './component/SlideImg'
import { TopBanner } from './component/TopBanner'

export default function MainPage(props) {

  return (
    <div>
      <TopBanner/>
    
      <CategoryBar />

      <SlideImg />

      <hr/><br/>

    </div>
  )
}