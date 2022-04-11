const routeFormatter = (url: string): string => {
  const newUrl =
    url[url.length - 1] === "/" ? url.substring(0, url.length - 1) : url;
  return newUrl.replace(/([^:]\/)\/+/g, "$1");
};

export default routeFormatter;
