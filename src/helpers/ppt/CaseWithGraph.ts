import pptxgen from "pptxgenjs";

import { SituationFields } from "@/constants/situationFields";
import { ApproachFields } from "@/constants/approachFields";
import { ResultsFields } from "@/constants/resultsFields";
import getMetricsData from "@/helpers/getMetricsData";
import { CaseData, TEMPLATE_OPTIONS } from "../generatePpt";

const { AlignV, AlignH } = new pptxgen();

export const Colors = {
  Statistics: "#ECECEE",
  Footer: "#383838",
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
  Statistics: {
    fill: { color: Colors.Statistics },
    color: Colors.Black,
    x: 0,
    y: 1,
    w: "100%",
    h: 0.8,
    align: AlignH.left
  },
  Narrative: {
    x: 0.5,
    y: 1.8,
    w: "33%",
    h: 1.4,
    fontFace: "Verdana",
    fontSize: 10,
    valign: AlignV.top,
    align: AlignH.left
  },
  DetailedApproach: {
    x: 0.5,
    y: 2.6,
    fontFace: "Verdana",
    w: "33%",
    bullet: true,
    h: 1.4,
    fontSize: 10,
    valign: AlignV.top,
    align: AlignH.left
  },
  Graph: {
    data: "images/png;base64,",
    x: 4,
    y: 1.9,
    h: 4,
    w: 5.5
  },
  Footer: {
    fill: { color: Colors.Footer },
    color: Colors.White,
    x: 0.3,
    fontFace: "Verdana",
    y: 6,
    bold: true,
    w: 9.4,
    h: 0.7,
    fontSize: 12,
    align: AlignH.center
  },
  Text: {
    align: AlignH.left,
    fontSize: 10,
    lineSpacing: 14,
    shrinkText: true,
    fontFace: "Verdana",
    h: 1,
    y: 4.6,
    w: "40%",
    valign: AlignV.top
  }
};

const generateSlide = (pres: pptxgen, data: CaseData) => {
  const withoutQuotesDetails = data.approach[ApproachFields.DETAILS]?.replace(
    /^"|"$/g,
    ""
  );
  const metricsArray = getMetricsData({ ...data.results });
  const slide = pres.addSlide({ masterName: TEMPLATE_OPTIONS.title });
  slide
    .addText(data.situation[SituationFields.HEADLINE], OPTIONS.Headline)
    .addShape(pres.ShapeType.rect, OPTIONS.Statistics)
    .addText(metricsArray[0]?.title, { ...OPTIONS.StatTitle, y: 1.2 })
    .addText(metricsArray[0]?.description ?? "", {
      ...OPTIONS.StatDescription,
      y: 1.23
    })
    .addText(metricsArray[1]?.title, { ...OPTIONS.StatTitle, y: 1.6 })
    .addText(metricsArray[1]?.description ?? "", {
      ...OPTIONS.StatDescription,
      y: 1.63
    })
    .addText(data.approach[ApproachFields.NARRATIVE], OPTIONS.Narrative)
    .addText(
      withoutQuotesDetails?.split(".").join("\n"),
      OPTIONS.DetailedApproach
    )
    .addText(data.results[ResultsFields.OVERALL_IMPACT], {
      shape: pres.ShapeType.rect,
      ...OPTIONS.Footer
    });
  if (data.attachment)
    slide.addImage({
      ...OPTIONS.Graph,
      data: OPTIONS.Graph.data + data.attachment
    });
  else
    slide.addText("No attachment provided", {
      x: OPTIONS.Graph.x,
      y: OPTIONS.Graph.y,
      h: OPTIONS.Graph.h,
      w: OPTIONS.Graph.w,
      align: AlignH.center,
      bold: true
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
