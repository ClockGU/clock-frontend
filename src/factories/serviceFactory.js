const repositories = {
  shift: {
    serviceLoader: () => import("@/services/shift.js"),
    formComponent: () => import("@/components/shifts/ShiftForm.vue")
  },
  contract: {
    serviceLoader: () => import("@/services/contract.js"),
    formComponent: () => import("@/components/contracts/ContractForm.vue")
  },
  renewContract: {
    serviceLoader: () => import("@/services/contract.js"),
    formComponent: () => import("@/components/contracts/ExtendContractForm.vue")
  }
};

export const ServiceFactory = {
  get: (name) => repositories[name]
};
