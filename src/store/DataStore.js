import { create } from 'zustand'

export const useDataStore = create((set)=>({
  data : [],
  setData : (input) =>
   set( (prev) => ({
     data : input
     }))
}))

