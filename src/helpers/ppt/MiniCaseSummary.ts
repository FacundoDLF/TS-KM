import pptxgen from "pptxgenjs";

import { SituationFields } from "@/constants/situationFields";
import { ApproachFields } from "@/constants/approachFields";
import { ResultsFields } from "@/constants/resultsFields";
import { CaseData, TEMPLATE_OPTIONS } from "../generatePpt";
import { Industry, Offering } from "@/types";

const { AlignV, AlignH } = new pptxgen();

export const Colors = {
  Summary: "#595959",
  SummaryFooter: "#DCDCDC",
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
  Summary: {
    fill: { color: Colors.Summary },
    color: Colors.White,
    x: 0.5,
    y: 1,
    w: 2,
    h: 0.4,
    fontFace: "Verdana",
    fontSize: 11,
    align: AlignH.center
  },
  SummaryFooter: {
    fill: { color: Colors.SummaryFooter },
    color: Colors.Black,
    x: 0.5,
    y: 2.3,
    w: 2,
    h: 0.42,
    bold: true,
    fontSize: 11,
    align: AlignH.center
  },
  Bullets: {
    align: AlignH.left,
    bullet: true,
    fontFace: "Verdana",
    fontSize: 10,
    lineSpacing: 11,
    y: 1,
    x: 2.6,
    w: 7.3,
    valign: AlignV.top
  },
  SummaryText: {
    align: AlignH.center,
    fontSize: 10,
    fontFace: "Verdana",
    lineSpacing: 14,
    x: 0.5,
    h: 0.8,
    y: 1.5,
    w: 2,
    valign: AlignV.top
  }
};

const addSummaries = (
  pres: pptxgen,
  slide: pptxgen.Slide,
  cases: CaseData[]
) => {
  cases.forEach((aCase: CaseData, i: number) => {
    const { Summary, SummaryText, SummaryFooter, Bullets } = OPTIONS;
    const startingY = (Summary.h + SummaryText.h + SummaryFooter.h + 0.2) * i;
    slide
      .addText(aCase.countries[0].name, {
        ...Summary,
        y: Summary.y + startingY,
        shape: pres.ShapeType.rect
      })
      .addText(
        `${(aCase.industries as Industry[])
          .map((i: Industry) => i.name)
          .join(", ")}\nRevenue: ${aCase.revenue || "Not specified"}`,
        {
          ...SummaryText,
          y: SummaryText.y + startingY
        }
      )
      .addText(aCase.offerings.map((o: Offering) => o.name).join(", "), {
        ...SummaryFooter,
        y: SummaryFooter.y + startingY,
        shape: pres.ShapeType.rect
      })
      .addText(
        `${aCase.situation[SituationFields.HEADLINE] || ""}\n${aCase.situation[
          SituationFields.DESCRIPTION
        ] || ""}\n${aCase.approach[ApproachFields.NARRATIVE] || ""}\n${aCase
          .results[ResultsFields.OVERALL_IMPACT] || ""}`,
        {
          ...Bullets,
          y: Bullets.y + startingY
        }
      );
  });
};

const generateSlide = (pres: pptxgen, actualCases: CaseData[]) => {
  const slide = pres.addSlide({ masterName: TEMPLATE_OPTIONS.title });
  slide.addText("Case Summary - Multi Case", OPTIONS.Headline);
  addSummaries(pres, slide, actualCases);
};

export const generatePpt = (cases: CaseData[]) => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_4x3";
  pres.defineSlideMaster(TEMPLATE_OPTIONS);
  const casesChunk = 3; //3 is the number of cases per slide
  for (let i = 0; i < cases.length; i += casesChunk) {
    const actualCases = cases.slice(i, i + casesChunk);
    generateSlide(pres, actualCases);
  }
  return pres;
};
