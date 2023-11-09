import { create } from 'zustand'
import { persist } from 'zustand/middleware'
const useDataStore = create((set)=>({
  // data : null,
  // error: null,
  orderData: null,
  categoryData: null,
  userData: null,
  todayTopicData: null,


  actions: {
    // setData : (input) => 
    // set(({
    //   data : input
    // })),

    setOrderData : (input) =>
    set( (prev) => ({
      orderData : input
      })),
    // 카테고리

    setCategoryData : (input) =>
    set( (prev) => ({
      categoryData : input
      })),
    // 고객정보
  
    setUserData : (input) =>
    set( (prev) => ({
      userData : input
      })),
    // 오늘의 주제

    setTodayTopicData : (input) =>
    set( (prev) => ({
      todayTopicData : input
      }))
  }
}));

// 💡 커스텀 훅 사용 -> 
// 선택자 생성, 상태가 변경될 때마다 구성요소가 업데이트 되기 때문에 반복적 렌더링 방지, 
// 실수로 전체 스토어를 렌더링 하는 일 방지.
export const useData = () => useDataStore((state) => state.data);
export const useOrderData = () => useDataStore((state) => state.orderData);
export const useCategoryData = () => useDataStore((state) => state.categoryData);
export const useUserData = () => useDataStore((state) => state.userData);
export const useTopicData = () => useDataStore((state) => state.todayTopicData);

// 🎉  모든 액션 상태를 위한 한개의 선택자 생성 -> 상태가 자주 변경되지 않기 때문에 모든 액션상태를 모음.
export const useDataActions = () => useDataStore((state) => state.actions);



const useListStore = create((set)=>({
  wishList : null,
  orderList : null,
  basketList : null,
  postList : null,


  actions: {
    setWishList : (val) =>
    set( (prev) => ({
      wishList : val
      })),
    // 주문

    setOrderList : (val) =>
      set( (state) => ({
        orderList : val 
      })),
    // 장바구니

    setBasketList : (val) =>
    set( (state) => ({
      basketList : val 
      })),
    // 공지사항

    setPostList : (val) =>
      set( (state) => ({
        postList : val 
      }))
  }
}))

// 💡 커스텀 훅 사용 -> 
// 선택자 생성, 상태가 변경될 때마다 구성요소가 업데이트 되기 때문에 반복적 렌더링 방지, 
// 실수로 전체 스토어를 렌더링 하는 일 방지.
export const useWishList = () => useListStore((state) => state.wishList);
export const useBasketList = () => useListStore((state) => state.basketList);
export const useOrderList = () => useListStore((state) => state.orderList);
export const usePostList = () => useListStore((state) => state.postList);

// 🎉  모든 액션 상태를 위한 한개의 선택자 생성 -> 상태가 자주 변경되지 않기 때문에 모든 액션상태를 모음.
export const useListActions = () => useListStore((state) => state.actions);
