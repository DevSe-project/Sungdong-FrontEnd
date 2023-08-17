import styles from './RelativeJoin.module.css';

export default function CorporateMember({address1, openPopup, setAddress1}) {


    return (
        <div>
            {/* 회원정보 입력란 */}
            <ul className={styles.inputWrap}>

                <div className={styles.indivisualMembers}>
                    기업정보
                    <span className={styles.info}>
                        기업회원은 승인 후 가입이 완료됩니다.
                    </span>
                </div>

                {/* 기업명 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>기업명</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='text'
                            placeholder={'ex) OO전자'}
                        />
                    </div>
                </li>

                {/* 사업자등록번호 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>사업자등록번호</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='text'
                            placeholder={'영어, 하이픈[-], 숫자만 입력 가능'}
                        />
                    </div>
                </li>

                {/* 대표자명 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>대표자명</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='text'
                            placeholder={'홍길동'}
                        />
                    </div>
                </li>

                {/* 대표번호 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>대표번호</div>
                    <div className={styles.right}>
                        <input
                            className={styles.phoneNum}
                            type='text'
                            placeholder={'ex) 010'}
                            maxLength="3"
                            size="6"
                        />
                        <input
                            className={styles.phoneNum}
                            type='text'
                            placeholder={'ex) 1234'}
                            maxLength="4"
                            size="8"
                        />
                        <input
                            className={styles.phoneNum}
                            type='text'
                            placeholder={'ex) 5678'}
                            maxLength="4"
                            size="8"
                        />
                        <div className={styles.notification}>
                            <strong>문자(SMS) 서비스를 받으시겠습니까?</strong>
                            <div className={styles.YesNo}>
                                <input type="radio" name="CEO_SMS" id="CEO_SMS_Y" /><label for="CEO_SMS_Y">예</label>
                            </div>
                            <div className={styles.YesNo}>
                                <input type="radio" name="CEO_SMS" id="CEO_SMS_N" /><label for="CEO_SMS_N">아니오</label>
                            </div>
                        </div>
                    </div>
                </li>

                {/* 업체주소 찾기 */}
                <li>
                    <div className={styles.inputContainer}>
                        <div className={styles.left}>주소</div>
                        <div className={styles.right}>
                            <div className={styles.rightInnerContainer}>
                                <div className={styles.searchAddress}>
                                    <input
                                        className={styles.isInput}
                                        type="text" value={address1 && address1.zonecode}
                                        placeholder="우편번호"
                                        readOnly
                                    />
                                    <input
                                        className={styles.searchButton}
                                        type="button"
                                        onClick={() => {
                                            openPopup(setAddress1);
                                        }}
                                        value="우편번호 찾기"
                                    />
                                </div>
                                <div className={styles.inputAddress}>
                                    <input
                                        className={styles.loadname}
                                        type="text"
                                        value={address1 && address1.roadAddress}
                                        placeholder="도로명 주소"
                                        readOnly
                                    />
                                    <input
                                        className={styles.buildingname}
                                        type="text"
                                        value={address1 && address1.buildingName ? `(${address1.bname}, ${address1.buildingName})` : address1 && `(${address1.bname}, ${address1.jibunAddress})`} placeholder="건물 이름 또는 지번 주소"
                                        readOnly
                                    />
                                    <input
                                        className={styles.detailAddress}
                                        type="text"
                                        placeholder="상세주소를 입력해주세요."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    )
}