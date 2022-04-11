import pptxgen from "pptxgenjs";

import { ResultsFields } from "@/constants/resultsFields";
import { SituationFields } from "@/constants/situationFields";
import { CaseData, TEMPLATE_OPTIONS } from "../generatePpt";

const { AlignV, AlignH } = new pptxgen();

export const Colors = {
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
  Quote: {
    align: AlignH.left,
    fontSize: 18,
    fontFace: "Verdana",
    bold: true,
    lineSpacing: 14,
    x: 0.5,
    h: 1.5,
    y: 1.5,
    w: 4,
    valign: AlignV.top
  },
  QuoteInfo: {
    align: AlignH.left,
    fontSize: 11,
    fontFace: "Verdana",
    lineSpacing: 14,
    x: 0.5,
    h: 0.5,
    y: 3.1,
    w: 4,
    valign: AlignV.top
  }
};

const addQuotes = (pres: pptxgen, slide: pptxgen.Slide, cases: CaseData[]) => {
  cases.forEach((aCase: CaseData, i: number) => {
    const { Quote, QuoteInfo } = OPTIONS;
    const startingY =
      Math.floor(i / 2) * (QuoteInfo.h + Quote.h) + (i < 2 ? 0 : 1);
    const startingX = (i % 2) * QuoteInfo.w + (i % 2 == 0 ? 0 : 1);
    slide
      .addText(
        aCase.results[ResultsFields.CLIENT_QUOTE] || "No client quote provided",
        {
          ...Quote,
          x: Quote.x + startingX,
          y: Quote.y + startingY
        }
      )
      .addText(`- ${aCase.client?.name}`, {
        ...QuoteInfo,
        x: QuoteInfo.x + startingX,
        y: QuoteInfo.y + startingY
      });
  });
};

const generateSlide = (pres: pptxgen, actualCases: CaseData[]) => {
  const slide = pres.addSlide({ masterName: TEMPLATE_OPTIONS.title });
  slide.addText(
    actualCases[0].situation[SituationFields.HEADLINE],
    OPTIONS.Headline
  );
  addQuotes(pres, slide, actualCases);
};

export const generatePpt = (cases: CaseData[]) => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_4x3";
  pres.defineSlideMaster(TEMPLATE_OPTIONS);
  const casesChunk = 4;
  for (let i = 0; i < cases.length; i += casesChunk) {
    const actualCases = cases.slice(i, i + casesChunk);
    generateSlide(pres, actualCases);
  }
  return pres;
};
