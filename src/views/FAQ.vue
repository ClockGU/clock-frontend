<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>{{ $t("app.faq") }}</h1>
        <v-expansion-panels v-if="!loading" accordion>
          <v-expansion-panel v-for="(faq, i) in faqs" :key="i">
            <v-expansion-panel-header>
              {{ question(faq) }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              {{ answer(faq) }}
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <p class="mt-8">
          Weitere Informationen findest du in unserem
          <base-link href="https://clockgu.gitbook.io/clock-benutzerhandbuch"
            >Benutzerhandbuch</base-link
          >.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { log } from "@/utils/log";

export default {
  name: "FAQ",
  metaInfo() {
    return {
      title: this.$t("app.faq")
    };
  },
  computed: {
    ...mapGetters({
      loading: "faq/loading",
      faqs: "faq/faqs",
      locale: "locale"
    })
  },
  async created() {
    try {
      await Promise.all([this.$store.dispatch("faq/queryFaq")]);
    } catch (error) {
      log(error);
      this.error = true;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    question(faq) {
      const key = `${this.locale}_question`;
      return key === undefined ? faq.en_question : faq[key];
    },
    answer(faq) {
      const key = `${this.locale}_answer`;
      return key === undefined ? faq.en_answer : faq[key];
    }
  }
};
</script>
