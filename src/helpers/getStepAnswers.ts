import { Question, Step } from "@/types";

interface QuestionAnswers {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const getStepAnswers = (state: Step): QuestionAnswers => {
  const steps = Object.entries(state);
  const answers: QuestionAnswers = {};
  steps.forEach(step => {
    const questions = step[1];
    if (questions)
      questions.forEach((question: Question) => {
        if (question?.answer) answers[question.id] = question.answer;
      });
  });
  return answers;
};
export default getStepAnswers;
