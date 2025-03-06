<script lang="ts" setup>
const props = defineProps({
  color: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-1 me-2 text-sm font-medium rounded-sm"
    :class="[
      `text-${props.color}-800 bg-${props.color}-100 dark:bg-${props.color}-900 dark:text-${props.color}-300`,
    ]"
  >
    {{ props.name }}
    <button
      type="button"
      class="inline-flex items-center p-1 ms-2 text-sm bg-transparent rounded-xs hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-gray-300"
      :class="[
        `text-${props.color}-400 hover:bg-${props.color}-200 hover:text-${props.color}-900 dark:hover:bg-${props.color}-800 dark:hover:text-${props.color}-300`,
      ]"
      aria-label="Remove"
    >
      <svg
        class="w-2 h-2"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 14"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
      <span class="sr-only">Remove badge</span>
    </button>
  </span>
</template>