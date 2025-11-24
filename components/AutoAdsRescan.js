// This component previously triggered Google AdSense re-scans after route changes
// in our single-page application.  Because the site no longer uses AdSense and
// is migrating to Mediavine, the component returns null.  We keep the file and
// export so that existing imports do not break.
export default function AutoAdsRescan() {
  return null;
}
