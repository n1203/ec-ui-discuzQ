import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { COOKIE_CURRENT_LANGUAGE } from '@/common/const';
import enLocale from './lang/en';
import zhLocale from './lang/zh';

Vue.use(VueI18n);

// 国际化文档 http://kazupon.github.io/vue-i18n/zh/guide/formatting.html
const messages = {
  en: {
    ...enLocale,
  },
  zh: {
    ...zhLocale,
  },
};

// 当前用户选择过的语言
const currentLang = uni.getStorageSync(COOKIE_CURRENT_LANGUAGE);
// 默认语言为中文
const defaultLang = 'zh';
export const i18n = new VueI18n({
  locale: currentLang || defaultLang,
  messages,
});

/**
 * 获取当前使用的语言包
 */
export const currentLocale = () => {
  return i18n.messages[i18n.locale];
};

/**
 * 设置当前要使用的语言
 * @param {string} lang 要设置的语言，暂时只有 en 和 zh 两种语言，可以根据产品规划的时候再添加
 *  en: 英文
 *  zh: 中文
 * @return {object} 当前使用的语言包
 */
export const localeUse = lang => {
  if (!lang) return;
  // 设置语言
  i18n.locale = lang;
  uni.setStorageSync(COOKIE_CURRENT_LANGUAGE, lang);
  return currentLocale();
};
