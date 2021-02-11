<template>
  <v-container>
    <h1>Impressum</h1>
    <p>Angaben gemäß § 5 TMG</p>
    <p>
      Johann Wolfgang Goethe-Universität Frankfurt am Main<br />
      Theodor-W.-Adorno-Platz 1<br />
      60323 Frankfurt am Main<br />
      E-Mail: GeoMat Team<br />
    </p>

    <h2>Ansprechpartner</h2>

    <p>
      Bertram Bühner, Zentrum Naturwissenschaften<br />
      E-Mail:
      <a href="mailto:clock-kontakt@dlist.server.uni-frankfurt.de">
        clock-kontakt@dlist.server.uni-frankfurt.de
      </a>
    </p>

    <h2>Haftungsausschluss</h2>

    <h3>Haftung für Links</h3>

    <p>
      Diese Web-App enthält Links zu externen Webseiten Dritter, auf deren
      Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden
      Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
      Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
      verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung
      auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum
      Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche
      Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte
      einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
      Rechtsverletzungen werden wir derartige Links umgehend entfernen.
    </p>

    <h3>Urheberrecht</h3>

    <p>
      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
      Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
      Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen
      des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen
      Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den
      privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf
      dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte
      Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
      gekennzeichnet.
    </p>
  </v-container>
</template>

<script>
export default {
  name: "Imprint",
  metaInfo() {
    return {
      title: this.$t("app.imprint")
    };
  }
};
</script>
