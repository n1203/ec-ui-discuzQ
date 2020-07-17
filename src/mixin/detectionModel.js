module.exports = {
  methods: {
    detectionModel() {
      const modelmes = uni.getSystemInfoSync().model;
      let tempMoble = false;
      if (!modelmes) return tempMoble;
      const bangsList = [
        'iPhone X',
        'iPhone XR',
        'iPhone XS',
        'iPhone 12',
        'iPhone 11',
        'iPhone11',
        'iPhone12',
        'iPhoneXR',
        'iPhoneX',
      ];
      const len = bangsList.length;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < len; i++) {
        if (modelmes.indexOf(bangsList[i]) !== -1) {
          tempMoble = true;
          break;
        }
      }
      return tempMoble;
    },
  },
};
