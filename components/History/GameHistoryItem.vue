<script setup lang="ts">
import { computed } from 'vue';
import BaseCard from '../Base/BaseCard.vue';

type GameSession = {
  id: string;
  quizTitle: string;
  createdAt: string;
};

const props = defineProps<{ session: GameSession }>();

const formattedDate = computed(() => {
  return new Date(props.session.createdAt).toLocaleDateString();
});
</script>

<template>
    <BaseCard>
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-lg font-semibold">{{ session.quizTitle }}</h3>
          <p class="text-sm text-gray-500">Played on: {{ formattedDate }}</p>
        </div>
        <NuxtLink :to="`/games/${session.id}`" class="text-blue-500 hover:underline">
          View Details
        </NuxtLink>
      </div>
    </BaseCard>
</template>