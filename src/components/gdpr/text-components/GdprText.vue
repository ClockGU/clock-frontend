<template>
  <v-alert v-if="$i18n.locale == 'en'" type="info">
    This privacy agreement is only available in German as only the German
    version is legally valid.
  </v-alert>
  <v-container>
    <h1 v-if="!dialog">Datenschutzerklärung</h1>
    <p>
      Diese Datenschutzerklärung dient zur Erfüllung der nach Artikel 13 EU
      DSGVO geforderten Informationspflicht bei Erhebung von Daten zum Zeitpunkt
      der Erhebung bei betroffenen Personen.
    </p>

    <h3>Name und Anschrift des Verantwortlichen</h3>

    <p>
      Johann Wolfgang Goethe-Universität Frankfurt am Main<br />
      Theodor-W.-Adorno-Platz 1<br />
      60323 Frankfurt am Main
    </p>

    <p>Postanschrift:</p>

    <p>
      Goethe-Universität Frankfurt am Main<br />
      60629 Frankfurt<br />
    </p>
    <p>
      Telefon: +49-69-798-0 | Fax: +49-69-798-18383<br />
      Internet:
      <a href="https://www.uni-frankfurt.de/"> https://www.uni-frankfurt.de </a>
    </p>

    <p class="mt-4">
      Bei Anfragen oder Beschwerden zum Datenschutz können Sie sich mit den
      Datenschutz­beauftragten der Goethe-Universität in Verbindung setzen.
    </p>

    <h3>Kontaktdaten der Datenschutzbeauftragten</h3>

    <p>
      Johann Wolfgang Goethe-Universität Frankfurt am Main<br />
      Die behördlichen Datenschutzbeauftragten<br />
      Theodor-W.-Adorno-Platz 1<br />
      60323 Frankfurt am Main<br />

      Internet:
      <a href="https://www.uni-frankfurt.de/datenschutzbeauftragte">
        https://www.uni-frankfurt.de/datenschutzbeauftragte
      </a>
    </p>

    <h3>Rechte und Beschwerdemöglichkeiten</h3>

    <p>
      Sie haben das Recht, sich bei datenschutzrechtlichen Problemen bei der
      zuständigen Fachauf­sichts­behörde zu beschweren.
    </p>

    <p>
      Kontaktadresse der Fachaufsichtsbehörde der Goethe-Universität Frankfurt
      am Main:
    </p>
    <p>
      Hessischer Beauftragter für Datenschutz und Informationsfreiheit<br />
      Postfach 3163<br />
      65021 Wiesbaden<br />
    </p>
    <p>
      E-Mail an den HBDI über das Kontaktformular des Hessischen
      Datenschutzbeauftragten:
      <a href="https://datenschutz.hessen.de/kontakt">
        https://datenschutz.hessen.de/kontakt </a
      >)
    </p>
    <p>Telefon: +49 611 1408 - 0</p>

    <p class="mt-4">
      Sie haben gegenüber der Goethe-Universität folgende Rechte hinsichtlich
      Ihrer gespeicherten personen­bezogenen Daten:
    </p>

    <ul class="my-3">
      <li>Recht auf Auskunft,</li>
      <li>Recht auf Berichtigung oder Löschung,</li>
      <li>Recht auf Einschränkung der Verarbeitung,</li>
      <li>Recht auf Widerruf Ihrer Einwilligung,</li>
      <li>Recht auf Widerspruch gegen die Verarbeitung,</li>
      <li>
        Recht auf Datenübertragbarkeit, in einer gängigen, strukturierten und
        maschinenlesbaren Form (ab dem 25. Mai 2018).
      </li>
    </ul>

    <p>
      Zur Geltungsmachung dieser Rechte in Bezug auf Clock und die umgebenden
      Dienste (ClockSupervisor, ClockWork) wenden Sie sich an
    </p>
    <p>
      Bertram Bühner<br />
      Bereich Human Resources<br />
      Theodor-W.-Adorno-Platz 1<br />
      D-60323 Frankfurt am Main<br />
      clock(at)uni-frankfurt.de<br />
    </p>

    <h2>
      Art der gespeicherten Daten, Zweck und Rechtsgrundlagen, Löschungsfristen
    </h2>

    <h3>Umgang mit personenbezogenen Daten</h3>

    <p>
      Personenbezogene Daten sind Informationen, mit deren Hilfe eine natürliche
      Person bestimmbar ist, also Angaben, durch die Personen identifizierbar
      sind. Dazu gehören insbesondere Namen, E-Mail-Adressen, Matrikelnummern
      oder Telefonnummern. Aber auch Daten über Vorlieben, Hobbies,
      Mitgliedschaften oder auch Informationen über Webseiten, die aufgesucht
      wurden, zählen zu personenbezogenen Daten.
    </p>

    <p>
      Personenbezogene Daten werden von uns nur dann erhoben, genutzt und
      weitergegeben, wenn dies gesetzlich erlaubt ist oder die Nutzer in die
      Datennutzung einwilligt haben.
    </p>

    <p>
      Die Nutzung personenbezogener Daten der Studierenden zum Zweck des
      Studiums basieren weitestgehend auf dem geltenden Hessischen
      Hochschulgesetz in Verbindung mit der geltenden Immatrikulationsverordnung
      des Landes Hessen und beziehen sich somit auf EU DSGVO Artikel 6 Absatz 1
      c).
    </p>

    <p>
      Die Daten der Beschäftigten der Goethe-Universität zum Zweck der
      Personalverwaltung, der Lehr-, Forschungs- und Prüfungstätigkeiten werden
      auf Basis des Hessischen Hochschulgesetzes, der Immatrikulationsverordnung
      des Landes Hessen, TV-GU, beamtenrechtlicher und personalrechtlicher
      Regelungen erhoben und verarbeitet.
    </p>

    <p>
      Bei der Anmeldung über den Zentralen Authentifizierungsdienst (CAS) des
      Hochschulrechenzentrums werden Benutzername, Name und E-Mailadresse
      übermittelt und in Clock gespeichert. Dies sind die einzigen
      personenbezogenen Daten, die automatisiert übermittelt werden. Alle
      weiteren in Clock gespeicherten Daten werden von Ihnen eingegeben.
    </p>

    <p>
      Die Anforderungen von Artikel 17 und Artikel 15, Abs. 3 bzw. Artikel 20 EU
      DSGVO (Recht auf Löschung bzw. Recht auf Auskunft und
      Datenübertragbarkeit) werden durch entsprechende Funktionen gewährleistet.
    </p>

    <h3>Zugriffsdaten/Server-Logdateien</h3>

    <p>
      Wenn Sie unsere Website aufrufen, erheben wir Daten, die für uns technisch
      erforderlich sind, um Ihnen die Website anzuzeigen sowie um den korrekten
      Betrieb der Seite gewährleisten zu können. Dabei erheben wir Daten, die
      Ihr Browser an unseren Server übermittelt (sog. „Server-Logfiles“):
    </p>

    <ul class="my-3">
      <li>Die verwendete IP-Adresse</li>
      <li>Datum und Uhrzeit des Zugriffs</li>
      <li>Typ des Client-Browsers</li>
      <li>Verwendetes Betriebssystem</li>
      <li>Die URL der aufgerufenen Seite</li>
      <li>Die Quelle von welcher aus Sie die Website geöffnet haben</li>
      <li>Menge der gesendeten Daten</li>
      <li>Gegebenenfalls die Fehlermeldung zum aufgetretenen Fehler</li>
      <li>Gegebenenfalls der anfragende Provider</li>
    </ul>

    <p>
      Diese Daten dienen ausschließlich zum Zwecke der Kontrolle der
      Funktionalität, der Sicherheit und Fehlerbehebung. Diese Nutzung basiert
      auf EU DSGVO Artikel 6 Absatz 1 e) bzw. auf §3, sowie §8-11 Hessisches
      Gesetz zum Schutz der elektronischen Verwaltung (HITSiG). Alle Logdateien
      werden automatisiert nach spätestens 7 Tagen gelöscht. Bei
      Sicherheitsvorfällen können die Daten bis zu 90 Tage gespeichert werden
      (§14 HITSiG).
    </p>

    <h3>Kontaktaufnahme</h3>
    <p>
      Zur Kontaktaufnahme mit Mitgliedern der Goethe-Universität (zum Beispiel
      per Kontaktformular oder E-Mail) werden Ihre Angaben zwecks Bearbeitung
      der Anfrage sowie für den Fall, dass Anschluss­fragen entstehen,
      gespeichert. Nach Bearbeitung Ihres Anliegens bzw. nach Erfüllung der
      Rechtspflicht oder des genutzten Dienstes werden die Daten gelöscht, es
      sei denn, die Aufbewahrung der Daten ist zur Umsetzung berechtigter
      Interessen der Goethe Universität oder auf Grund einer gesetzlichen
      Vorschrift (z.B. Gesetz, Rechtsverordnung, Satzung der Goethe Universität
      etc.) erforderlich.
    </p>

    <h2>Cookies</h2>

    <p>
      Cookies sind kleine Dateien, die es ermöglichen, auf Ihrem Zugriffsgerät
      (PC, Smartphone o.ä.) spezifische, auf das Gerät bezogene Informationen zu
      speichern. Sie dienen zum einem der Benutzerfreundlichkeit von Webseiten
      (z.B. Speicherung von Logindaten). Sie können auf den Einsatz der Cookies
      Einfluss nehmen. Die meisten Browser verfügen über eine Option mit der das
      Speichern von Cookies eingeschränkt oder komplett verhindert werden kann.
      Allerdings wird darauf hingewiesen, dass die Nutzung und insbesondere der
      Nutzungskomfort ohne Cookies eingeschränkt sein kann.
    </p>

    <p>
      Die Anmeldung bei Clock erfolgt über den Zentralen
      Authentifizierungsdienst (CAS) des Hochschulrechenzentrums. Von diesem
      wird in Ihrem Browser ein Cookie gesetzt, das für die Anmeldung bei Clock
      notwendig ist. Ihr Passwort selbst wird nicht in Clock gespeichert.
    </p>

    <p>
      Clock selbst setzt keine Cookies auf Ihrem Gerät. Clock nutzt jedoch die
      <i>Local Storage</i>-Technik (auch „Lokale Daten“ und „Lokaler Speicher“
      genannt). Dabei werden Daten lokal im Cache Ihres Browsers gespeichert,
      die auch nach dem Schließen des Browser-Fensters oder dem Beenden des
      Programms bestehen und ausgelesen werden können sofern Sie den Cache nicht
      aktiv löschen. Im <i>Local Storage</i> speichert Clock so genannte
      <i>Token</i>, die Sie gegenüber dem CAS als berechtigte*n Nutzer*in
      ausweisen. Diese Token enthalten keine personenbezogenen Daten und sind
      nur für den Anmeldevorgang und die Prüfung beim CAS relevant.
    </p>

    <p>
      Ein Authentifizierungs-Token verfällt nach 30 Tagen, wenn Sie Clock nicht
      nutzen.
    </p>

    <p>
      Weitere Informationen zur Verarbeitung der eingegebenen Daten sind im
      Kapitel "Datenschutz" im
      <a
        href="https://clockgu.gitbook.io/clock-benutzerhandbuch/de/privacy"
        target="_blank"
        >Clock Handbuch</a
      >
      aufgeführt.
    </p>

    <h3>Analysedienste (Matomo)</h3>

    <p>
      Unsere Website verwendet
      <a href="http://matomo.org" target="_blank">Piwik/Matomo</a>. Dabei
      handelt es sich um einen sogenannten Webanalysedienst. Matomo verwendet
      Cookies, die unsererseits eine Analyse der Benutzung der Webseite
      ermöglichen. Zu diesem Zweck werden die durch den Cookie erzeugten
      Nutzungsinformationen (einschließlich Ihrer gekürzten IP-Adresse) an
      unseren Server übertragen und zu Nutzungsanalysezwecken gespeichert, was
      der Webseitenoptimierung dient. Ihre IP-Adresse wird bei diesem Vorgang
      umge­hend anony­mi­siert, so dass Ihre Nutzung weiterhin anonym erfolgt.
      Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieser
      Webseite werden nicht an Dritte weitergegeben. Sie können die Verwendung
      der Cookies durch eine entsprechende Einstellung Ihrer Browser Software
      verhindern, es kann jedoch sein, dass Sie in diesem Fall gegebenenfalls
      nicht sämtliche Funktionen dieser Website voll umfänglich nutzen können.
    </p>

    <p>
      Wenn Sie mit der Spei­che­rung und Aus­wer­tung die­ser Daten nicht
      ein­ver­stan­den sind, dann kön­nen Sie der Spei­che­rung und Nut­zung
      nachfolgend per Maus­klick jederzeit wider­spre­chen. In diesem Fall wird
      in Ihrem Browser ein sog. Opt-Out-Cookie abgelegt, was zur Folge hat, dass
      durch Matomo kei­ne Da­ten mehr erhoben werden.
    </p>

    <iframe :src="iframeURL"></iframe>
  </v-container>
</template>

<script>
export default {
  name: "GdprText",
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  metaInfo() {
    return {
      title: this.$t("app.privacy")
    };
  },
  computed: {
    iframeURL() {
      try {
        const matomoUrl = import.meta.env.VITE_MATOMO_URL;
        const locale =
          this.$i18n && this.$i18n.locale
            ? encodeURIComponent(this.$i18n.locale)
            : "en";

        if (!matomoUrl) {
          //console.error("Matomo URL is not defined");
          return "";
        }

        return `${matomoUrl}/index.php?module=CoreAdminHome&action=optOut&language=${locale}`;
      } catch (error) {
        //console.error("Error generating iframe URL:", error);
        return "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
iframe {
  border: 0;
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

@media (max-width: 600px) {
  iframe {
    height: 260px;
  }
}
h1,
h2,
h3 {
  margin-bottom: 0.5em;
  margin-top: 1em;
}
li {
  margin-left: 1.5em;
}
p {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>
