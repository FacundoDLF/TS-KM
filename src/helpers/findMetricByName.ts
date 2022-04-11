import { Step, Question } from "@/types";

const findMetricByName = (
  state: Step,
  name: Question["title"],
  MetricsArea: Question["financialMetricsArea"]
) => {
  const questionList = Object.entries(state);
  let contentToReturn = null;
  for (let index = 0; index < questionList.length; index++) {
    const question = questionList[index];
    const questionContent = question[1];
    const questionIndex = questionContent.findIndex(
      (question: Question) =>
        question.title === name && question.financialMetricsArea === MetricsArea
    );
    if (questionIndex > -1) {
      contentToReturn = questionContent[questionIndex];
    }
  }
  return contentToReturn;
};

export default findMetricByName;
