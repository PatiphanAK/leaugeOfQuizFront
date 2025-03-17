<script lang="ts" setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});


const emit = defineEmits(['previous', 'next']);


const handlePrevious = () => {
  if (props.currentPage > 1) {
    emit('previous');
  }
};

const handleNext = () => {
  if (props.currentPage < props.totalPages) {
    emit('next');
  }
};
</script>

<template>
  <div class="flex items-center">
    <!-- Previous Button -->
    <button
      @click="handlePrevious"
      :disabled="currentPage === 1"
      class="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Previous"
    >
      Previous
    </button>
    
    <!-- Current Page Indicator -->
    <div class="mx-4 text-sm font-medium text-gray-700 dark:text-gray-300">
      Page {{ currentPage }} of {{ totalPages }}
    </div>
    
    <!-- Next Button -->
    <button
      @click="handleNext"
      :disabled="currentPage === totalPages"
      class="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Next"
    >
      Next
    </button>
  </div>
</template>