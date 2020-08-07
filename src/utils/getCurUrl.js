/**
 * 获取当前页面路由
 * @return 获取当前页面路由
 *
 * example:
 * getCurUrl()
 */
export const getCurUrl = () => {
  const routes = getCurrentPages(); // 获取当前打开过的页面路由数组
  const curRoute = routes[routes.length - 1].route; // 获取当前页面路由
  const curParam = routes[routes.length - 1].options; // 获取路由参数 // 拼接参数
  let param = '';
  Object.keys(curParam).forEach(key => {
    param = `${param}&${key}=${curParam[key]}`;
  });
  if (param.length > 0) {
    param = `?${param.substr(1)}`;
  }
  const url = `/${curRoute}${param}`;
  return url;
};
