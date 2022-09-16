import store from "@/store";
import { getContractWithLastActivity, getNextContractParams } from "@/utils";
import { log } from "@/utils/log";
import ContentDataService from "@/services/contentData";

export async function RequiredDataGuard(to, from, next) {
  if (to.query.poll !== undefined && to.query.poll === false) {
    return next();
  }
  try {
    const contracts = await store.dispatch("contract/queryContracts");
    const contractMatch = contracts.find(
      (contract) => contract.uuid === to.params.contract
    );
    if (to.params.contract !== undefined) {
      // Redirect to 404 page we are looking for a contract that does not exist
      if (!contractMatch) {
        return next({ name: "404" });
      }
      // go on to valid, matched contract.
      // TODO: This call is mentioned twice.
      await store.dispatch("report/list");
      return next();
    }

    // If we match a route that requires a contract to be set
    // but the user did not set one, yet he has existing contracts, we get the contract with
    // the latest activity
    if (contracts.length > 0) {
      // eslint-disable-next-line no-unused-vars
      const [shifts, reports] = await Promise.all([
        store.dispatch("shift/queryShifts"),
        store.dispatch("report/list")
      ]);
      const uuid = getContractWithLastActivity({ shifts, contracts });
      await store.dispatch("contract/selectContract", uuid);
      return next(getNextContractParams(to, uuid));
    }
  } catch (error) {
    log(error);
    return;
  }
  return next();
}

export async function initializeDataGuard(to, from, next) {
  if (to.query.poll !== undefined && to.query.poll === false) {
    return next();
  }

  if (!store.getters["contentData/contentDataInitialized"]) {
    await ContentDataService.initialize();
    const contract = getContractWithLastActivity({
      shifts: store.getters["contentData/allShifts"],
      contracts: store.getters["contentData/allContracts"]
    });
    await store.dispatch("selectedContract/selectContract", contract);
  }
  return next();
}
