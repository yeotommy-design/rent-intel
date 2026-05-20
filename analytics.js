(() => {
  const measurementId = "G-SCWQR3VX4D";

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }

  window.gtag = window.gtag || gtag;
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    page_title: document.title,
    page_path: window.location.pathname
  });

  window.rentIntelTrack = (eventName, params = {}) => {
    if (!eventName || typeof window.gtag !== "function") return;
    window.gtag("event", eventName, {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      ...params
    });
  };
})();
