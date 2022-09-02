import {
  ContractService,
  ReportService,
  ShiftService
} from "@/services/models";
import store from "@/store";

class ContentDataService {
  constructor() {}

  static async initialize() {
    const contractData = await ContractService.list();
    const shiftData = await ShiftService.list();
    const reportData = await ReportService.list();
    // TODO: clocked_in_shifts missing
    // TODO: Messages missing
    store.commit("contentData/setupContentData", {
      contractData,
      shiftData,
      reportData
    });
    store.commit("contentData/setContentDataInitialized");
  }
  static clearContentData() {
    store.commit("contentData/clearContentData");
    store.commit("contentData/unsetContentDataInitialized");
  }
}

export default ContentDataService;
