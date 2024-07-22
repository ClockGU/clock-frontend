<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="mb-6">{{ $t("app.faq") }}</h1>
        <v-row v-if="loading" justify="center">
          <Placeholder name="UndrawNoData"></Placeholder>
          <v-progress-circular
            :size="70"
            :width="7"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-row>
        <v-row
          v-for="(faq_group, i) in faqs_object"
          v-else
          :key="i + 100"
          class="mt-4"
        >
          <h2 v-if="faq_group[0].faq_heading" class="mt-4 pl-6 mb-2">
            {{ heading(faq_group[0].faq_heading) }}
          </h2>
          <v-expansion-panels variant="popout">
            <v-expansion-panel v-for="(faq, j) in faq_group" :key="j">
              <v-expansion-panel-title
                class="text-body-1"
                :class="getQuestionFontWeight(faq)"
                @click="setSelectedFaq(faq)"
                v-html="question(faq)"
              >

              </v-expansion-panel-title>
              <v-expansion-panel-text class="text-body-1" v-html="answer(faq)">
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
        <p class="mt-10">
          <br />
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
import Placeholder from "@/components/Placeholder.vue";
import { marked } from "marked";
import DOMPurify from "dompurify";
export default {
  name: "FAQ",
  components: { Placeholder },
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
    }),
    smth() {
      return this.$store.getters["faq/status"];
    }
  },
  async created() {
    await this.$store.dispatch("faq/queryFaq");
  },
  methods: {
    heading(faq_group_zero) {
      const key = `${this.locale}_heading`;
      return key === undefined
        ? faq_group_zero.en_heading
        : faq_group_zero[key];
    },
    parsedText(text) {
      return DOMPurify.sanitize(marked.parse(text));
    },
    question(faq) {
      const key = `${this.locale}_question`;
      return key === undefined ? faq.en_question : this.parsedText(faq[key]);
    },
    answer(faq) {
      const key = `${this.locale}_answer`;
      return key === undefined ? faq.en_answer : this.parsedText(faq[key]);
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
