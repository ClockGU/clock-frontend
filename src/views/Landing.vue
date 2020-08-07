<template>
  <div>
    <Hero />
    <HeroPlaceholder name="UndrawSynchronize">
      <template v-slot:title>
        {{ $t("hero.landing.blurb1.title") }}
      </template>
      <template v-slot:content>
        {{ $t("hero.landing.blurb1.text") }}
      </template>
    </HeroPlaceholder>
    <HeroPlaceholder name="UndrawDigitalNomad" rtl>
      <template v-slot:title>
        {{ $t("hero.landing.blurb2.title") }}
      </template>
      <template v-slot:content>
        {{ $t("hero.landing.blurb2.text") }}
      </template>
    </HeroPlaceholder>
  </div>
</template>

<script>
import Hero from "@/components/Hero";
import HeroPlaceholder from "@/components/HeroPlaceholder";

export default {
  name: "Landing",
  components: { Hero, HeroPlaceholder }
};
</script>
