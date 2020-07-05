import ApiService from "@/services/api";

function mapApiResponse(response) {
  return {
    uuid: response.id,
    user: response.user,
    name: response.name,
    date: { start: response.start_date, end: response.end_date },
    minutes: response.minutes,
    created_at: new Date(response.created_at),
    modified_at: new Date(response.modified_at)
  };
}

const BASE_URL = "/contracts/";

const ContractService = {
  create: async function(data) {
    const requestData = {
      method: "post",
      url: BASE_URL,
      data
    };

    return new Promise((resolve, reject) => {
      return ApiService.customRequest(requestData)
        .then(response => {
          const contract = mapApiResponse(response.data);

          return resolve(contract);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  get: async function(uuid) {
    return new Promise((resolve, reject) => {
      return ApiService.get(BASE_URL + `${uuid}`)
        .then(response => {
          const contract = mapApiResponse(response.data);
          const newResponse = { ...response, contract };

          return resolve(newResponse);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  list: async function() {
    return new Promise((resolve, reject) => {
      ApiService.get(BASE_URL)
        .then(response => {
          const data = response.data.map(item => mapApiResponse(item));
          const newResponse = { ...response, data };
          resolve(newResponse);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  update: async function(data, uuid) {
    return new Promise((resolve, reject) => {
      return ApiService.patch(`${BASE_URL}${uuid}/`, data)
        .then(response => {
          const contract = mapApiResponse(response.data);

          return resolve(contract);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  delete: async function(uuid) {
    return new Promise((resolve, reject) => {
      return ApiService.delete(`${BASE_URL}${uuid}/`)
        .then(response => {
          return resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  lock: async function({ uuid, month, year }) {
    return ApiService.post(`${BASE_URL}${uuid}/${month}/${year}/lock/`);
  }
};

export default ContractService;
