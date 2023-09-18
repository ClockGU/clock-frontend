<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="mb-6">{{ $t("app.faq") }}</h1>
        <v-row v-if="!loading" accordion>
          <v-row v-for="(faq_group, i) in faqs_object" :key="i" class="mt-4">
            <h2 v-if="faq_group[0].faq_heading" class="mt-4 pl-6 mb-2">
              {{ heading(faq_group[0].faq_heading) }}
            </h2>
            <v-expansion-panels variant="Popout">
              <v-expansion-panel v-for="(faq, i) in faq_group" :key="i">
                <v-expansion-panel-header
                  class="text-body-1"
                  :class="getQuestionFontWeight(faq)"
                  @click="setSelectedFaq(faq)"
                >
                  {{ question(faq) }}
                </v-expansion-panel-header>
                <v-expansion-panel-content class="text-body-1">
                  {{ answer(faq) }}
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
        </v-row>
        <p class="mt-10">
          <br />
          <i18n path="faq.text">
            <template #link>
              <base-link
                class="text-no-wrap"
                :href="$t('faq.url')"
                target="_blank"
              >
                <template #default>{{ $t("faq.linktext") }}</template>
              </base-link>
            </template>
          </i18n>
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
      faqs_object: "faq/faqs",
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
    heading(faq_group_zero) {
      const key = `${this.locale}_heading`;
      return key === undefined
        ? faq_group_zero.en_heading
        : faq_group_zero[key];
    },
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
