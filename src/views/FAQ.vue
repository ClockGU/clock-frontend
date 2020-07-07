<template>
  <v-container>
    <h1>FAQ</h1>
    <v-expansion-panels accordion>
      <v-expansion-panel v-for="(item, i) in items" :key="i">
        <v-expansion-panel-header>{{ item.title }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          {{ item.text }}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <p class="mt-8">
      Weitere Informationen erhälst du in unserem
      <base-link href="https://clockgu.gitbook.io/clock-benutzerhandbuch"
        >Benutzerhandbuch</base-link
      >.
    </p>
  </v-container>
</template>

<script>
export default {
  name: "FAQ",
  data: () => ({
    items: [
      {
        title: "Was ist Clock?",
        text:
          "Clock ist eine Zeiterfassungs-App für Hilskräfte an der Goethe-Universität Frankfurt."
      },
      {
        title: "Muss ich als HiWi Clock benutzen?",
        text:
          "Nein - Clock ist ein Service, der das Ausfüllen der monatlichen Stundenzettel vereinfachen soll. Du kannst Deine Stundenzettel aber auch wie bisher mit der von PersonalServices angebotenen Excel-Datei führen. Oder von Hand. Ugh."
      },
      {
        title: "Ist Clock kostenlos?",
        text:
          "Ja, Clock ist und bleibt kostenlos nutzbar. Clock ist aber an Deinen HRZ-Account geknüpft und funktioniert nur, so lange dieser gültig ist. Wenn Du z.B. exmatrikuliert wirst, kannst Du auf Clock nicht mehr zugreifen. "
      },
      {
        title: "Wem gehört Clock?",
        text:
          "Clock ist ein Service von HiWis für HiWis. Er wird von der Goethe-Uni unterstützt, aber nicht kontrolliert."
      },
      {
        title: "Wer kann meine Daten sehen?",
        text:
          'Du und die Clock-Admins, die sich aber nicht um Deine Daten, sondern um das System kümmern. "Die Uni" (Institute, Labore, Bibliothek...) kann nicht zugreifen und sieht nur, was Du auf Deinem Stundenzettel stehen hast nachdem Du ihn exportiert und (auf Papier) abgegeben hast.'
      },
      {
        title: "Wie ist das mit dem Datenschutz?",
        text:
          "In der Fußleiste findest du den Link zu unserer Datenschutzerklärung!"
      }
    ]
  })
};
</script>
