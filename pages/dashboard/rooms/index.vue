<script lang="ts" setup>
import RoomManager from '~/components/Room/RoomManager.vue';


definePageMeta({
  layout: 'dashboard-layout',
  title: 'Rooms',
  useLayoutProps: true
});
</script>


<template>
  <RoomManager />
</template>