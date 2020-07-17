/**
 * 生成随机字符串
 * @param {*} len 生成的字符串长度
 */
export const getRandomChars = len => {
  const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array(len)
    .join()
    .split(',')
    .map(() => {
      return s.charAt(Math.floor(Math.random() * s.length));
    })
    .join('');
};
