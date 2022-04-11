import { ApplicationInsights } from "@microsoft/applicationinsights-web";

export enum InsightEvent {
  previewPpt = "preview_ppt",
  clientInfo = "client_info",
  searchFilterUsed = "search_filter_used",
  clickAdvancedOptions = "click_advanced_options",
  exportPpt = "export_ppt",
  addTextExample = "add_text_example"
}

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: process.env.VUE_APP_APPINSIGHTS_INSTRUMENTATIONKEY,
    enableDebug: true,
    autoTrackPageVisitTime: true
  }
});

appInsights.loadAppInsights();
appInsights.trackPageView();

export const emitInsightEvent = (
  eventName: string,
  properties?: { [key: string]: string }
) => {
  appInsights.trackEvent({ name: eventName, properties });
};

export default appInsights;
