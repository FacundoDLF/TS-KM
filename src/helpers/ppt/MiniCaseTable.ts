import pptxgen from "pptxgenjs";

import { SituationFields } from "@/constants/situationFields";
import { ResultsFields } from "@/constants/resultsFields";
import { CaseData, TEMPLATE_OPTIONS } from "../generatePpt";

const COLUMN_WIDTH = 2.9;

const { AlignV, AlignH } = new pptxgen();

export const Colors = {
  Headers: "#006176",
  Line: "#5CB335",
  White: "#FFFFFF",
  Black: "#000000",
  Grey: "#DEDEDE"
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
  Text: {
    align: AlignH.left,
    fontSize: 12,
    lineSpacing: 14,
    h: 4.5,
    y: 1.5,
    w: COLUMN_WIDTH,
    valign: AlignV.top
  }
};

const TableHeaders: pptxgen.TableRow = [
  {
    text: "Client",
    options: {
      align: "center",
      fontSize: 14,
      color: Colors.White,
      fill: { color: Colors.Headers }
    }
  },
  {
    text: "Project Background",
    options: {
      align: "center",
      fontSize: 14,
      color: Colors.White,
      fill: { color: Colors.Headers }
    }
  },
  {
    text: "Overall Impact",
    options: {
      align: "center",
      fontSize: 14,
      color: Colors.White,
      fill: { color: Colors.Headers }
    }
  }
];

const TableOptions: pptxgen.TableProps = {
  colW: [1, 4, 4],
  rowH: [0.3, 1, 1, 1],
  y: 1,
  h: 4,
  align: "left",
  fontFace: "Verdana",
  fontSize: 10,
  autoPage: true,
  autoPageRepeatHeader: true,
  newSlideStartY: 1,
  border: [
    { color: Colors.White },
    { color: Colors.White },
    { pt: 1, color: Colors.Grey },
    { color: Colors.White }
  ]
};

const generateTable = (cases: CaseData[]): pptxgen.TableRow[] => {
  const tableRows: pptxgen.TableRow[] = [];
  tableRows.push(TableHeaders);
  for (const aCase of cases)
    tableRows.push([
      {
        text: `${aCase.client.name}`
      },
      {
        text: `${aCase.situation[SituationFields.CHALLENGES]}\n${
          aCase.situation[SituationFields.HIRED_TO]
        }`,
        options: { bullet: true }
      },
      {
        text: [
          {
            text: `${aCase.situation[SituationFields.HEADLINE]}`,
            options: { bold: true, fontSize: 9 }
          },
          {
            text: aCase.results[ResultsFields.OVERALL_IMPACT]
          },
          {
            text: `${aCase.results[ResultsFields.BENEFITS]}`,
            options: { bullet: true }
          }
        ]
      }
    ]);
  return tableRows;
};

const generateSlide = (pres: pptxgen, actualCases: CaseData[]) => {
  const slide = pres.addSlide({ masterName: TEMPLATE_OPTIONS.title });
  slide
    .addText(actualCases[0].situation?.headline, OPTIONS.Headline)
    .addTable(generateTable(actualCases), TableOptions);
};

export const generatePpt = (cases: CaseData[]) => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_4x3";
  pres.defineSlideMaster(TEMPLATE_OPTIONS);
  const casesChunk = 2; //2 is the number of cases per slide
  for (let i = 0; i < cases.length; i += casesChunk) {
    const actualCases = cases.slice(i, i + casesChunk);
    generateSlide(pres, actualCases);
  }
  return pres;
};
