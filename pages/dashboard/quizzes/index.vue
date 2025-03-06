<script lang="ts" setup>
import SearchBar from '~/components/Quiz/SearchBar.vue';

const handleSearch = (search: string) => {
    
};
</script>

<template>
    <SearchBar @search="handleSearch" />
</template>