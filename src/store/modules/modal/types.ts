export const ACTIONS_TYPES = {
  OPEN_MODAL: "OPEN_MODAL",
  CLOSE_MODAL: "CLOSE_MODAL"
};

export const MUTATIONS_TYPES = {
  SET_MODAL_CONTENT: "SET_MODAL_CONTENT",
  SET_MODAL_VISIBILITY: "SET_MODAL_VISIBILITY",
  SET_MODAL_COMPONENT_PROPS: "SET_MODAL_COMPONENT_PROPS"
};

export enum ModalComponents {
  LOCAL_SESSION_EXPIRED = "LocalSessionExpired",
  PERMISSION_ERROR = "PermissionError",
  SUBMIT_SUCCESS = "SubmitSuccess",
  STARTER_TEXT_CONFIRMATION = "AddStarterTextConfirmation",
  REVIEWER_ERROR = "ApproveErrorModal",
  AUTHOR_SELECTION = "AuthorSelectionModal",
  EXPORT_SELECTION = "ExportSelection",
  PREVIEW_PPT = "PptPreview",
  WARNING = "Warning",
  ERROR_MODAL = "ErrorModal",
  FINANCIAL_METRIC = "FinancialMetric",
  RPM_METRIC = "RpmMetric"
}
