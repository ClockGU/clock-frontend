import store from "@/store";

export function handle400Errors(target, name, descriptor) {
  const original = descriptor.value;
  if (typeof original === "function") {
    descriptor.value = function (payload) {
      return original.apply(this, [payload]).catch((error) => {
        store.dispatch("snackbar/setErrorSnacks", error.response.data);
        throw Error(error.response.data);
      });
    };
  }
  return descriptor;
}
