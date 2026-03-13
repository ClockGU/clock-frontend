import store from "@/store";
import ContentDataService from "@/services/contentData";

export async function initializeDataGuard(to, from, next) {
  if (to.query.poll !== undefined && to.query.poll === false) {
    return next();
  }

  if (!store.getters["contentData/contentDataInitialized"]) {
    await ContentDataService.initialize();
  }

  return next();
}
