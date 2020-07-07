<template>
  <section id="hero">
    <v-img
      :min-height="minHeight"
      :src="require('@/assets/home-hero.jpg')"
      class="white--text"
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
            Bringe deine Stundenzettel unter Kontrolle
          </h1>

          <p>
            Mit Clock kannst du deinen Stundenzettel ganz bequem unterwegs oder
            am Computer bearbeiten.
          </p>

          <div
            :class="
              $vuetify.breakpoint.smAndDown
                ? 'flex-column align-start'
                : 'align-center'
            "
            class="d-flex flex-wrap"
          >
            <ButtonGoetheOAuth>
              Login mit HRZ Account
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
import ButtonGoetheOAuth from "@/components/ButtonGoetheOAuth";

export default {
  name: "SectionHero",
  components: { ButtonGoetheOAuth },
  data: () => ({
    loading: false
  }),
  provide: {
    theme: { isDark: true }
  },

  computed: {
    minHeight() {
      const height = this.$vuetify.breakpoint.mdAndUp ? "100vh" : "50vh";

      return `calc(${height} - ${this.$vuetify.application.top}px)`;
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
          snack: this.$t("feedback.snackbar.error"),
          timeout: 4000,
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
