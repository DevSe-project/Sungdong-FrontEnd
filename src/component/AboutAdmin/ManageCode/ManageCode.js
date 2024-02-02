
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './ManageCode.module.css';
import { AdminHeader } from "../Layout/Header/AdminHeader";
import { AdminMenuData } from "../Layout/SideBar/AdminMenuData";
import axios from '../../../axios';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Managecode() {

  const queryClient = useQueryClient();

    //코드 데이터 가져오기 fetch
    const fetchgetAllCodeData = async () => {
      try {
      const response = await axios.get("/auth/codeAll",
          {
              headers: {
                  "Content-Type": "application/json",
              }
          }
      )
      // 성공 시 추가된 상품 정보를 반환합니다.
      return response.data.data;
  } catch (error) {
      // 실패 시 예외를 throw합니다.
      throw new Error('확인 중 오류가 발생했습니다.');
  }
  };

    //코드 데이터 생성 fetch
    const fetchgenerateCodeData = async () => {
      try {
      const response = await axios.post("/auth/generateCode",
          {
              headers: {
                  "Content-Type": "application/json",
              }
          }
      )
      // 성공 시 추가된 상품 정보를 반환합니다.
      return response.data;
  } catch (error) {
      // 실패 시 예외를 throw합니다.
      throw new Error('확인 중 오류가 발생했습니다.');
  }
  };

  const { data:codes, isError, isLoading } = useQuery({
    queryKey: ['codes'],
    queryFn: fetchgetAllCodeData
})
  const {mutate:codeMutation} = useMutation({mutationFn: fetchgenerateCodeData})

  // [삭제] 발급된 코드 삭제
  const removeCode = (index) => {
    // const updatedCodeList = [...codeListObj];
    // updatedCodeList.splice(index, 1); //splice오랜만이고~
    // setCodeListObj(updatedCodeList); //잘라줬으니 업데이트
  }

  function handleGenerateCode(){
    codeMutation({},{
      onSuccess: (data) => {
        console.log('code generated successfully:', data);
        alert(data.message);
        // 다른 로직 수행 또는 상태 업데이트
        queryClient.invalidateQueries(['codes']);
      },
      onError: (error) => {
        console.error('code generate failed:', error);
        // 에러 처리 또는 메시지 표시
      },
    });
  }

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
      return <div>오류가 발생했습니다.</div>;
  }

  return (
    <div>
      <AdminHeader />
      <div className={styles.body}>
        <AdminMenuData />
        <div className={styles.mainContents}>
          {/* 코드발급 | 최신코드 묶음 */}
          <div className={styles.print_new}>
            {/* 코드 발급 블록 */}
            <div className={styles.printCode_block}>
              <div className={styles.printCode_title}>Click <i class="fa-solid fa-arrow-down"></i></div>
              <div className={styles.printCode_button} onClick={()=>{
                if(codes.length < 10)
                  handleGenerateCode()
                else
                  alert("최대 10개까지만 생성이 가능합니다");
              }}>코드발급</div>
            </div>
            {/* 뭐 넣을지 미정 */}
            <div className={styles.none_block}>
              <div className={styles.none_title}>
                Custom Title
              </div>
              <div className={styles.none_code}>
                Custom Contents
              </div>
            </div>
          </div>
          {/* 발행코드 목록 */}
          <div className={styles.printedCodeList_block}>
            {/* Title */}
            <div className={styles.printedCodeList_title}>발행 코드 LIST</div>
            {/* List */}
              {codes && codes.map((item, index) => (
                <div key={index} className={styles.printedCodeList_list}>
                  {/* No */}
                  <div className={styles.printedCodeList_no}>
                    {index+1}
                  </div>
                  {/* Code */}
                  <div className={styles.printedCodeList_code}>
                    {item.user_code}
                  </div>
                  {/* Del */}
                  <div>
                    <div className={styles.printedCodeList_del}
                      onClick={() => { removeCode(index) }}>
                      삭제
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}