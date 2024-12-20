<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="mb-6 ml-2">{{ $t("app.faq") }}</h1>
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
          class="mt-4 mx-2"
        >
          <h2 v-if="faq_group[0].faq_heading" class="my-6">
            {{ heading(faq_group[0].faq_heading) }}
          </h2>
          <v-expansion-panels v-model="selectedFAQ" variant="accordion">
            <v-expansion-panel
              v-for="faq in faq_group"
              :key="faq.id"
              :value="faq"
            >
              <v-expansion-panel-title
                class="text-body-1"
                :class="getQuestionFontWeight(faq)"
              >
                <span>{{ question(faq) }}</span>
              </v-expansion-panel-title>
              <v-expansion-panel-text class="text-body-1 my-2">
                <span v-for="(line, index) in answer(faq)" :key="index">
                  {{ line }}<br v-if="index !== answer(faq).length - 1" />
                </span>
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

export default {
  name: "FAQ",
  components: { Placeholder },
  metaInfo() {
    return { title: this.$t("app.faq") };
  },
  data() {
    return { selectedFAQ: null };
  },
  computed: {
    ...mapGetters({
      loading: "faq/loading",
      faqs_object: "faq/faqs",
      locale: "locale"
    })
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
    question(faq) {
      const key = `${this.locale}_question`;
      return key === undefined ? faq.en_question : faq[key];
    },
    answer(faq) {
      const key = `${this.locale}_answer`;
      const answer = faq[key] === undefined ? faq.en_answer : faq[key];
      return answer.split(/\n/g);
    },
    getQuestionFontWeight(faq) {
      return this.selectedFAQ === faq
        ? "font-weight-bold"
        : "font-weight-normal";
    }
  }
};
</script>
