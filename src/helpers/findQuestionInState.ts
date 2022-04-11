import { Step, Question } from "@/types";

const findQuestionInState = (state: Step, questionId: Question["id"]) => {
  const questionList = Object.entries(state);
  let contentToReturn = null;
  for (let index = 0; index < questionList.length; index++) {
    const question = questionList[index];
    const questionContent = question[1];
    const questionIndex = questionContent.findIndex(
      (question: Question) => question.id === questionId
    );
    if (questionIndex > -1) {
      contentToReturn = questionContent[questionIndex];
    }
  }
  return contentToReturn;
};

export default findQuestionInState;
