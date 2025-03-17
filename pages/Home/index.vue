<script setup lang="ts">
  definePageMeta({
    'layout': 'home-layout',
  })
  import { useRouter } from 'vue-router';
  import HomeSection from '~/components/Home/HomeSection.vue';
  import StatSection from '~/components/Home/StatSection.vue';
  import FeatureSection from '~/components/Home/FeatureSection.vue';
  import CateSection from '~/components/Home/CateSection.vue';
  import FeatureQuiz from '~/components/Home/FeatureQuiz.vue';
  import CTASection from '~/components/Home/CTASection.vue';
  
  const router = useRouter();
  
  // Event handlers
  const handlePlayNow = () => {
    router.push('/play/join');
  };
  
  const handleHowToPlay = () => {
    router.push('/how-to-play');
  };
  
  const handleCategorySelected = (category:any) => {
    router.push({
      path: '/play',
      query: { category: category.name }
    });
  };
  
  const handlePlayQuiz = (quiz:any) => {
    router.push(`/play/${quiz.id || 1}`);
  };
  
  const handleSignup = () => {
    router.push('/signup');
  };
  
  const handleDemo = () => {
    router.push('/demo');
  };
</script>

<template>
      <HomeSection @play-now="handlePlayNow" @how-to-play="handleHowToPlay" />
      <StatSection />
      <FeatureSection />
      <CateSection @category-selected="handleCategorySelected" />
      <FeatureQuiz @play-quiz="handlePlayQuiz" />
      <CTASection @signup="handleSignup" @demo="handleDemo" />
</template>
  
