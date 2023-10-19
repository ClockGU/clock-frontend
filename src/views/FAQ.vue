<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>{{ $t("app.faq") }} {{smth}}</h1>
        <br />
        <v-expansion-panels v-if="!loading" variant="accordion">
          <v-expansion-panel v-for="(faq, i) in faqs" :key="i">
            <v-expansion-panel-title
              class="text-body-1"
              :class="getQuestionFontWeight(faq)"
              @click="setSelectedFaq(faq)"
            >
              {{ question(faq) }}
            </v-expansion-panel-title>
            <v-expansion-panel-text class="text-body-1">
              {{ answer(faq) }}
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <p class="mt-8">
          <i18n-t keypath="faq.text" scope="global">
            <template #link>
              <base-link
                class="text-no-wrap"
                :href="$t('faq.url')"
                target="_blank"
              >
                <template #default>{{ $t("faq.linktext") }}</template>
              </base-link>
            </template>
          </i18n-t>
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
  data() {
    return {
      questionFontWeight: "normal",
      selectedFaq: null,
      isExpanded: false
    };
  },
  computed: {
    ...mapGetters({
      loading: "faq/loading",
      faqs: "faq/faqs",
      locale: "locale"
    }),
    smth() {
      return this.$store.getters["faq/status"];
    }
  },
  async created() {
    await this.$store.dispatch("faq/queryFaq");
  },
  methods: {
    question(faq) {
      const key = `${this.locale}_question`;
      return key === undefined ? faq.en_question : faq[key];
    },
    answer(faq) {
      const key = `${this.locale}_answer`;
      return key === undefined ? faq.en_answer : faq[key];
    },
    getQuestionFontWeight(faq) {
      return this.selectedFaq === faq && this.isExpanded
        ? "font-weight-bold"
        : "font-weight-normal";
    },
    setSelectedFaq(faq) {
      if (faq === this.selectedFaq) {
        this.isExpanded = !this.isExpanded;
      } else {
        this.selectedFaq = faq;
        this.isExpanded = true;
      }
    }
  }
};
</script>
