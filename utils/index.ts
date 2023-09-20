export function utcToCron(utcTime: string) {
  const date = new Date(utcTime);
  const minutes = date.getUTCMinutes();
  const hours = date.getUTCHours();
  const dayOfMonth = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const dayOfWeek = date.getUTCDay();

  return `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
}
