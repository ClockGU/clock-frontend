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
          <h1 class="display-1 font-weight-black mb-4">
            Bringe deine Stundenzettel unter Kontrolle
          </h1>

          <p>
            Hier könnte ihr Text stehen.
          </p>

          <div
            :class="
              $vuetify.breakpoint.smAndDown
                ? 'flex-column align-start'
                : 'align-center'
            "
            class="d-flex flex-wrap"
          >
            <v-btn color="primary" @click="login">
              Login
            </v-btn>
          </div>
        </v-responsive>
      </v-container>
    </v-img>
  </section>
</template>

<script>
import OAuth2Service from "@/services/oauth2";

export default {
  name: "SectionHero",

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
      const response = await OAuth2Service.get();
      const { authorization_url } = response.data;

      window.location = authorization_url;
    }
  }
};
</script>
