import styles from './Modal.module.css';

// 비밀번호찾기 모달창
export default function FindPw(props) {

    return (
        <div className={styles.inputContainer}>
            <div className={styles.pw_layout}>
                <div className={styles.idContainer}>
                    <div className={styles.idInput_Container}>
                        <div className={styles.nameContainer}>
                            <div className={styles.label}>아이디</div>
                            <div className={styles.input}>
                                <input
                                    type='text'
                                    placeholder='아이디'
                                    className={styles.input}
                                    value={props.inputForFind.userId}
                                    onChange={(e) => {
                                        const inputCeoName = {
                                            ...props.inputForFind,
                                            userId: e.target.value
                                        };
                                        props.setInputForFind(inputCeoName);
                                    }}
                                    onKeyDown={props.handleEnter_pwFind}
                                />
                            </div>
                        </div>
                        <div className={styles.phoneNumContainer}>
                            <div className={styles.label}>사업자등록번호</div>
                            <div className={styles.input}>
                                <input
                                    type='text'
                                    placeholder='예)000-00-00000'
                                    className={styles.input}
                                    value={props.inputForFind.cor_num}
                                    onChange={(e) => {
                                        const inputCeoName = {
                                            ...props.inputForFind,
                                            cor_num: e.target.value
                                        };
                                        props.setInputForFind(inputCeoName);
                                    }}
                                    onKeyDown={props.handleEnter_pwFind}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.goResetPassword} onClick={props.checking_FindPw}>
                    찾기
                </div>
            </div>
        </div>
    )
}