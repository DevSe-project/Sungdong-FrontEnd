import style from './Questions.module.css';
import { BoardObj } from '../Data/BoardObj';


export default function Questions() {
    return(
        <div>
            {/* 게시글 검색 input */}
            <div className={style.searchContainer}>
                <label for='search_input' className={style.label_input}>게시글 검색</label>
                <input type='text' id='search_input' className={style.search_input}/>
            </div>
            {/* 게시글 List(10개씩) */}
            <ul>
                {BoardObj.map( (item, index) => {
                    return <li key={index}>
                        {item.title}
                    </li>
                })}
            </ul>
            {/* 페이지 번호() */}
        </div>
    )
}