import { useState } from "react";
import styles from './RelativeJoin.module.css';

export default function CorporateMember() {


    return (
        <div>
            {/* 회원정보 입력란 */}
            <ul className={styles.inputWrap}>

                <div className={styles.indivisualMembers}>기업정보</div>

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
                            placeholder={'ex) 0101'}
                            maxLength="4"
                            size="8"
                        />
                        <input
                            className={styles.phoneNum}
                            type='text'
                            placeholder={'ex) 1010'}
                            maxLength="4"
                            size="8"
                        />
                        <div className={styles.notification}>
                            <strong>문자(SMS) 서비스를 받으시겠습니까?</strong>
                            <div className={styles.YesNo}>
                                <input type="checkbox" name="SMS_Y" /><label for="SMS_Y">예</label>
                            </div>
                            <div className={styles.YesNo}>
                                <input type="checkbox" name="SMS_N" /><label for="SMS_N">아니오</label>
                            </div>
                        </div>
                    </div>
                </li>

                {/* 사업체주소 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>사업체주소</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='text'
                            placeholder={'ㅎㅇ'}
                        />
                    </div>
                </li>

                {/* 업체주소 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>업체주소</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='text'
                            placeholder={'ㅎㅇ'}
                        />
                    </div>
                </li>

            </ul>
        </div>
    )
}