<template>
  <div>
    <Hero />
    <HeroPlaceholder name="UndrawSynchronize">
      <template #title>
        {{ $t("hero.landing.blurb1.title") }}
      </template>
      <template #content>
        {{ $t("hero.landing.blurb1.text") }}
      </template>
    </HeroPlaceholder>
    <HeroPlaceholder name="UndrawDigitalNomad" rtl>
      <template #title>
        {{ $t("hero.landing.blurb2.title") }}
      </template>
      <template #content>
        {{ $t("hero.landing.blurb2.text") }}
      </template>
    </HeroPlaceholder>
  </div>
</template>

<script>
import Hero from "@/components/Hero.vue";
import HeroPlaceholder from "@/components/HeroPlaceholder.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Landing",
  components: { Hero, HeroPlaceholder }
};
</script>
