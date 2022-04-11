import pptxgen from "pptxgenjs";
import _ from "lodash";

import QuestionsData from "@/data/QuestionsData";
import { ResultsFields } from "@/constants/resultsFields";
import { CaseData, TEMPLATE_OPTIONS } from "../generatePpt";

const { AlignV, AlignH } = new pptxgen();

interface ParsedMetric {
  title: string;
  description?: string;
}

interface RawMetric {
  endDateValue: number;
  startDateValue: number;
}

interface RawMetrics {
  [key: string]: RawMetric;
}

export const Colors = {
  ClientData: "#FFFF00",
  Impact: "#383838",
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
  NoMetrics: {
    y: 3.5,
    w: "100%",
    bold: true,
    h: 0.8,
    fontSize: 24,
    align: AlignH.center
  },
  Impact: {
    fill: { color: Colors.Impact },
    color: Colors.White,
    x: 0.3,
    y: 1,
    w: 9.4,
    h: 0.8,
    fontSize: 16,
    align: AlignH.left
  },
  ImpactText: {
    color: Colors.White,
    x: 0.9,
    y: 1,
    w: 8.5,
    h: 0.8,
    fontSize: 16,
    align: AlignH.left
  },
  Metrics: {
    titleX: 0.5,
    titleY: 1.8,
    bodyX: 0.5,
    bodyY: 2.3,
    w: 3,
    h: 1.5,
    fontFace: "Verdana",
    fontSize: 14,
    align: AlignH.center,
    valign: AlignV.middle
  },
  Triangles: {
    Black: {
      x: 0.125,
      y: 1.2,
      w: 0.75,
      h: 0.4,
      fill: {
        color: "#565656"
      },
      rotate: 90
    },
    Green: {
      x: 0.31,
      y: 1.25,
      w: 0.56,
      h: 0.3,
      fill: {
        color: "#5CB335"
      },
      rotate: 90
    }
  }
};

const FinancialMetrics = [
  ResultsFields.REVENUE,
  ResultsFields.COST_GOODS_SOLD,
  ResultsFields.GOODS_PROFIT,
  ResultsFields.SELLING_GENERAL_ADMINISTRATIVE,
  ResultsFields.EBITDA,
  ResultsFields.CASH_INVESTMENTS,
  ResultsFields.ACCOUNTS_RECEIVABLE,
  ResultsFields.INVENTORY,
  ResultsFields.ACCOUNTS_PAYABLE,
  ResultsFields.TOTAL_DEBT
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isOperationalMetric = (obj: Record<string, any>): obj is RawMetric => {
  return (
    Object.prototype.toString.call(obj) == "[object Object]" &&
    "endDateValue" in obj
  );
};

const getMetricDelta = (startValue: number, endValue: number): string => {
  if (!startValue || !endValue) return "No data";
  const delta = ((endValue - startValue) / startValue) * 100;
  return (delta > 0 ? "+" : "") + (delta === 0 ? 0 : Math.round(delta)) + "%";
};

const getMetricsData = (selectedMetrics: RawMetrics): ParsedMetric[] => {
  const metrics: ParsedMetric[] = [];
  Object.keys(selectedMetrics).forEach((metricId: string) => {
    const question = QuestionsData.find(q => q.id == metricId);
    const metric = selectedMetrics[metricId];
    const metricTitle = getMetricDelta(
      metric.startDateValue,
      metric.endDateValue
    );
    if (metricTitle !== "No data")
      metrics.push({
        title: metricTitle,
        description: question?.title || metricId
      });
  });
  return metrics;
};

const addMetricsToSlide = (
  slide: pptxgen.Slide,
  metricsData: ParsedMetric[]
) => {
  metricsData.forEach((metric: ParsedMetric, i: number) => {
    const { bodyX, bodyY, titleX, titleY, w, h } = OPTIONS.Metrics;
    slide.addText(metric.title, {
      ...OPTIONS.Metrics,
      fontSize: 35,
      bold: true,
      x: titleX + (i % 3) * w, //3 is the quantity of metrics per row
      y: titleY + Math.floor(i / 3) * h //3 is the quantity of metrics per row
    });
    slide.addText(metric.description ?? "", {
      ...OPTIONS.Metrics,
      fontSize: 14,
      x: bodyX + (i % 3) * w, //3 is the quantity of metrics per row
      y: bodyY + Math.floor(i / 3) * h //3 is the quantity of metrics per row
    });
  });
};

const generateSlide = (
  pres: pptxgen,
  data: CaseData,
  actualMetrics: RawMetrics
) => {
  const slide = pres.addSlide({ masterName: TEMPLATE_OPTIONS.title });
  slide
    .addText(data.situation?.headline, OPTIONS.Headline)
    .addShape(pres.ShapeType.rect, OPTIONS.Impact)
    .addShape(pres.ShapeType.triangle, OPTIONS.Triangles.Green)
    .addShape(pres.ShapeType.triangle, OPTIONS.Triangles.Black)
    .addText(data.results[ResultsFields.OVERALL_IMPACT], OPTIONS.ImpactText);
  addMetricsToSlide(slide, getMetricsData(actualMetrics));
};

const generateNoMetricsSlide = (pres: pptxgen, data: CaseData) => {
  const slide = pres.addSlide({ masterName: TEMPLATE_OPTIONS.title });
  slide
    .addText(data.situation?.headline, OPTIONS.Headline)
    .addShape(pres.ShapeType.rect, OPTIONS.Impact)
    .addText(data.results[ResultsFields.OVERALL_IMPACT], OPTIONS.ImpactText)
    .addText("No metrics provided", OPTIONS.NoMetrics);
};

export const generatePpt = (data: CaseData) => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_4x3";
  pres.defineSlideMaster(TEMPLATE_OPTIONS);
  const metricsChunk = 9; //9 is the number of metrics per slide
  const resultsData = {
    ...data.results
  };
  const financialMetrics = Object.keys(resultsData).filter(key =>
    FinancialMetrics.includes(key as ResultsFields)
  );
  const operationalMetrics = Object.keys(resultsData).filter(
    key =>
      !FinancialMetrics.includes(key as ResultsFields) &&
      isOperationalMetric(resultsData[key])
  );
  const metricsData: RawMetrics = {};
  [...financialMetrics, ...operationalMetrics].forEach(key => {
    metricsData[key] = resultsData[key];
  });
  const rawMetricsKeys = Object.keys(metricsData);
  const metricsKeys = rawMetricsKeys.filter(
    key => metricsData[key].endDateValue && metricsData[key].startDateValue
  );
  if (!metricsKeys.length) generateNoMetricsSlide(pres, data);
  else {
    for (let i = 0; i < metricsKeys.length; i += metricsChunk) {
      const actualKeys = metricsKeys.slice(i, i + metricsChunk);
      generateSlide(pres, data, _.pick(metricsData, actualKeys));
    }
  }
  return pres;
};
