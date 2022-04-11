import pptxgen from "pptxgenjs";

import { SituationFields } from "@/constants/situationFields";
import { ApproachFields } from "@/constants/approachFields";
import { ResultsFields } from "@/constants/resultsFields";
import { CaseData, TEMPLATE_OPTIONS } from "../generatePpt";
import { Industry } from "@/types";

const COLUMN_WIDTH = 3;

const { AlignV, AlignH } = new pptxgen();

export const Colors = {
  ClientData: "#FFFF00",
  Approach: "#006176",
  Situation: "#032E45",
  Outcome: "#0696A6",
  Footer: "#383838",
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
  Situation: {
    fill: { color: Colors.Situation },
    color: Colors.White,
    x: 0.3,
    fontFace: "Verdana",
    y: 1,
    w: COLUMN_WIDTH,
    h: 0.4,
    fontSize: 12,
    align: AlignH.center
  },
  Approach: {
    fill: { color: Colors.Approach },
    color: Colors.White,
    x: 3.5,
    y: 1,
    w: COLUMN_WIDTH,
    fontFace: "Verdana",
    h: 0.4,
    fontSize: 12,
    align: AlignH.center
  },
  Outcome: {
    fill: { color: Colors.Outcome },
    color: Colors.White,
    x: 6.7,
    y: 1,
    fontFace: "Verdana",
    w: COLUMN_WIDTH,
    h: 0.4,
    fontSize: 12,
    align: AlignH.center
  },
  Footer: {
    fill: { color: Colors.Footer },
    color: Colors.White,
    x: 0.3,
    y: 6,
    w: 9.4,
    fontFace: "Verdana",
    h: 0.7,
    fontSize: 14,
    align: AlignH.center
  },
  Text: {
    align: AlignH.left,
    fontFace: "Verdana",
    fontSize: 10,
    lineSpacing: 14,
    h: 4.5,
    y: 1.45,
    w: COLUMN_WIDTH,
    valign: AlignV.top
  },
  ClientData: {
    fill: { color: Colors.ClientData },
    color: Colors.Black,
    x: 10.1,
    y: 0,
    w: 4,
    h: 2,
    bold: true,
    fontFace: "Verdana",
    fontSize: 10,
    lineSpacing: 16,
    align: AlignH.left,
    valign: AlignV.top,
    margin: 2
  }
};

const SITUATION_FIELDS = [
  SituationFields.CHALLENGES,
  SituationFields.DESCRIPTION,
  SituationFields.HIRED_TO
];

const APPROACH_FIELDS = [ApproachFields.DETAILS, ApproachFields.NARRATIVE];

const RESULTS_FIELDS = [
  ResultsFields.OVERALL_IMPACT,
  ResultsFields.BENEFITS,
  ResultsFields.CULTURE_SHIFT
];

const formatDate = (aDate: string) => {
  const date = new Date(aDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${month <= 9 ? "0" + month : month}/${year}`;
};

const getClientData = (aCase: CaseData) => {
  return `
    Client: ${aCase.client?.name || "Default client"} 
    Project name: ${aCase?.projectName}
    Date completed: ${formatDate(aCase?.endDate)},
    Industry: ${(aCase.industries as Industry[])?.map(i => i.name).join(", ")}
    Community: ${aCase.communities?.map(c => c.name).join(", ")}
  `;
};

const getObjectDataAsString = (
  obj: { [key: string]: string },
  requiredFields: string[]
) => {
  let string = "";
  Object.keys(obj).forEach(k => {
    if (obj[k] && requiredFields.includes(k))
      string += string == "" ? `${obj[k]}` : ` ${obj[k]}`;
  });
  return string;
};

const formatText = (text: string) => {
  const textAsArray = text.split("/n");
  if (textAsArray.length == 1) return text;
  textAsArray.pop();
  return textAsArray.join(" ");
};

const generateSlide = (pres: pptxgen, data: CaseData) => {
  const slide = pres.addSlide({ masterName: TEMPLATE_OPTIONS.title });
  const situation = formatText(
    getObjectDataAsString(data.situation, SITUATION_FIELDS)
  );
  const approach = formatText(
    getObjectDataAsString(data.approach, APPROACH_FIELDS)
  );
  const results = formatText(
    getObjectDataAsString(data.results, RESULTS_FIELDS)
  );
  slide
    .addText(getClientData(data), {
      shape: pres.ShapeType.rect,
      ...OPTIONS.ClientData
    })
    .addText(data.situation?.headline, OPTIONS.Headline)
    .addText("Situation", {
      shape: pres.ShapeType.rect,
      ...OPTIONS.Situation
    })
    .addText(situation, {
      ...OPTIONS.Text,
      x: 0.3
    })
    .addText("Approach", {
      shape: pres.ShapeType.rect,
      ...OPTIONS.Approach
    })
    .addText(approach, {
      ...OPTIONS.Text,
      x: 3.5
    })
    .addText("Outcome", { shape: pres.ShapeType.rect, ...OPTIONS.Outcome })
    .addText(results, {
      ...OPTIONS.Text,
      x: 6.7
    });
  if (data.results?.clientQuote)
    slide.addText(data.results?.clientQuote, {
      shape: pres.ShapeType.rect,
      ...OPTIONS.Footer
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
