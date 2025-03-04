import { defineStore } from 'pinia';

export const usePaginationStore = defineStore('pagination', {
  state: () => ({
    currentPage: 1, // หน้าปัจจุบัน
    itemsPerPage: 10, // จำนวนรายการต่อหน้า
    totalItems: 0, // จำนวนรายการทั้งหมด
  }),
  actions: {
    setCurrentPage(page: number) {
      this.currentPage = page;
    },
    setTotalItems(total: number) {
      this.totalItems = total;
    },
  },
  getters: {
    totalPages: (state) => Math.ceil(state.totalItems / state.itemsPerPage),
  },
});