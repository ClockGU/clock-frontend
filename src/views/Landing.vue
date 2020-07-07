<template>
  <div>
    <Hero />
    <HeroPlaceholder name="UndrawSynchronize">
      <template v-slot:title>Start-and-Go! Einfach arbeiten.</template>
      <template v-slot:content>
        Mit den bequemen Start-and-Go! Buttons kannst du deine aktuelle Schicht
        einfach starten und den Browser schließen. Sobald deine Schicht zu Ende
        ist kannst du auf dem Gerät deiner Wahl wiederkehren und diese beenden.
      </template>
    </HeroPlaceholder>
    <HeroPlaceholder name="UndrawDigitalNomad" rtl>
      <template v-slot:title>Vergessen zu stechen? Kein Problem!</template>
      <template v-slot:content>
        Vergangene Schichten lassen sich ohne Probleme nachtragen. Ebenso kannst
        du schon eingetragene Schichten ändern oder ganz löschen. Du bestimmst,
        welche Zeiten eingetragen sind und welche nicht!
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
