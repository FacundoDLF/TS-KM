import pptxgen from "pptxgenjs";

import { SituationFields } from "@/constants/situationFields";
import { ApproachFields } from "@/constants/approachFields";
import { ResultsFields } from "@/constants/resultsFields";
import getMetricsData from "@/helpers/getMetricsData";
import { CaseData, TEMPLATE_OPTIONS } from "../generatePpt";

const { AlignV, AlignH } = new pptxgen();

export const Colors = {
  ClientData: "#FFFF00",
  Approach: "#006176",
  Situation: "#032E45",
  Outcome: "#0696A6",
  Statistics: "#ECECEE",
  Line: "#5CB335",
  White: "#FFFFFF",
  Black: "#000000"
};

export const OPTIONS = {
  Headline: {
    bold: true,
    fontSize: 18,
    x: 0.3,
    y: 0.2,
    h: 0.4,
    fontFace: "Verdana",
    w: 9.4,
    valign: AlignV.top,
    align: AlignH.left
  },
  Statistics: {
    fill: { color: Colors.Statistics },
    color: Colors.Black,
    x: 0,
    y: 1,
    w: "100%",
    h: 0.8,
    fontSize: 16,
    align: AlignH.left
  },
  Outcome: {
    x: 0.3,
    y: 2.1,
    w: 9.4,
    fontSize: 14,
    align: AlignH.left,
    valign: AlignV.top
  },
  StatDescription: {
    x: 2,
    fontFace: "Verdana",
    w: "80%",
    fontSize: 12
  },
  StatTitle: {
    bold: true,
    fontFace: "Verdana",
    fontSize: 18,
    x: 1,
    w: "15%"
  },
  Situation: {
    fill: { color: Colors.Situation },
    color: Colors.White,
    bold: true,
    x: 0,
    y: 4.2,
    fontFace: "Verdana",
    w: "49%",
    h: 0.4,
    fontSize: 12,
    align: AlignH.left
  },
  Approach: {
    fill: { color: Colors.Approach },
    color: Colors.White,
    bold: true,
    x: 5.1,
    y: 4.2,
    fontFace: "Verdana",
    w: "49%",
    h: 0.4,
    fontSize: 12,
    align: AlignH.left
  },
  Text: {
    align: AlignH.left,
    fontSize: 12,
    lineSpacing: 14,
    shrinkText: true,
    h: 1,
    y: 4.6,
    w: "40%",
    valign: AlignV.top
  },
  Icon: {
    path: require("@/assets/img/case_study_icon.png"),
    x: 0.49,
    y: 1.22,
    h: 0.36,
    w: 0.36
  }
};

const SITUATION_FIELDS = [SituationFields.CHALLENGES, SituationFields.HIRED_TO];

const APPROACH_FIELDS = [ApproachFields.DETAILS, ApproachFields.NARRATIVE];

const RESULTS_FIELDS = [ResultsFields.OVERALL_IMPACT, ResultsFields.BENEFITS];

const getObjectDataAsString = (
  obj: { [key: string]: string },
  requiredFields: string[]
) => {
  let string = "";
  Object.keys(obj).forEach(k => {
    if (obj[k] && requiredFields.includes(k))
      string += string == "" ? `${obj[k]}` : `\n\n${obj[k]}`;
  });
  return string;
};

const generateSlide = (pres: pptxgen, data: CaseData) => {
  const metricsArray = getMetricsData({ ...data.results });
  pres
    .addSlide({ masterName: TEMPLATE_OPTIONS.title })
    .addText(data.situation?.headline, OPTIONS.Headline)
    .addShape(pres.ShapeType.rect, OPTIONS.Statistics)
    .addText(metricsArray[0]?.title, { ...OPTIONS.StatTitle, y: 1.2 })
    .addText(metricsArray[0]?.description ?? "", {
      ...OPTIONS.StatDescription,
      y: 1.23
    })
    .addImage(OPTIONS.Icon)
    .addText(metricsArray[1]?.title, { ...OPTIONS.StatTitle, y: 1.6 })
    .addText(metricsArray[1]?.description ?? "", {
      ...OPTIONS.StatDescription,
      y: 1.63
    })
    .addText("SITUATION", { shape: pres.ShapeType.rect, ...OPTIONS.Situation })
    .addText("APPROACH", { shape: pres.ShapeType.rect, ...OPTIONS.Approach })
    .addText(
      getObjectDataAsString(data.results, RESULTS_FIELDS),
      OPTIONS.Outcome
    )
    .addText(getObjectDataAsString(data.situation, SITUATION_FIELDS), {
      ...OPTIONS.Text,
      x: 0.5
    })
    .addText(getObjectDataAsString(data.approach, APPROACH_FIELDS), {
      ...OPTIONS.Text,
      x: 5.1
    });
};

export const generatePpt = (data: CaseData[]) => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_4x3";
  pres.defineSlideMaster(TEMPLATE_OPTIONS);
  data.forEach((aCase: CaseData) => {
    generateSlide(pres, aCase);
  });
  return pres;
};
