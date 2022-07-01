import ApiService from "@/services/api";

function mapApiResponse(response) {
  return {
    id: response.id,
    de_question: response.de_question,
    de_answer: response.de_answer,
    en_question: response.en_question,
    en_answer: response.en_answer
  };
}

const BASE_URL = "/faq/";

const FaqService = {
  get: async function (id) {
    return new Promise((resolve, reject) => {
      return ApiService.get(BASE_URL + `${id}`)
        .then((response) => {
          const faq = mapApiResponse(response.data);
          const newResponse = { ...response, faq };

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

export default FaqService;
