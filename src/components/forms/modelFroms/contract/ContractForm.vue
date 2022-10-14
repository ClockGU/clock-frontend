<template>
  <v-card class="mx-auto word-break" min-width="400" :max-width="600">
    <CardToolbar
      :title="title"
      :logout-action="false"
      close-action
      @close="closeFn"
    ></CardToolbar>
  </v-card>
</template>

<script>
import { Contract } from "@/models/ContractModel";
import CardToolbar from "@/components/cards/CardToolbar";

export default {
  name: "ContractForm",
  components: { CardToolbar },
  props: {
    existingContract: {
      type: [Contract, typeof undefined],
      required: false,
      default: undefined
    },
    close: {
      type: Function,
      required: false,
      default: () => {}
    }
  },
  data() {
    return {
      newContract: undefined
    };
  },
  computed: {
    isNewInstance() {
      return this.newContract.id === "";
    },
    title() {
      if (this.isNewInstance) {
        return this.$t("forms.titleAdd", {
          entity: this.$tc("models.contract", 1)
        });
      }
      return this.$t("forms.titleUpdate", {
        entity: this.$tc("models.contract", 1)
      });
    }
  },
  created() {
    this.initializeNewContract();
  },
  methods: {
    initializeNewContract() {
      this.newContract =
        this.existingContract !== undefined
          ? this.existingContract.clone()
          : new Contract();
    },
    closeFn() {
      this.initializeNewContract();
      this.close();
    }
  }
};
</script>

<style scoped></style>
