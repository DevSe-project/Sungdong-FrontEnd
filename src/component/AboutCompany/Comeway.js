import styles from './Comeway.module.css'
import { CategoryBar } from '../AboutHeader/CategoryBar'
import { TopBanner } from '../AboutHeader/TopBanner'
export function Comeway(){
  
  return(
    <div>
      <TopBanner/>
      <CategoryBar/>
    </div>
  )
}