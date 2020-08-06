/**
 * 公共方法
 */
import Vue from 'vue';

const appCommonH = {};
appCommonH.isWeixin = () => {
  const u = navigator.userAgent.toLowerCase();
  const isAndroid = u.indexOf('android') > -1 || u.indexOf('adr') > -1;
  const isiOS = !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/);
  const isPhone = isAndroid || isiOS;
  const isWeixin = u.indexOf('micromessenger') !== -1;
  const isPc = !u.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
  );
  // if(isWeixin == true){
  //   alert('weixin');
  // } else if(isAndroid == true || isiOS == true){
  //   alert('isAndroid');
  // } else {
  //   alert('isPc');
  // }
  return {
    isWeixin,
    isPhone,
    isPc,
  };
};
if (!Vue.prototype.appCommonH) {
  Vue.prototype.appCommonH = appCommonH;
}

export default appCommonH;
