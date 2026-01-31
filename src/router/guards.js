import store from "@/store";
import ContentDataService from "@/services/contentData";

export async function initializeDataGuard(to, from, next) {
  if (to.query.poll !== undefined && to.query.poll === false) {
    return next();
  }

  if (!store.getters["contentData/contentDataInitialized"]) {
    await ContentDataService.initialize();
  }
  /*
    const selectedContract = store.getters["selectedContract/selectedContract"];
  if (
    !selectedContract ||
    !store.getters["contentData/contractById"](selectedContract.id)
  ) {
    await store.dispatch("selectedContract/autoSelectContract");
  }
  */

  return next();
}
