import QuestionsData from "@/data/QuestionsData";

const getMetricTitle = (metric: number, label: string): string => {
  if (!metric && metric != 0) return "";
  if (label == "USD Millions") return `$${metric}M`;
  else if (label == "") return metric?.toString();
  else return `${metric}%`;
};

const getMetricsData = (metrics: { [key: string]: number }) => {
  const metricsData: { title: string; description?: string }[] = [];
  Object.keys(metrics).forEach((metricId: string) => {
    if (metricId.includes("metrics")) {
      const question = QuestionsData.find(q => q.id == metricId);
      if (metrics[metricId] != null && metrics[metricId] != 0)
        metricsData.push({
          title: getMetricTitle(metrics[metricId], question?.label || ""),
          description: question?.title
        });
    }
  });
  return metricsData;
};

export default getMetricsData;
