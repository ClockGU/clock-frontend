import is from "ramda/src/is";

export default class Faq {
  constructor({
    de_question = null,
    de_answer = null,
    en_question = null,
    en_answer = null
  } = {}) {
    this.de_question = is(String, de_question) ? de_question : null;
    this.de_answer = is(String, de_answer) ? de_answer : null;
    this.en_question = is(String, en_question) ? en_question : null;
    this.en_answer = is(String, en_answer) ? en_answer : null;
  }
}
