import style from './AdminCategory.module.css';
import { AdminHeader } from './AdminHeader';
import { AdminMenuData } from './AdminMenuData';
export function AdminCategory(){
  return(
    <div>
      <AdminHeader/>
      <div>
        <AdminMenuData/>
        <div>
          {/* 카테고리 목록 추가, 변경, 삭제 (대분류) -> (소분류) */}
        </div>
        <div>
          {/* 카테고리 별 상품 목록 조회 */}
        </div>
      </div>
    </div>
  )
}