import {
  ContractService,
  ReportService,
  ShiftService
} from "@/services/models";
import store from "@/store";
import { ClockedInShiftService } from "@/services/clockedInShift";

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

    const clockedInShift = await ClockedInShiftService.get();
    store.commit("clock/clockShift", clockedInShift);
  }
  static clearContentData() {
    store.commit("contentData/clearContentData");
    store.commit("contentData/unsetContentDataInitialized");
  }
}

export default ContentDataService;
