export function formatLocation(
  stringList: string[],
  separator: string = " "
): string {
  const location = stringList
    .filter((part) => part?.trim().length)
    .join(separator);
  return location;
}

export function maskPhoneNumber(phoneNumber?: string): string {
  return phoneNumber
    ? phoneNumber.replace(/(\d{3})\d{4}(\d+)/, "$1****$2")
    : "";
}

export function debounce(fn, delay) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

export function getRemainingMilliseconds(start?: string, end?: string): number {
  // 检查是否提供了开始和结束时间
  if (!start || !end) {
    console.error("Start or end time is missing.");
    return 0;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  // 检查日期是否有效
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error("Invalid start or end time.");
    return 0;
  }

  // 如果当前时间在给定的开始和结束时间之间，则返回剩余的毫秒数，否则返回0。
  const now = new Date();
  if (now < startDate) return endDate.getTime() - startDate.getTime();
  if (now > endDate) return 0;

  return endDate.getTime() - now.getTime();
}
