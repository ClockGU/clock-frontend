import ApiService from "@/services/api";

function mapApiResponse(response) {
  return {
    id: response.id,
    type: response.type,
    de_title: response.de_title,
    de_text: response.de_text,
    en_title: response.en_title,
    en_text: response.en_text,
    valid_from: response.valid_from,
    valid_to: response.valid_to
  };
}

const BASE_URL = "/message/";

const MessageService = {
  get: async function (id) {
    return new Promise((resolve, reject) => {
      return ApiService.get(BASE_URL + `${id}`)
        .then((response) => {
          const message = mapApiResponse(response.data);
          const newResponse = { ...response, message };

          return resolve(newResponse);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  list: async function () {
    return new Promise((resolve, reject) => {
      ApiService.get(BASE_URL)
        .then((response) => {
          const data = response.data.map((item) => mapApiResponse(item));
          const newResponse = { ...response, data };
          resolve(newResponse);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
};

export default MessageService;
