const KB = 1024;

export function formatBytes(bytes?: number) {
  if (typeof bytes !== "number" || Number.isNaN(bytes)) {
    return "-";
  }
  if (bytes < KB) {
    return `${bytes} B`;
  }
  const kilobytes = bytes / KB;
  if (kilobytes < KB) {
    return `${kilobytes.toFixed(1)} KB`;
  }
  const megabytes = kilobytes / KB;
  return `${megabytes.toFixed(1)} MB`;
}
