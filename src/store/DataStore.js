import { create } from 'zustand'

// ------------------------------데이터 STORE----------------------------//

const useDataStore = create((set) => ({
  orderData: null,
  categoryData: [],
  userData: [],
  todayTopicData: null,
  detailData: {
    productId: '',
    title: '',
    content: '',
    price: '',
    supply: 1,
    discount: 0,
    image: {
      original: "",
      mini: "",
    },
    option: {
      option0: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      option5: '',
      option6: '',
      option7: '',
      option8: '',
      option9: '',
    },
    category: {
      id: '',
      highId: '',
      lowId: '',
    },
    brand: '',
    madeIn: '',
    state: '',
  },

  actions: {
    setDetailData: (input) =>
      set((prev) => ({
        detailData: input
      })),
    setOrderData: (input) =>
      set((prev) => ({
        orderData: input
      })),
    // 카테고리

    setCategoryData: (input) =>
      set((prev) => ({
        categoryData: input
      })),
    // 고객정보

    setUserData: (input) =>
      set((prev) => ({
        userData: input
      })),
    // 오늘의 주제

    setTodayTopicData: (input) =>
      set((prev) => ({
        todayTopicData: input
      }))
  }
}));

// 💡 커스텀 훅 사용 -> 
// 선택자 생성, 상태가 변경될 때마다 구성요소가 업데이트 되기 때문에 반복적 렌더링 방지, 
// 실수로 전체 스토어를 렌더링 하는 일 방지.
// export const useData = () => useDataStore((state) => state.data);
export const useDetailData = () => useDataStore((state) => state.detailData);
export const useOrderData = () => useDataStore((state) => state.orderData);
export const useCategoryData = () => useDataStore((state) => state.categoryData);
export const useUserData = () => useDataStore((state) => state.userData);
export const useTopicData = () => useDataStore((state) => state.todayTopicData);

// 🎉  모든 액션 상태를 위한 한개의 선택자 생성 -> 상태가 자주 변경되지 않기 때문에 모든 액션상태를 모음.
export const useDataActions = () => useDataStore((state) => state.actions);



// ------------------------------리스트 STORE----------------------------//

const useListStore = create((set) => ({
  wishList: [],
  orderList: [],
  basketList: [],
  noticePostList: [],


  actions: {
    setWishList: (val) =>
      set((prev) => ({
        wishList: val
      })),
    // 주문

    setOrderList: (val) =>
      set((state) => ({
        orderList: val
      })),
    // 장바구니

    setBasketList: (val) =>
      set((state) => ({
        basketList: val
      })),
    // 공지사항
    setNoticePostList: (val) => {
      set((state) => ({
        noticePostList: val,
      }))
    },
  }
}))



// 💡 커스텀 훅 사용 -> 
// 선택자 생성, 상태가 변경될 때마다 구성요소가 업데이트 되기 때문에 반복적 렌더링 방지, 
// 실수로 전체 스토어를 렌더링 하는 일 방지.
export const useWishList = () => useListStore((state) => state.wishList);
export const useBasketList = () => useListStore((state) => state.basketList);
export const useOrderList = () => useListStore((state) => state.orderList);
export const useNoticePostList = () => useListStore((state) => state.noticePostList);

// 🎉  모든 액션 상태를 위한 한개의 선택자 생성 -> 상태가 자주 변경되지 않기 때문에 모든 액션상태를 모음.
export const useListActions = () => useListStore((state) => state.actions);



// --------------------------------MODAL STORE--------------------------------//



// Modal State (사용법 주석 추가 예정)
const useModalStore = create((set) => ({
  isModal: false,
  modalName: '',
  selectedIndex: null,

  actions: {
    setIsModal: (bool) => set({ isModal: bool }),
    setModalName: (name) => set({ modalName: name }),
    openModal: () => set({ isModal: true }),
    closeModal: () => set({ isModal: false }),
    setSelectedIndex: (index) => set({ selectedIndex: index }),
    selectedModalOpen: (name) => set({ isModal: true, modalName: name }),
    selectedModalClose: () => set({ isModal: false, modalName: '' }),
  },
}));

// useModalState 커스텀 훅
export const useModalState = () => {
  const { isModal, modalName, selectedIndex } = useModalStore();
  return { isModal, modalName, selectedIndex };
};

// useModalActions 커스텀 훅
export const useModalActions = () => {
  const { setIsModal, setModalName, setSelectedIndex, openModal, closeModal, selectedModalOpen, selectedModalClose } = useModalStore.getState().actions;
  return { setIsModal, setModalName, setSelectedIndex, openModal, closeModal, selectedModalOpen, selectedModalClose };
};

/* ---------------SELECT SOTRE----------------- */
const selectStore = create((set) => ({
  select: false,
  value: '',

  actions: {
    isSelect: () => set((state) => ({ select: !state.select })),
    setValue: (val) => set((state) => ({
      value: val
    }))
  }
}));
// Custum zustand
export const useSelect = () => selectStore((state) => ({ select: state.select, value: state.value }));
export const useSelectActions = () => selectStore((state) => ({ actions: state.actions }));


/* ---------------ORDER STOREs----------------- */

const useOrderStore = create((set) => ({
  orderInformation: {
    name: '',
    tel: '',
    email: '',
    smtMessage: '',
    payRoute: '',
    moneyReceipt: '',
    transAction: '',
    fax: '',
    checked: false,
  },
  deliveryInformation: {
    name: '',
    tel: '',
    address: {
      address: [],
      addressDetail: '',
    },
    deliveryType: '',
    deliverySelect: '',
    deliveryMessage: '',
    deliveryDate: '',
  },
  actions: {
    setOrderInformation: (fieldName, value) =>
      set((state) => ({ orderInformation: { ...state.orderInformation, [fieldName]: value } })),

    setDeliveryInformation: (fieldName, value) =>
      set((state) => ({ deliveryInformation: { ...state.deliveryInformation, [fieldName]: value } })),

    setDetailInformation: (first, fieldName, value) =>
      set((state) => ({ deliveryInformation: { ...state.deliveryInformation, [first]: { ...state.deliveryInformation[first], [fieldName]: value } } })),
  }
}));
export const useOrderInfo = () => useOrderStore((state) => state.orderInformation);
export const useDeliveryInfo = () => useOrderStore((state) => state.deliveryInformation);

// 🎉  모든 액션 상태를 위한 한개의 선택자 생성 -> 상태가 자주 변경되지 않기 때문에 모든 액션상태를 모음.
export const useOrderActions = () => useOrderStore((state) => state.actions);

/* ----------------LOGIN STORE---------------- */

export const useLoginStore = create((set) => ({
  isLogin: false,

  actions: {
    setLogin: (val) => set((state) => ({ isLogin: val }))
  }
}));
export const useIsLogin = () => useLoginStore((state) => state.isLogin);
export const useSetLogin = () => useLoginStore((state) => state.actions);


/* ----------------SEARCH STORE---------------- */

export const useSearchStore = create((set) => ({
  seperateSearchTerm: {
    productName: "",
    productCode: "",
    productBrand: "",
    productOption: ""
  },
  actions: {
    setSeperateSearchTerm: (fieldName, value) =>
      set((state) => ({ seperateSearchTerm: { ...state.seperateSearchTerm, [fieldName]: value } })),
    resetSeperateSearchTerm: () =>
      set({ seperateSearchTerm: { productName: "", productCode: "", productBrand: "", productOption: "" } }),
  }
}));
export const useSeperateSearchTerm = () => useSearchStore((state) => state.seperateSearchTerm);
export const useSearchActions = () => useSearchStore((state) => state.actions);

/* ----------------TAKEBACK STORE---------------- */
export const useTakeBackStore = create((set) => ({
  takeBackOption: {
    returnStatus: "",
    barcodeStatus: "",
    wrapStatus: "",
    productStatus: "",
    name: "",
    reason: "",
  },
  actions: {
    setTakeBackOption: (fieldName, value) =>
      set((state) => ({ takeBackOption: { ...state.takeBackOption, [fieldName]: value } })),
    resetTakeBackOption: () =>
      set({ takeBackOption: { returnStatus: "", barcodeStatus: "", wrapStatus: "", productStatus: "" } }),
  }
}));
export const useTakeBack = () => useTakeBackStore((state) => state.takeBackOption);
export const useTakeBackActions = () => useTakeBackStore((state) => state.actions);

/* ----------------ERRORTRADE STORE---------------- */
export const useErrTradeStore = create((set) => ({
  errTradeOption: {
    returnStatus: "",
    barcodeStatus: "",
    wrapStatus: "",
    productStatus: "",
    name: "",
    reason: "",
  },
  actions: {
    setErrTradeOption: (fieldName, value) =>
      set((state) => ({ errTradeOption: { ...state.errTradeOption, [fieldName]: value } })),
    resetErrTradeOption: () =>
      set({ errTradeOption: { returnStatus: "", barcodeStatus: "", wrapStatus: "", productStatus: "" } }),
  }
}));
export const useErrTrade = () => useErrTradeStore((state) => state.errTradeOption);
export const useErrTradeActions = () => useErrTradeStore((state) => state.actions);


/* ----------------=========== ADMIN ==========---------------- */


/* ----------------Product STORE---------------- */
export const useProductStore = create((set) => ({
  product: {
    productId: '',
    title: '',
    content: '',
    price: '',
    supply: 1,
    discount: 0,
    image_original: '',
    image_mini: '',
    option: {
      option0: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      option5: '',
      option6: '',
      option7: '',
      option8: '',
      option9: '',
    },
    category: {
      highId: '',
      middleId: '',
      lowId: '',
    },
    brand: '',
    madeIn: '',
    state: '',
  },
  actions: {
    setProduct: (fieldName, value) =>
      set((state) => ({ product: { ...state.product, [fieldName]: value } })),
    editProduct: (data) =>
      set((state) => ({ product: data })),
    resetProduct: () =>
      set({
        product: {
          productId: '',
          title: '',
          content: '',
          price: '',
          supply: 1,
          discount: 0,
          image_original: '',
          image_mini: '',
          option: {
            option0: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            option5: '',
            option6: '',
            option7: '',
            option8: '',
            option9: '',
          },
          category: {
            highId: '',
            middleId: '',
            lowId: '',
          },
          brand: '',
          madeIn: '',
          state: '',
        }
      }),
    setProductOption: (fieldName, value) =>
      set((state) => ({
        product: {
          ...state.product,
          option: {
            ...state.product.option,
            [fieldName]: value,
          },
        },
      })),
    setProductCategory: (fieldName, value) =>
      set((state) => ({
        product: {
          ...state.product,
          category: {
            ...state.product.category,
            [fieldName]: value,
          },
        },
      })),
  }
}));
export const useProduct = () => useProductStore((state) => state.product);
export const useProductActions = () => useProductStore((state) => state.actions);

/* ----------------ProductFilter STORE---------------- */
export const useProductFilterStore = create((set) => ({
  productFilter: {
    title: '',
    brand: '',
    productId: '',
    state: {
      전체: false,
      판매대기: false,
      판매중: false,
      판매중단: false,
      판매종료: false
    },
    category: {
      highId: '',
      middleId: '',
      lowId: ''
    },
    dateType: '',
    date: {
      start: '',
      end: ''
    },
    supply: '',
    option: '',
  },
  actions: {
    setProductFilter: (fieldName, value) =>
      set((state) => ({ productFilter: { ...state.productFilter, [fieldName]: value } })),
    resetProductFilter: () =>
      set({
        productFilter: {
          title: '',
          brand: '',
          productId: '',
          state: {
            전체: false,
            판매대기: false,
            판매중: false,
            판매중단: false,
            판매종료: false
          },
          category: {
            highId: '',
            middleId: '',
            lowId: ''
          },
          dateType: '',
          date: {
            start: '',
            end: ''
          },
          supply: '',
          option: '',
        }
      }),
    setProductCategory: (fieldName, value) =>
      set((state) => ({
        productFilter: {
          ...state.productFilter,
          category: {
            ...state.productFilter.category,
            [fieldName]: value,
          },
        },
      })),
    setProductDate: (fieldName, value) =>
      set((state) => ({
        productFilter: {
          ...state.productFilter,
          date: {
            ...state.productFilter.date,
            [fieldName]: value,
          },
        },
      })),
    setCheckboxState: (fieldName) =>
      set((state) => ({
        productFilter: {
          ...state.productFilter,
          state: {
            ...state.productFilter.state,
            [fieldName]: !state[fieldName],
          },
        },
      })),
    setAllCheckboxState: () =>
      set((state) => {
        const allChecked = Object.values(state.productFilter.state).every((value) => value);
        const updatedState = {};

        Object.keys(state.productFilter.state).forEach((key) => {
          updatedState[key] = !allChecked;
        });

        return {
          ...state,
          productFilter: {
            ...state.productFilter,
            state: updatedState,
          },
        };
      }),
  }
}));
export const useProductFilter = () => useProductFilterStore((state) => state.productFilter);
export const useProductFilterActions = () => useProductFilterStore((state) => state.actions);

/* ----------------OrderFilter STORE---------------- */
export const useOrderFilterStore = create((set) => ({
  orderFilter: {
    orderState: '',
    dateType: '',
    date: {
      start: '',
      end: ''
    },
    deliveryType: '',
    deliveryNum: '',
    detailFilter: {
      userId: '',
      orderId: '',
      productId: '',
      deliveryNum: '',
      companyName: '',
      name: '',
      tel: '',
    }
  },
  actions: {
    setOrderFilter: (fieldName, value) =>
      set((state) => ({ orderFilter: { ...state.orderFilter, [fieldName]: value } })),
    resetOrderFilter: () =>
      set({
        orderFilter: {
          orderState: '',
          dateType: '',
          date: {
            start: '',
            end: ''
          },
          deliveryType: '',
          detailFilter: {
            userId: '',
            orderId: '',
            productId: '',
            deliveryNum: '',
            companyName: '',
            name: '',
            tel: '',
          }
        }
      }),
    setOrderDetailFilter: (fieldName, value) =>
      set((state) => ({
        orderFilter: {
          ...state.orderFilter,
          detailFilter: {
            ...state.orderFilter.detailFilter,
            [fieldName]: value,
          },
        },
      })),
    setOrderFilterDate: (fieldName, value) =>
      set((state) => ({
        orderFilter: {
          ...state.orderFilter,
          date: {
            ...state.orderFilter.date,
            [fieldName]: value,
          },
        },
      })),
  }
}));
export const useOrderFilter = () => useOrderFilterStore((state) => state.orderFilter);
export const useOrderFilterActions = () => useOrderFilterStore((state) => state.actions);

/* ----------------OrderList STORE---------------- */
export const useOrderListStore = create((set) => ({
  selectList: [],
  actions: {
    toggleSelectList: (valueID, value) =>
      set((state) => ({
        selectList: state.selectList.some(item => item.orderId === valueID)
          ? state.selectList.filter(item => item.orderId !== valueID)
          : [...state.selectList, { orderId: valueID, value: value }],
      })),
    toggleAllSelect: (selectAll, value) =>
      set((state) => ({
        selectList: selectAll
          ? value.map((item) => ({
            orderId: item.orderId,
            value: item,
          }))
          : [], // 모두 선택 해제 시 빈 배열로 설정
      })),
    setSelectListValue: (item, fieldkey, value) =>
      set((state) => ({
        selectList: state.selectList.map((list) => {
          if (list.orderId === item.orderId) {
            return {
              ...list,
              value: {
                ...list.value,
                [fieldkey]: value,
              },
            };
          }
          return list;
        }),
      })),
    setAllSelectListValue: (fieldkey, value) =>
      set((state) => ({
        selectList: state.selectList.map((list) => {
          return {
            ...list,
            value: {
              ...list.value,
              [fieldkey]: value,
            },
          };
        })
      })),
    resetDeliveryNum: () =>
      set((state) => ({
        selectList: state.selectList.map((list) => ({
          ...list,
          deliveryNum: '',
        })),
      })),
    resetSelectList: () =>
      set({
        selectList: []
      })
  }
}));
export const useOrderSelectList = () => useOrderListStore((state) => state.selectList);
export const useOrderSelectListActions = () => useOrderListStore((state) => state.actions);

/* ----------------RefundFilter STORE---------------- */
export const useRefundFilterStore = create((set) => ({
  raeFilter: {
    raeState: '',
    date: {
      start: '',
      end: ''
    },
    raeDateType: '',
    detailFilter: {
      userId: '',
      orderId: '',
      productId: '',
      deliveryNum: '',
      companyName: '',
      name: '',
      tel: '',
    }
  },
  actions: {
    setRaeFilter: (fieldName, value) =>
      set((state) => ({ raeFilter: { ...state.raeFilter, [fieldName]: value } })),
    resetRaeFilter: () =>
      set({
        raeFilter: {
          raeState: '',
          date: {
            start: '',
            end: ''
          },
          raeDateType: '',
          detailFilter: {
            userId: '',
            orderId: '',
            productId: '',
            deliveryNum: '',
            companyName: '',
            name: '',
            tel: '',
          }
        }
      }),
    setRaeDetailFilter: (fieldName, value) =>
      set((state) => ({
        raeFilter: {
          ...state.raeFilter,
          detailFilter: {
            ...state.raeFilter.detailFilter,
            [fieldName]: value,
          },
        },
      })),
    setRaeFilterDate: (fieldName, value) =>
      set((state) => ({
        raeFilter: {
          ...state.raeFilter,
          date: {
            ...state.raeFilter.date,
            [fieldName]: value,
          },
        },
      })),
  }
}));
export const useRaeFilter = () => useRefundFilterStore((state) => state.raeFilter);
export const useRaeFilterActions = () => useRefundFilterStore((state) => state.actions);

/* ----------------Notice STORE---------------- */
export const useNoticeStore = create((set) => ({
  notice: {
    title: '',
    contents: '',
    date: '',
    files: null,
    writer: ''
  },
  actions: {
    addNoticeData: (value) =>
      set((state) => ({ notice: { ...value } })),
    setNoticeData: (fieldName, value) =>
      set((state) => ({ notice: { ...state.notice, [fieldName]: value } })),
    resetNoticeData: () =>
      set({
        notice: {
          title: '',
          contents: '',
          date: '',
          files: null,
          writer: ''
        },
      }),
  }
}));
export const useNotice = () => useNoticeStore((state) => state.notice);
export const useNoticeActions = () => useNoticeStore((state) => state.actions);


// ------------Delivery Filter------------
export const useDeliveryFilter = create((set) => ({
  deliveryFilter: {
    checkedState: {
      '전체': false,
      '배송 준비': false,
      '배송 중': false,
      '배송 완료': false,
      '배송 지연': false
    },
    date: {
      start: '',
      end: ''
    },
    dateButton: {
      '오늘': false,
      '1 주일': false,
      '1 개월': false,
      '3 개월': false,
      '6 개월': false,
    }
  },

  actions: {
    resetDeliveryFilter: () => set({
      checkedState: {
        '전체': false,
        '배송 준비': false,
        '배송 중': false,
        '배송 완료': false,
        '배송 지연': false,
        'all': false, // 'all' 속성 추가
      },
      date: {
        start: '',
        end: ''
      },
      dateButton: {
        '오늘': false,
        '1 주일': false,
        '1 개월': false,
        '3 개월': false,
        '6 개월': false,
      }
    }),

    updateCheckedState: (fieldName) => set((state) => ({
      deliveryFilter: {
        ...state.deliveryFilter,
        checkedState: {
          ...state.deliveryFilter.checkedState,
          [fieldName]: !state.deliveryFilter.checkedState[fieldName],
        }
      }
    })),
  }
}))


// 커스텀 : state
export const useDeliveryFilterState = () => useDeliveryFilter((state) => state.deliveryFilter);
export const useDeliveryFilterActions = () => useDeliveryFilter((state) => state.actions);

// --------------------------