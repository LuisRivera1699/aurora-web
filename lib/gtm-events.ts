type WindowWithDataLayer = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

function pushDataLayerEvent(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  const windowWithDataLayer = window as WindowWithDataLayer;
  windowWithDataLayer.dataLayer = windowWithDataLayer.dataLayer ?? [];
  windowWithDataLayer.dataLayer.push(payload);
}

export function pushClickCtaEvent(location: string) {
  pushDataLayerEvent({
    event: "click_cta",
    location,
  });
}
