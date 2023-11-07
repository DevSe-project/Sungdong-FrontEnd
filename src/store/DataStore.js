import { create } from 'zustand'
import { persist } from 'zustand/middleware'
export const useDataStore = create((set)=>({
  data : null,
  error: null,
  setData : async(input) => {
    try {
      set({
        data : input
        });
    } catch (error) {
      set({ data: null, error: error.message });
    }
  },
  orderData: [],
  setOrderData : (input) =>
  set( (prev) => ({
    orderData : input
    })),
  // 카테고리
  categoryData: [],
  setCategoryData : (input) =>
  set( (prev) => ({
    categoryData : input
    })),
  // 고객정보
  userData: [],
  setUserData : (input) =>
  set( (prev) => ({
    userData : input
    })),
  // 오늘의 주제
  todayTopicData: [],
  setTodayTopicData : (input) =>
  set( (prev) => ({
    todayTopicData : input
    }))
}))

export const useListStore = create((set)=>({
  // 찜
  wishList : [],
  setWishList : (val) =>
   set( (prev) => ({
     wishList : val
    })),
  // 주문
  orderList : [],
  setOrderList : (val) =>
    set( (state) => ({
      orderList : val 
    })),
  // 장바구니
  basketList : [],
  setBasketList : (val) =>
   set( (state) => ({
     basketList : val 
    })),
  // 공지사항
  postList : [],
  setPostList : (val) =>
    set( (state) => ({
      postList : val 
    }))
}))


export const useNoticeStroe = create((set) => ({

}))