import { CategoryBar } from "../AboutHeader/CategoryBar";
import { TopBanner } from "../AboutHeader/TopBanner";

export default function AskHome() {
    return(
        <div>
            <TopBanner />
            <CategoryBar />
            <div>문의 방법</div>
            <div >
                <div>질문게시판</div>
                <div>1:1 채팅</div>
                <div>실시간 채팅</div>
            </div>
        </div>
    )
}