<template>
  <section id="hero">
    <v-img
      :min-height="minHeight"
      :src="img"
      class="text-white"
      gradient="to right, rgba(5, 11, 31, .3), rgba(5, 11, 31, .3)"
    >
      <v-container class="fill-height px-4 py-12">
        <v-responsive
          class="d-flex align-center"
          height="100%"
          max-width="700"
          width="100%"
        >
          <h1 class="text-1 font-weight-black mb-4">
            {{ $t("hero.slogan") }}
          </h1>

          <p>
            {{ $t("hero.text") }}
          </p>

          <div
            :class="smAndDown ? 'flex-column align-start' : 'align-center'"
            class="d-flex flex-wrap"
          >
            <ButtonGoetheOAuth>
              {{ $t("hero.login") }}
            </ButtonGoetheOAuth>
          </div>
        </v-responsive>
      </v-container>
    </v-img>
  </section>
</template>

<script>
import { log } from "@/utils/log";
import OAuth2Service from "@/services/oauth2";
import ButtonGoetheOAuth from "@/components/ButtonGoetheOAuth.vue";
import { useDisplay, useLayout } from "vuetify";
import heroJPG from "@/assets/home-hero.jpg";

export default {
  name: "SectionHero",
  components: { ButtonGoetheOAuth },
  provide: {
    theme: { isDark: true }
  },
  data: () => ({
    loading: false
  }),

  computed: {
    img() {
      return heroJPG;
    },
    smAndDown() {
      const { smAndDown } = useDisplay();
      return smAndDown.value;
    },
    minHeight() {
      const { mdAndUp } = useDisplay();
      const height = mdAndUp.value ? "100vh" : "50vh";
      const { mainRect } = useLayout();
      return `calc(${height} - ${mainRect}px)`;
    }
  },
  methods: {
    async login() {
      this.loading = true;
      try {
        // TODO: Add timeout
        const response = await OAuth2Service.get();
        const { authorization_url } = response.data;

        window.location = authorization_url;
      } catch (error) {
        // TODO: Put component into error state
        await this.$store.dispatch("snackbar/setSnack", {
          message: this.$t("feedback.snackbar.error"),
          color: "error"
        });

        log(error);
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 5000);
      }
    }
  }
};
</script>
