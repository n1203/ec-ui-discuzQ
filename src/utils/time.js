/**
 * 计算指定时间到当前时间的时间间隔
 * @param {*} time 指定时间
 * @return 时间间隔或年月日时分
 *
 * example:
 * time2MinuteOrHour('2020-04-25T13:42:00.000Z')
 */
export const time2MinuteOrHour = time => {
  const now = new Date();
  const pass = new Date(time);
  const result = now - pass;
  // 分钟差小于60分钟
  if (parseInt(parseInt(result / 1000, 0) / 60, 0) < 60) {
    return `${Math.ceil(result / 1000 / 60)}分钟前`;
  }
  // 小时差小于16小时
  if (parseInt(parseInt(parseInt(result / 1000, 0) / 60, 0) / 60, 0) < 16) {
    return `${Math.ceil(result / 1000 / 60 / 60)}小时前`;
  }
  // 超过16个小时展示 年月日时分
  return time
    .replace(/T/, ' ')
    .replace(/Z/, '')
    .substring(0, 16);
};

/**
 * 时间转换为年月日时分
 * @param {*} originTime 原始时间
 * @return 年月日 时分
 *
 * example:
 * time2DateAndHM('2020-04-25T11:54:17+08:00')
 */
export const time2DateAndHM = originTime => {
  const time = originTime.replace(/T/, ' ').replace(/Z/, '');
  return `${time.substring(0, 10)} ${time.substring(11, 16)}`;
};

/**
 * 有效期（时间戳减去当前时间戳再转换为天）
 * @param {*} timestamp 时间戳
 * @return 天
 *
 * example:
 * timestamp2day(1589785128)
 */
export const timestamp2day = timestamp => {
  const interval = timestamp - Math.round(new Date() / 1000);
  return parseInt(interval / (60 * 60 * 24), 0);
};
