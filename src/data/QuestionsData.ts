import {
  Question,
  QuestionType,
  PrimaryStep,
  SecondaryStep,
  MetricsSection
} from "@/types";
import { SituationFields } from "@/constants/situationFields";
import { ApproachFields } from "@/constants/approachFields";
import { ResultsFields } from "@/constants/resultsFields";
import { ClientInfoFields } from "@/constants/clientInfoFields";

const QuestionsData: Question[] = [
  {
    id: SituationFields.HEADLINE,
    type: QuestionType.text,
    title: "Headline",
    description:
      "Provide an overall summary of the project that includes a disguised description of the client. Provide details on impact. This is a stand-alone summary of the project.",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.situation,
    questionStep: SecondaryStep.firstStep,
    lengthLimit: 119
  },
  {
    id: ResultsFields.REVENUE,
    type: QuestionType.range,
    title: "Revenue",
    isRequired: false,
    answer: { startDateValue: null, endDateValue: null },
    error: "",
    questionParent: PrimaryStep.results,
    questionStep: SecondaryStep.firstStep,
    isFinancialMetric: true,
    isMetric: true,
    financialMetricsArea: MetricsSection.income,
    created: false
  },
  {
    id: ResultsFields.COST_GOODS_SOLD,
    type: QuestionType.range,
    title: "Cost of Goods sold",
    isRequired: false,
    answer: { startDateValue: null, endDateValue: null },
    error: "",
    questionParent: PrimaryStep.results,
    questionStep: SecondaryStep.firstStep,
    isFinancialMetric: true,
    isMetric: true,
    financialMetricsArea: MetricsSection.income,
    created: false
  },
  {
    id: ResultsFields.GOODS_PROFIT,
    type: QuestionType.range,
    title: "Gross Profit",
    isRequired: false,
    answer: { startDateValue: null, endDateValue: null },
    error: "",
    questionParent: PrimaryStep.results,
    questionStep: SecondaryStep.firstStep,
    isFinancialMetric: true,
    isMetric: true,
    financialMetricsArea: MetricsSection.income,
    created: false
  },
  {
    id: ResultsFields.SELLING_GENERAL_ADMINISTRATIVE,
    type: QuestionType.range,
    title: "Selling, General & Administrative",
    isRequired: false,
    answer: { startDateValue: null, endDateValue: null },
    error: "",
    questionParent: PrimaryStep.results,
    questionStep: SecondaryStep.firstStep,
    isFinancialMetric: true,
    isMetric: true,
    financialMetricsArea: MetricsSection.income,
    created: false
  },
  {
    id: ResultsFields.EBITDA,
    type: QuestionType.range,
    title: "EBITDA",
    isRequired: false,
    answer: { startDateValue: null, endDateValue: null },
    error: "",
    questionParent: PrimaryStep.results,
    questionStep: SecondaryStep.firstStep,
    isFinancialMetric: true,
    isMetric: true,
    financialMetricsArea: MetricsSection.income,
    created: false
  },
  {
    id: ResultsFields.CASH_INVESTMENTS,
    type: QuestionType.range,
    title: "Cash & S/T Invesments",
    isRequired: false,
    answer: { startDateValue: null, endDateValue: null },
    error: "",
    questionParent: PrimaryStep.results,
    questionStep: SecondaryStep.firstStep,
    isFinancialMetric: true,
    isMetric: true,
    financialMetricsArea: MetricsSection.balance,
    created: false
  },
  {
    id: ResultsFields.ACCOUNTS_RECEIVABLE,
    type: QuestionType.range,
    title: "Accounts Receivable",
    isRequired: false,
    answer: { startDateValue: null, endDateValue: null },
    error: "",
    questionParent: PrimaryStep.results,
    questionStep: SecondaryStep.firstStep,
    isFinancialMetric: true,
    isMetric: true,
    financialMetricsArea: MetricsSection.balance,
    created: false
  },
  {
    id: ResultsFields.INVENTORY,
    type: QuestionType.range,
    title: "Inventory",
    isRequired: false,
    answer: { startDateValue: null, endDateValue: null },
    error: "",
    questionParent: PrimaryStep.results,
    questionStep: SecondaryStep.firstStep,
    isFinancialMetric: true,
    isMetric: true,
    financialMetricsArea: MetricsSection.balance,
    created: false
  },
  {
    id: ResultsFields.ACCOUNTS_PAYABLE,
    type: QuestionType.range,
    title: "Accounts Payable",
    isRequired: false,
    answer: { startDateValue: null, endDateValue: null },
    error: "",
    questionParent: PrimaryStep.results,
    questionStep: SecondaryStep.firstStep,
    isFinancialMetric: true,
    isMetric: true,
    financialMetricsArea: MetricsSection.balance,
    created: false
  },
  {
    id: ResultsFields.TOTAL_DEBT,
    type: QuestionType.range,
    title: "Total Debt",
    isRequired: false,
    answer: { startDateValue: null, endDateValue: null },
    error: "",
    questionParent: PrimaryStep.results,
    questionStep: SecondaryStep.firstStep,
    isFinancialMetric: true,
    isMetric: true,
    financialMetricsArea: MetricsSection.balance,
    created: false
  },
  {
    id: SituationFields.DESCRIPTION,
    type: QuestionType.text,
    title: "Describe your client and any additional companies involved",
    description:
      "Include industry, geographies, revenue and specifics. Additional companies could include acquisitions, carve-outs, or other parties involved.",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.situation,
    questionStep: SecondaryStep.secondStep,
    lengthLimit: 120
  },
  {
    id: SituationFields.CHALLENGES,
    type: QuestionType.text,
    title: "Summarize the challenge(s) faced before our involvement",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.situation,
    questionStep: SecondaryStep.secondStep,
    lengthLimit: 220
  },
  {
    id: SituationFields.HIRED_TO,
    type: QuestionType.text,
    title: "Explain what AlixPartners was hired to do",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.situation,
    questionStep: SecondaryStep.secondStep,
    lengthLimit: 320
  },
  {
    id: SituationFields.FAS_CASE_CITATION,
    type: QuestionType.text,
    title: "Case citation involved in this engagement",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.situation,
    questionStep: SecondaryStep.thirdStep
  },
  /*{
    id: SituationFields.FAS_CLIENT_PREVAIL,
    type: QuestionType.text,
    title: "Case citation involved in this engagement",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.situation,
    questionStep: SecondaryStep.thirdStep
  },*/
  {
    id: SituationFields.FAS_JURISDICTION,
    type: QuestionType.text,
    title: "Enter the jurisdiction or tribunal involved in this engagement",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.situation,
    questionStep: SecondaryStep.thirdStep
  },
  {
    id: SituationFields.FAS_REGULATORY_AGENCIES,
    type: QuestionType.multiselect,
    title: "Select regulatory agency(ies) involved in this engagement",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.situation,
    questionStep: SecondaryStep.thirdStep
  },
  {
    id: SituationFields.FAS_LAW_FIRMS,
    type: QuestionType.multiselect,
    title: "Select the law firm AlixPartners partnered with on this engagement",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.situation,
    questionStep: SecondaryStep.thirdStep
  },
  {
    id: SituationFields.FAS_OPPOSING_LAW_FIRMS,
    type: QuestionType.multiselect,
    title: "Select the law firm opposing our client in this engagement",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.situation,
    questionStep: SecondaryStep.thirdStep
  },
  {
    id: SituationFields.FAS_TERMS,
    type: QuestionType.multiselect,
    title: "Select all FAS special terms associated with this engagement",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.situation,
    questionStep: SecondaryStep.thirdStep
  },
  {
    id: SituationFields.FAS_OPPOSING_EXPERT,
    type: QuestionType.text,
    title: "Specify the expert opposing our client in this engagement",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.situation,
    questionStep: SecondaryStep.thirdStep
  },
  {
    id: SituationFields.FAS_OPPOSING_EXPERT_REPORT_DATE,
    type: QuestionType.text,
    title: "List report date of opposing expert report",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.situation,
    questionStep: SecondaryStep.thirdStep
  },
  {
    id: SituationFields.FAS_OPPOSING_EXPERT_HOURLY_FEE,
    type: QuestionType.numeric,
    title: "List the hourly fee rate of the opposing expert",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.situation,
    questionStep: SecondaryStep.thirdStep
  },
  {
    id: ApproachFields.NARRATIVE,
    type: QuestionType.text,
    title:
      "Provide a short narrative of services provided and duration of project",
    description: "Begin with an action verb.",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.approach,
    questionStep: SecondaryStep.firstStep,
    lengthLimit: 160
  },
  {
    id: ApproachFields.DETAILS,
    type: QuestionType.text,
    title: "Detail the approach the AlixPartners team took",
    description:
      "Provide a summary of the methods the project team used. Begin with an action verb and include relevant details, for example met virtually, conducted site visits, required court appearances.",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.approach,
    questionStep: SecondaryStep.firstStep,
    lengthLimit: 370
  },
  {
    id: ResultsFields.OVERALL_IMPACT,
    type: QuestionType.text,
    title:
      "Describe overall impact of all initiatives summarized, quantifiable benefit or risk avoided",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.results,
    questionStep: SecondaryStep.firstStep,
    lengthLimit: 180
  },
  {
    id: ResultsFields.BENEFITS,
    type: QuestionType.text,
    title:
      "Provide measurable benefits/results achieved on each separate initiative",
    description:
      "Include outcome in a dollar and percentage change to baseline, if applicable.",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.results,
    questionStep: SecondaryStep.firstStep,
    lengthLimit: 260
  },
  {
    id: ResultsFields.CLIENT_QUOTE,
    type: QuestionType.text,
    title: "Quote from the client",
    description:
      "Provide a client testimonial, including the title of the individual.",
    isRequired: false,
    answer: "",
    error: "",
    questionParent: PrimaryStep.results,
    questionStep: SecondaryStep.thirdStep,
    lengthLimit: 180
  },
  {
    id: ResultsFields.CASE_RECOGNITIONS,
    type: QuestionType.text,
    title:
      "Note any recognition or accolade awarded by an external organization",
    description: "Provide the exact title of the award.",
    isRequired: false,
    answer: "",
    error: "",
    questionParent: PrimaryStep.results,
    questionStep: SecondaryStep.thirdStep
  },
  {
    id: ResultsFields.CHART,
    type: QuestionType.file,
    title: "Upload a chart or graph that summarizes the impact of our work",
    description: "You can upload images up to 500kb (.jpg, .png)",
    isRequired: false,
    answer: "",
    error: "",
    questionParent: PrimaryStep.results,
    questionStep: SecondaryStep.thirdStep
  },
  {
    id: ResultsFields.CULTURE_SHIFT,
    type: QuestionType.text,
    title:
      "Note how the project helped with sustainable culture shift or provided long-term benefits to the client",
    description: "",
    isRequired: false,
    answer: "",
    error: "",
    questionParent: PrimaryStep.results,
    questionStep: SecondaryStep.secondStep,
    lengthLimit: 260
  },
  {
    id: ClientInfoFields.REVENUE,
    type: QuestionType.select,
    title: "",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.clientInformation,
    questionStep: SecondaryStep.firstStep
  },
  {
    id: ClientInfoFields.INDUSTRIES,
    type: QuestionType.multiselect,
    title: "",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.clientInformation,
    questionStep: SecondaryStep.firstStep
  },
  {
    id: ClientInfoFields.SEGMENTS,
    type: QuestionType.multiselect,
    title: "",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.clientInformation,
    questionStep: SecondaryStep.firstStep
  },
  {
    id: ClientInfoFields.SERVICES,
    type: QuestionType.multiselect,
    title: "",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.clientInformation,
    questionStep: SecondaryStep.firstStep
  },
  {
    id: ClientInfoFields.OFFERINGS,
    type: QuestionType.multiselect,
    title: "",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.clientInformation,
    questionStep: SecondaryStep.firstStep
  },
  {
    id: ClientInfoFields.COUNTRIES,
    type: QuestionType.multiselect,
    title: "",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.clientInformation,
    questionStep: SecondaryStep.firstStep
  },
  {
    id: ClientInfoFields.START_DATE,
    type: QuestionType.text,
    title: "",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.clientInformation,
    questionStep: SecondaryStep.firstStep
  },
  {
    id: ClientInfoFields.END_DATE,
    type: QuestionType.text,
    title: "",
    description: "",
    isRequired: true,
    answer: "",
    error: "",
    questionParent: PrimaryStep.clientInformation,
    questionStep: SecondaryStep.firstStep
  }
];

export default QuestionsData;
