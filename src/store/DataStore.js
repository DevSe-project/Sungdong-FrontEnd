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
  categoryData: [],
  setCategoryData : (input) =>
  set( (prev) => ({
    categoryData : input
    })),
  userData: [],
  setUserData : (input) =>
  set( (prev) => ({
    userData : input
    })),
  todayTopicData: [],
  setTodayTopicData : (input) =>
  set( (prev) => ({
    todayTopicData : input
    })),
}))

export const useListStore = create((set)=>({
  wishList : [],
  setWishList : (val) =>
   set( (prev) => ({
     wishList : val
    })),
  orderList : [],
  setOrderList : (val) =>
    set( (state) => ({
      orderList : val 
    })),
  basketList : [],
  setBasketList : (val) =>
   set( (state) => ({
     basketList : val 
    })),
  postList : [],
  setPostList : (val) =>
    set( (state) => ({
      postList : val 
    }))
}))
