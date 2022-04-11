import _ from "lodash";
import { SelectedCase } from "@/types";

import { CaseData } from "./generatePpt";

import { ResultsFields } from "@/constants/resultsFields";
import { SituationFields } from "@/constants/situationFields";
import { ApproachFields } from "@/constants/approachFields";
import { MetricsFields } from "@/constants/metricsFields";

const getCaseData = (aCase: SelectedCase): CaseData => ({
  situation: _.pick(aCase, Object.values(SituationFields)),
  approach: _.pick(aCase, Object.values(ApproachFields)),
  results: {
    ..._.pick(aCase, Object.values(ResultsFields)),
    ..._.pick(aCase, Object.values(MetricsFields))
  },
  client: aCase.client,
  revenue: aCase.estimatedRevenue,
  offerings: aCase.offerings,
  countries: aCase.countries,
  industries: aCase.industries,
  attachment: aCase.attachment,
  endDate: aCase.endDate,
  communities: aCase.communities,
  projectName: aCase.projectName
});

export default getCaseData;
