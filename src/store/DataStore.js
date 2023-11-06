import { create } from 'zustand'

export const useDataStore = create((set)=>({
  data : [],
  setData : (input) =>
   set({
     data : input
     }),
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
