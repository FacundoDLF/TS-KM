import { ToastOptions } from "vue-toasted";
import { SituationFields } from "@/constants/situationFields";
import { ApproachFields } from "@/constants/approachFields";
import { ResultsFields } from "@/constants/resultsFields";
import { MetricsFields } from "@/constants/metricsFields";
import { ClientInfoFields } from "@/constants/clientInfoFields";

export interface PrimaryStepTab {
  title: string;
  id: 0;
  route: string;
  logo: string;
}

export interface Industry {
  industryId: number;
  name: string;
}

export interface BusinessUnit {
  businessUnitId: number;
  name: string;
}

export interface Community {
  communityId: number;
  name: string;
}

export interface Client {
  id: number;
  name: string;
  logo: string;
  description: string;
  shortDescription: string;
  peSponsor: string;
  Revenue: number;
}

export interface User {
  userId: number;
  name: string;
  email: string;
  isBICReviewer: boolean;
  isIndustryLeader: boolean;
  industry: Industry;
  businessUnit: BusinessUnit;
}

export interface StarterTexts {
  [inputKey: string]: string;
}

export interface SearchResult {
  caseId: string;
  projectName: string;
  clientName: string;
  startDate: string;
  industries: { name: string; industryId: number }[];
  communities: { name: string; communityId: number }[];
  countries: { name: string; countryId: number }[];
  services: { name: string; serviceId: number }[];
  score: number;
  status: number;
}

export interface SelectedCase {
  caseId: string;
  client: Client;
  status: number;
  projectDescription: string;
  projectName: string;
  radiusId: string;
  eliteClientCode: string;
  startDate: string;
  endDate: string;
  caseCreationDate: string;
  capIQId: string;
  estimatedRevenue: number;
  isELAllowDiscloseability: boolean;
  isLogoAndNameOk: boolean;
  isLegacy: boolean;
  legacyManagerDirectors?: string;
  legacyTeamMembers?: string;
  durationWeeks: number;
  decisionMakers: string;
  baseline: string;
  addresableSpend: number;
  outcomeSaving: number;
  countries: Country[];
  businessUnits: BusinessUnit[] | BusinessUnit;
  offerings: Offering[];
  services: string[];
  industries: Industry[] | Industry;
  communities: Community[];
  author: User;
  reviewerMD: User;
  reviewerBIC: User;
  starterTexts?: StarterTexts;
  engagementTeam: User[];
  attachment?: string;
  chartLocation?: string;
  metricsOptions: { name: string; key: string }[];
  fasCaseCitation: string;
  fasJurisdiction: string;
  fasRegulatoryAgencies: FasRegulatoryAgency[];
  fasLawFirms: FasLawFirm[];
  fasOpposingLawFirms: FasLawFirm[];
  fasTerms: FasTerm[];
  fasOpposingExpert: string;
  fasOpposingExpertHourlyFee: string;
  fasOpposingExpertReportDate: string;
}

export interface Collections {
  industries: Industry[];
  communities: Community[];
  countries: Country[];
  services: Service[];
  offerings: Offering[];
  segments: Segment[];
  businessUnits: BusinessUnits[];
  fasTerms: FasTerm[];
  fasLawFirms: FasLawFirm[];
  fasRegulatoryAgencies: FasRegulatoryAgency[];
}

export interface FasTerm {
  fasTermId: number;
  name: string;
  fasTermGroup: FasTermGroup;
  otherSpecify: string;
}

export interface FasTermGroup {
  fasTermGroupId: number;
  name: string;
}

export interface FasLawFirm {
  fasLawFirmId: number;
  name: string;
  otherSpecify: string;
  isOpposing: boolean;
}

export interface FasRegulatoryAgency {
  fasRegulatoryAgencyId: number;
  name: string;
  otherSpecify: string;
}

export interface Segment {
  name: string;
  segmentId: number;
  industry: Industry;
}

export interface Segment {
  name: string;
  segmentId: number;
  industry: Industry;
}

export interface Community {
  name: string;
  communityId: number;
}
export interface BusinessUnits {
  name: string;
  businessUnitId: number;
}
export interface Service {
  name: string;
  serviceId: number;
}
export interface Offering {
  name: string;
  offeringId: number;
  service: Service;
}

export interface Country {
  name: string;
  countryId: number;
}
export interface Industry {
  name: string;
  industryId: number;
}

export interface PreCase {
  preCaseId: string;
  teamMembers: User[];
  projectId: string;
  supervisingMDFirstName: string;
  supervisingMDLastName: string;
  supervisingMDEmail: string;
  startDate: string;
  projectStatus: string;
  radiusId: string;
  leadName: string;
  clientName: string;
  projectDescription: string;
  community: string;
  businessUnit: string;
  Industry: string;
  Segment: string;
  Offerings: string;
  Services: string;
  PESponsor: string;
  capIQID: string;
  ELAllowsDiscloseability: string;
  country: string;
  EstimatedBillings: string;
  isPublic: boolean;
  clientRevenue: number;
  IndustryClassification: string;
  BusinessDescription: string;
}
export interface PrecaseRequest {
  precaseId: number;
  caseAuthorName: string;
  caseAuthorEmail: string;
  teamMembers: User[];
}
export interface Notification {
  notificationType: number;
  isRead: boolean;
  caseId: number;
  projectName?: string;
  id: number;
  triggerUser: User;
  targetUser: User;
}

export interface Message extends ToastOptions {
  text: string;
}

export enum QuestionType {
  text = "text",
  radio = "radio",
  select = "select",
  multiselect = "multiselect",
  numeric = "numeric",
  file = "file",
  range = "range"
}

export enum PrimaryStep {
  clientInformation = "clientInformation",
  situation = "situation",
  approach = "approach",
  results = "results",
  errorInStep = "errorInStep"
}

export enum SecondaryStep {
  firstStep = "firstStep",
  secondStep = "secondStep",
  thirdStep = "thirdStep"
}

export enum TransactionNatureOptions {
  revenueIncrease = "Revenue Increase",
  costDecrease = "Cost Decrease",
  debtEliminated = "Debt Eliminated",
  claims = "Value of claims reduced",
  legalJudgment = "Legal judgment won/avoided",
  processImprovement = "Process improvement/efficiency gain",
  synergiesIdentified = "Synergies identified",
  dataAnalyzed = "Data analyzed"
}

export enum SecurityAssistanceOptions {
  financeDept = "Finance/Accounting Dept",
  hrDept = "HR Dept",
  salesDept = "Sales Dept",
  markentingDept = "Marketing Dept",
  operationsDept = "Operations Dept"
}

export enum UserRoles {
  author = "author",
  reviewer = "reviewer"
}

export type Question = {
  id:
    | SituationFields
    | ApproachFields
    | ResultsFields
    | MetricsFields
    | ClientInfoFields
    | string;
  type: QuestionType;
  title: string;
  description?: string;
  isRequired?: boolean;
  answer: string | boolean | string[] | MetricValue;
  error?: string;
  options?: string[];
  label?: string;
  questionParent: PrimaryStep;
  questionStep: SecondaryStep;
  isMetric?: boolean;
  isFinancialMetric?: boolean;
  financialMetricsArea?: MetricsSection;
  created?: boolean;
  lengthLimit?: number;
};

export type Metric = {
  name: string;
  startDateValue: number | null;
  endDateValue: number | null;
  financialMetricsArea?: MetricsSection;
  isFinancialMetric?: boolean;
};

export enum MetricsSection {
  income = "income",
  balance = "balance",
  rpm = "rpm"
}

export interface Step {
  [SecondaryStep.firstStep]: Question[];
  [SecondaryStep.secondStep]: Question[];
  [SecondaryStep.thirdStep]: Question[];
}

export enum CaseStatus {
  opened = 1, // -> assigned (!dirty in progress)
  submitted = 2, // -> Submitted for revision
  approvedByKM = 3, // aproved by LMD =>  It's going to be approvedByKM from now on
  // approvedByKM = 4, // change name => approved by KM & IPL => It's going to be published from now on (MD will be able to publish now, going above KM role in a pyramid herarchy). INdustryLeader role to be deleted
  published = 5
}

export enum MetricOption {
  startDateValue = "startDateValue",
  endDateValue = "endDateValue"
}

export type MetricValue = {
  [key in MetricOption]: number | null;
};
