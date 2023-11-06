import { create } from 'zustand'

export const useDataStore = create((set)=>({
  data : [],
  setData : (input) =>
   set( (prev) => ({
     data : input
     })),
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
}))

export const useListStore = create((set)=>({
  wishList : [],
  setWishList : (val) =>
   set( (state) => ({
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
    }))
}))
