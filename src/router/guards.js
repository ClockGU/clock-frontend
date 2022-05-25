import store from "@/store";
import { getContractWithLastActivity, getNextContractParams } from "@/utils";
import { log } from "@/utils/log";

export async function RequiredDataGuard(to, from, next) {
  if (to.query.poll !== undefined && to.query.poll === false) {
    return next();
  }

  try {
    // eslint-disable-next-line no-unused-vars
    const [shifts, contracts, reports] = await Promise.all([
      store.dispatch("shift/queryShifts"),
      store.dispatch("contract/queryContracts"),
      store.dispatch("report/list")
    ]);

    const contractMatch = contracts.find(
      (contract) => contract.uuid === to.params.contract
    );
    // Redirect to 404 page we are looking for a contract that does not exist
    if (to.params.contract !== undefined && !contractMatch) {
      return next({ name: "404" });
    }

    // If we match a route that requires a contract to be set
    // but the user did not set one, we get the contract with
    // the latest activity
    if (to.params.contract === undefined) {
      const uuid = getContractWithLastActivity({ shifts, contracts });
      return next(getNextContractParams(to, uuid));
    }
  } catch (error) {
    log(error);
    return;
  }
  return next();
}
