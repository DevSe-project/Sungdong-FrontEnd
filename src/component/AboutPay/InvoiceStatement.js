import styles from "./InvoiceStatement.module.css";
export function InvoiceStatement() {
  const arrayTableList = (blue) => {
    let tableArray = [];
    for (let i = 0; i < 10; i++) {
      tableArray.push(1);
    }
    return (
      <tbody>
        {tableArray.map((item, key) => {
          return (
            <tr className={blue==="blue" ? styles.blueTr : styles.redTr}>
              <td className={blue === "blue" ? styles.blue : styles.red}>{item}</td>
              <td colSpan={2} className={blue === "blue" ? styles.blue : styles.red}>{item}</td>
              <td className={blue === "blue" ? styles.blue : styles.red}>{item}</td>
              <td className={blue === "blue" ? styles.blue : styles.red}>{item}</td>
              <td className={blue === "blue" ? styles.blue : styles.red}>{item}</td>
              <td className={blue === "blue" ? styles.blue : styles.red}>{item}</td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  return (
    <div>
      <section className={styles.component}>
        <article className={styles.producer}>
          <div className={styles.titleBox}>
            <div className={styles.title}>
              <pre className={styles.h1}>거 래 명 세 서</pre>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                alignItems: "center",
              }}
            >
              <div className={styles.lowTitle}>
                <pre style={{ color: "red" }}>거래명세서 번호: </pre>
                <pre style={{ color: "red" }}>(공급자 보관용)</pre>
                <pre style={{ color: "red" }}> 년 월 일</pre>
              </div>
            </div>
          </div>
          <div className={styles.tableBox}>
            <table>
              <tr className={styles.red}>
                <th className={styles.red} style={{ width: "10px" }} rowSpan={3}>
                  <span>공 급 자</span>
                </th>
                <th className={styles.red} style={{ width: "40px" }}>등 록 번 호</th>
                <td className={styles.red}></td>
                <td className={styles.red}></td>
                <td className={styles.red}></td>
              </tr>
              <tr>
                <th className={styles.red}>상 호</th>
                <td className={styles.red}></td>
                <th className={styles.red} style={{ width: "24px" }}>성명</th>
                <td className={styles.red}></td>
              </tr>
              <tr>
                <th className={styles.red}>주 소</th>
                <td className={styles.red}></td>
                <td className={styles.red}></td>
                <td className={styles.red}></td>
              </tr>
            </table>
            <table>
              <tr>
                <th className={styles.red} style={{ width: "10px" }} rowSpan={3}>
                  <span>공 급 받 는 자</span>
                </th>
                <th className={styles.red} style={{ width: "40px" }}>등 록 번 호</th>
                <td className={styles.red}></td>
                <td className={styles.red}></td>
                <td className={styles.red}></td>
              </tr>
              <tr>
                <th className={styles.red}>상 호</th>
                <td className={styles.red}></td>
                <th className={styles.red} style={{ width: "24px" }}>성명</th>
                <td className={styles.red}></td>
              </tr>
              <tr>
                <th className={styles.red}>주 소</th>
                <td className={styles.red}></td>
                <td className={styles.red}></td>
                <td className={styles.red}></td>
              </tr>
            </table>
          </div>
          <div className={styles.sumBox}>
            <span>합계금액: </span>
            <span>영수(청구)</span>
          </div>
          <table>
            <thead>
              <tr className={styles.red}>
                <th className={styles.red}>번호</th>
                <th className={styles.red} colSpan={2}>품 명 및 규 격</th>
                <th className={styles.red}>수 량</th>
                <th className={styles.red}>단 가</th>
                <th className={styles.red}>공 급 가 액</th>
                <th className={styles.red}>세 액</th>
              </tr>
            </thead>
            {arrayTableList("red")}
            <tfoot>
              <th className={styles.red}>인수자</th>
              <th className={styles.red}></th>
              <th className={styles.red} style={{ width: "30px" }}>계</th>
              <th className={styles.red}></th>
              <th className={styles.red}></th>
              <th className={styles.red}></th>
              <th className={styles.red}></th>
            </tfoot>
          </table>
        </article>
        <article className={styles.supplier}>
          <div className={styles.titleBox}>
            <div className={styles.title}>
              <pre
                className={styles.h1}
                style={{ color: "blue", borderBottom: "3px double blue" }}
              >
                거 래 명 세 서
              </pre>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                alignItems: "center",
              }}
            >
              <div className={styles.lowTitle} style={{ color: "blue" }}>
                <pre style={{ color: "blue" }}>거래명세서 번호: </pre>
                <pre style={{ color: "blue" }}>(공급자 보관용)</pre>
                <pre style={{ color: "blue" }}> 년 월 일</pre>
              </div>
            </div>
          </div>
          <div className={styles.tableBox}>
            <table>
              <tr
                style={{
                  border: "1px solid blue",
                  background: "none",
                  color: "blue",
                }}
              >
                <th
                  style={{
                    width: "10px",
                    border: "1px solid blue",
                    background: "none",
                    color: "blue",
                  }}
                  rowSpan={3}
                >
                  <span>공 급 자</span>
                </th>
                <th className={styles.blue} style={{ width: "40px" }}>
                  등 록 번 호
                </th>
                <td className={styles.blue}></td>
                <td className={styles.blue}></td>
                <td className={styles.blue}></td>
              </tr>
              <tr>
                <th className={styles.blue}>상 호</th>
                <td className={styles.blue}></td>
                <th className={styles.blue} style={{ width: "24px" }}>
                  성명
                </th>
                <td className={styles.blue}></td>
              </tr>
              <tr>
                <th className={styles.blue}>주 소</th>
                <td className={styles.blue}></td>
                <td className={styles.blue}></td>
                <td className={styles.blue}></td>
              </tr>
            </table>
            <table>
              <tr className={styles.blue}>
                <th
                  className={styles.blue}
                  style={{ width: "10px" }}
                  rowSpan={3}
                >
                  <span>공 급 받 는 자</span>
                </th>
                <th className={styles.blue} style={{ width: "40px" }}>
                  등 록 번 호
                </th>
                <td className={styles.blue}></td>
                <td className={styles.blue}></td>
                <td className={styles.blue}></td>
              </tr>
              <tr className={styles.blue}>
                <th className={styles.blue}>상 호</th>
                <td className={styles.blue}></td>
                <th className={styles.blue} style={{ width: "24px" }}>
                  성명
                </th>
                <td className={styles.blue}></td>
              </tr>
              <tr className={styles.blue}>
                <th className={styles.blue}>주 소</th>
                <td className={styles.blue}></td>
                <td className={styles.blue}></td>
                <td className={styles.blue}></td>
              </tr>
            </table>
          </div>
          <div
            className={styles.sumBox}
            style={{
              color: "blue",
              borderTop: "1px solid blue",
              borderBottom: "1px solid blue",
              backgroundColor: "lightblue",
            }}
          >
            <span style={{ color: "blue" }}>합계금액: </span>
            <span style={{ color: "blue" }}>영수(청구)</span>
          </div>
          <table>
            <thead>
              <tr className={styles.blue}>
                <th className={styles.blue}>번호</th>
                <th className={styles.blue} colSpan={2}>
                  품 명 및 규 격
                </th>
                <th className={styles.blue}>수 량</th>
                <th className={styles.blue}>단 가</th>
                <th className={styles.blue}>공 급 가 액</th>
                <th className={styles.blue}>세 액</th>
              </tr>
            </thead>
            {arrayTableList("blue")}
            <tfoot>
              <th className={styles.blue}>인수자</th>
              <th className={styles.blue}></th>
              <th className={styles.blue} style={{ width: "30px" }}>
                계
              </th>
              <th className={styles.blue}></th>
              <th className={styles.blue}></th>
              <th className={styles.blue}></th>
              <th className={styles.blue}></th>
            </tfoot>
          </table>
        </article>
      </section>
      <footer>
        <div>
          <legend>취급품목</legend>
        </div>
        <div>
          <div>
            <div></div>
            <div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div></div>
        </div>
        <div></div>
      </footer>
    </div>
  );
}
