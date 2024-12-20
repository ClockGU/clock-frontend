<template>
  <div class="mode-toggle" :class="darkDark" @click="toggleTheme">
    <div class="toggle">
      <div id="dark-mode" class="theme" type="checkbox"></div>
    </div>
  </div>
</template>

<script>
import { useTheme } from "vuetify";

export default {
  name: "ThemeToggle",
  setup() {
    return { theme: useTheme() };
  },
  data() {
    return {
      userTheme: "v-theme--light"
    };
  },
  computed: {
    isDark() {
      return this.userTheme === "v-theme--dark";
    },
    darkDark() {
      return this.isDark && "darkmode-toggled";
    }
  },
  created() {
    const initialTheme = this.getUserPrefTheme();
    this.setTheme(initialTheme);
    if (this.isDark) return this.dark();
    return this.light();
  },
  methods: {
    getUserPrefTheme() {
      const theme = localStorage.getItem("user-theme");
      if (theme) return theme;
      return "v-theme--light";
    },
    setTheme(theme) {
      localStorage.setItem("user-theme", theme);
      this.userTheme = theme;
      document.documentElement.className = theme;
    },
    toggleTheme() {
      if (!this.isDark) {
        this.setTheme("v-theme--dark");
        this.dark();
      } else {
        this.setTheme("v-theme--light");
        this.light();
      }
    },
    dark() {
      this.theme.global.name.value = "dark";
      document.querySelector("body").classList.add("dark-mode");
    },

    light() {
      this.theme.global.name.value = "light";
      document.querySelector("body").classList.remove("dark-mode");
    }
  }
};
</script>

<style scoped lang="scss">
$dark: #171717;
$mode-toggle-bg: #414141;

body {
  background-color: #fff;
  color: $dark;
  transition: background-color 0.2s ease, color 0.2s ease;
}

body {
  &.dark-mode {
    background-color: lighten($dark, 100%);

    .flex {
      h1 {
        color: #fff;
      }
    }
  }
}

.mode-toggle {
  position: relative;
  //margin: auto .5rem .5rem auto;
  padding: 0;
  width: 44px;
  height: 24px;
  min-width: 36px;
  min-height: 20px;
  background-color: $mode-toggle-bg;
  border: 0;
  border-radius: 24px;
  outline: 0;
  overflow: hidden;
  cursor: pointer;
  z-index: 2;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-touch-callout: none;
  appearance: none;
  transition: background-color 0.5s ease;

  .toggle {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 3px solid transparent;
    box-shadow: inset 0 0 0 2px #a5abba;
    overflow: hidden;
    transition: transform 0.5s ease;

    #dark-mode {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 50%;

      &:before {
        content: "";
        position: relative;
        width: 100%;
        height: 100%;
        left: 50%;
        float: left;
        background-color: #a5abba;
        transition: border-radius 0.5s ease, width 0.5s ease, height 0.5s ease,
          left 0.5s ease, transform 0.5s ease;
      }
    }
  }
}

body.dark-mode {
  .mode-toggle {
    background-color: lighten($mode-toggle-bg, 5%);

    .toggle {
      transform: translateX(19px);

      #dark-mode {
        &:before {
          border-radius: 50%;
          width: 150%;
          height: 85%;
          left: 40%;
          transform: translate(-10%, -40%), rotate(-35deg);
        }
      }
    }
  }
}

@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

html {
  font-size: 16px;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
}

body {
  margin: 0;
  font-family: "Source Sans Pro";
}

h1 {
  font-weight: 400;
  transition: color 0.5s ease;
}

.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
@media (max-width: 960px) {
  .mode-toggle {
    margin-right: 20px;
  }
}
</style>
