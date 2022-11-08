import store from "@/store";
import { getContractWithLastActivity } from "@/utils";
import ContentDataService from "@/services/contentData";

export async function initializeDataGuard(to, from, next) {
  if (to.query.poll !== undefined && to.query.poll === false) {
    return next();
  }

  if (!store.getters["contentData/contentDataInitialized"]) {
    await ContentDataService.initialize();
  }
  const selectedContract = store.getters["selectedContract/selectedContract"];
  if (
    selectedContract === undefined ||
    store.getters["contentData/contractById"](selectedContract.id) === undefined
  ) {
    console.log("ran");
    const contract = getContractWithLastActivity({
      shifts: store.getters["contentData/allShifts"],
      contracts: store.getters["contentData/allContracts"]
    });
    await store.dispatch("selectedContract/selectContract", contract);
  }
  return next();
}
