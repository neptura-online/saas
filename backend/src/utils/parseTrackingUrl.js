export const parseTrackingUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    const params = parsedUrl.searchParams;

    return {
      utm_source: params.get("utm_source") || "direct",
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      utm_term: params.get("utm_term"),
      utm_content: params.get("utm_content"),
      gclid: params.get("gclid"),
      adgroupid: params.get("adgroupid"),
    };
  } catch (err) {
    return {};
  }
};
