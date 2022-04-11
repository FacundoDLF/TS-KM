import store from "@/store";

import getCaseData from "./getCaseData";

import { Country, Industry, Offering, Community } from "@/types/index";

import { generatePpt as threeColumns } from "./ppt/ThreeColumns";
import { generatePpt as caseStudy } from "./ppt/CaseStudy";
import { generatePpt as statsSlide } from "./ppt/StatsSlide";
import { generatePpt as quotesSlide } from "./ppt/QuotesSlide";
import { generatePpt as miniCaseSummary } from "./ppt/MiniCaseSummary";
import { generatePpt as miniCaseTable } from "./ppt/MiniCaseTable";
import { generatePpt as caseWithGraph } from "./ppt/CaseWithGraph";

interface StepAnswers {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface CaseData {
  situation: StepAnswers;
  approach: StepAnswers;
  results: StepAnswers;
  client: StepAnswers;
  revenue: number;
  offerings: Offering[];
  countries: Country[];
  industries: Industry[] | Industry;
  communities: Community[];
  projectName: string;
  endDate: string;
  attachment?: string; //TODO: Solucionar el faltante del file (attachment) en SelectedCase
}

export enum PptNames {
  ThreeColumns = "threeColumns",
  CaseStudy = "caseStudy",
  StatsSlide = "statsSlide",
  QuotesSlide = "quotesSlide",
  MiniCaseSummary = "miniCaseSummary",
  MiniCaseTable = "miniCaseTable",
  CaseWithGraph = "caseWithGraph"
}

export enum PptTypes {
  Single = "single",
  Multiple = "multiple"
}

export const TEMPLATE_OPTIONS = {
  title: "ALIX_TEMPLATE",
  objects: [
    {
      line: {
        line: { color: "#5CB335", width: 0.3 },
        y: 6.45,
        x: 0.3,
        w: 9.4,
        rotate: -6.1
      }
    },
    {
      image: {
        x: 8.25,
        y: 7.16,
        w: 1,
        h: 0.16,
        path: require("@/assets/img/alixlogo.jpg")
      }
    }
  ]
};

const PptGenerators = {
  [PptNames.ThreeColumns]: (cases: CaseData[]) => threeColumns(cases),
  [PptNames.CaseStudy]: (cases: CaseData[]) => caseStudy(cases),
  [PptNames.StatsSlide]: (cases: CaseData[]) => statsSlide(cases[0]),
  [PptNames.CaseWithGraph]: (cases: CaseData[]) => caseWithGraph(cases),
  [PptNames.QuotesSlide]: (cases: CaseData[]) => quotesSlide(cases),
  [PptNames.MiniCaseSummary]: (cases: CaseData[]) => miniCaseSummary(cases),
  [PptNames.MiniCaseTable]: (cases: CaseData[]) => miniCaseTable(cases)
};

export const getPptByName = (pptName: PptNames, type: PptTypes) => {
  let data: CaseData[];
  if (type == PptTypes.Single) {
    data = [store.getters["selectedCase/caseData"]];
  } else {
    const cases = store.state.casesToExport;
    data = cases.map(c => getCaseData(c));
  }
  return PptGenerators[pptName](data);
};
