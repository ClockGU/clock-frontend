<template>
  <v-card loading class="mx-auto" max-width="350" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <v-sheet
          class="mb-5 loading"
          color="grey lighten-1"
          height="15px"
          max-width="150px"
        ></v-sheet>
        <v-list-item-title class="headline mb-1">
          <v-sheet
            class="mb-1 loading"
            color="grey lighten-1"
            height="26px"
            max-width="100px"
          ></v-sheet>
        </v-list-item-title>
        <v-list-item-subtitle>
          <v-sheet
            class="loading"
            color="grey lighten-1"
            height="15px"
            max-width="150px"
          ></v-sheet>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-card-actions class="mt-2 mb-1">
      <v-sheet
        class="loading mr-4"
        color="grey lighten-1"
        height="24px"
        min-width="60px"
      ></v-sheet>
      <v-sheet
        class="loading"
        color="grey lighten-1"
        height="24px"
        min-width="60px"
      ></v-sheet>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ContractListCardSkeleton"
};
</script>

<style lang="sass">
$base-color: #ddd
$shine-color: #e8e8e8
$animation-duration: 1.6s
$avatar-offset: 52 + 16

@mixin background-gradient
  background-image: linear-gradient(90deg, $base-color 0px, $shine-color 40px, $base-color 80px)
  background-size: 600px

.loading
  position: relative
  overflow: hidden

  &::after
    display: block
    content: ""
    position: absolute
    width: 100%
    height: 100%
    @include background-gradient
    animation: loading $animation-duration infinite linear

@keyframes loading
  0%
    background-position: -100px

  40%,
  100%
    background-position: 140px
</style>
