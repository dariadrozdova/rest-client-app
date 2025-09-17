import { MS_IN_DAY, MS_IN_HOUR, MS_IN_MINUTE } from "@/shared/globals";

export const getTimeAgo = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();

  const minutes = Math.floor(diffMs / MS_IN_MINUTE);
  const hours = Math.floor(diffMs / MS_IN_HOUR);
  const days = Math.floor(diffMs / MS_IN_DAY);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (minutes > 0) {
    return `${minutes} min ago`;
  }
  return "Just now";
};
