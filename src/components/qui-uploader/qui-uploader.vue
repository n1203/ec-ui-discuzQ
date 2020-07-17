<template>
  <view class="qui-uploader-box">
    <block>
      <view
        class="qui-uploader-box__uploader-file"
        v-for="(item, index) in uploadBeforeList"
        :key="index"
      >
        <image
          class="qui-uploader-box__uploader-file--image"
          v-if="uploadBeforeList.length > 0"
          mode="aspectFill"
          :src="item.path"
          @click="previewPicture(index)"
        ></image>
        <view
          class="qui-uploader-box__uploader-file--load"
          v-if="numberdata[index] && numberdata[index].state < 100"
        >
          <view class="qui-uploader-box__uploader-file--load__mask"></view>
          <text class="qui-uploader-box__uploader-file--load__text">
            {{ i18n.t('discuzq.image.imageUploading') }}
          </text>
          <progress
            :percent="item.uploadPercent"
            active
            stroke-width="3"
            activeColor="#25A9F6"
            backgroundColor="#b5b5b5"
          />
        </view>
        <view class="qui-uploader-box__uploader-file__del" v-else @click="uploadDelete(index)">
          <qui-icon class="icon-delete" name="icon-delete" color="#fff" size="17"></qui-icon>
        </view>
      </view>
    </block>
    <view class="qui-uploader-box__add" @click="uploadClick" v-if="uploadBeforeList.length < count">
      <qui-icon name="icon-add" color="#B5B5B5" size="40"></qui-icon>
    </view>
  </view>
</template>

<script>
export default {
  name: 'QuiUploader',
  props: {
    url: {
      default: '',
      type: String,
    },
    header: {
      type: Object,
      default: () => {
        return {};
      },
    },
    type: {
      default: 'image',
      type: String,
    },
    formData: {
      default: Object,
      type: Object,
    },
    name: {
      default: 'file',
      type: String,
    },
    count: {
      default: 9,
      type: [Number, String],
    },
    asyncClear: {
      default: false,
      type: Boolean,
    },
    filePreview: {
      type: Array,
      default: () => {
        return [];
      },
    },
    delayTime: {
      default: 500,
      type: Number,
    },
  },
  data() {
    return {
      uploadBeforeList: [],
      uploadList: [],
      uploadIndex: '',
      formDataAppend: {},
      lastOrder: 0,
      numberdata: [],
      indexs: '',
      erroindex: '',
      number: 0,
      detailindex: [],
      newindex: [],
      cunmumber: 1,
    };
  },
  watch: {
    // 监听得到的数据
    formData: {
      handler(newVal) {
        this.formData = newVal;
        this.uploadStatus = true;
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {
    setTimeout(() => {
      this.uploadBeforeList = this.uploadBeforeList.concat(this.filePreview);
      this.uploadList = this.uploadList.concat(this.filePreview);
      if (this.uploadBeforeList.length > 0) {
        this.uploadBeforeList.map(() => {
          return this.numberdata.push({ state: 100 });
        });
      }
    }, this.delayTime);
    if (this.filePreview.length) {
      this.lastOrder = this.filePreview[this.filePreview.length - 1].order;
    } else {
      this.lastOrder = 0;
    }
  },
  methods: {
    uploadDelete(index) {
      const beforeUpload = this.uploadList[index];
      if (!this.asyncClear) {
        this.uploadBeforeList.splice(index, 1);
        this.uploadList.splice(index, 1);
        this.numberdata.splice(index, 1);
        this.$emit('clear', this.uploadList, beforeUpload);
      } else {
        // 开启异步删除图片后，返回删除图片的数据和下标，调用clear()需要把下标传进去
        this.$emit('clear', beforeUpload, index);
      }
    },
    clear(index) {
      const beforeUpload = this.uploadList[index];
      this.uploadBeforeList.splice(index, 1);
      this.uploadList.splice(index, 1);
      return beforeUpload;
    },

    // 图片预览
    previewPicture(index) {
      const _this = this;
      const preview = [];
      for (let i = 0, len = _this.uploadBeforeList.length; i < len; i += 1) {
        preview.push(_this.uploadBeforeList[i].path);
      }
      uni.previewImage({
        current: index,
        urls: preview,
        indicator: 'default',
      });
    },

    // 上传图片到本地
    uploadClick() {
      const _this = this;
      // 获取上一次上传图片的长度，用于比较这次上传长度。
      const beforeUploadFile = _this.uploadBeforeList.length;
      if (_this.uploadList.length < _this.count || _this.name === 'avatar') {
        // 上传图片到本地
        uni.chooseImage({
          count: _this.count - _this.uploadBeforeList.length,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success(res) {
            // 上传图片后返回false状态
            _this.$emit('uploadClick', false);
            // 自定义开始上传的效果和回调
            _this.$emit('chooseSuccess');
            const promise = res.tempFiles.map((item, index) => {
              _this.lastOrder += 1;
              return new Promise((resolve, reject) => {
                res.tempFiles[index].uploadPercent = 0;
                res.tempFiles[index].uploadStatus = false;
                _this.uploadBeforeList.push(res.tempFiles[index]);
                _this.numberdata.push({ state: 0 });
                _this.newindex.push(res.tempFiles[index]);
                if (_this.uploadBeforeList.length > _this.count) {
                  _this.uploadBeforeList = _this.uploadBeforeList.slice(0, _this.count);
                  _this.numberdata = _this.numberdata.slice(0, _this.count);
                  _this.newindex = _this.newindex.slice(0, _this.count);
                }
                _this.upload(
                  res.tempFilePaths[index],
                  _this.uploadBeforeList.length - 1,
                  beforeUploadFile,
                  _this.lastOrder,
                  resolve,
                  reject,
                );
              });
            });

            Promise.allSettled(promise).then(() => {
              // 返回上传成功列表和成功状态值
              if (_this.uploadList.length > _this.count) {
                _this.uploadList = _this.uploadList.slice(0, _this.count);
              }
              // console.log(_this.uploadList, '这是组件内');
              _this.$emit('change', _this.uploadList, true);
            });
          },
        });
      }
    },
    // 上传图片到服务器
    upload(pathUrl, index, length, imgOrder, resolve, reject) {
      const _this = this;
      const formdataObj = { type: _this.formData.type, order: imgOrder };
      _this.formDataAppend = {};
      const uploadTask = uni.uploadFile({
        url: _this.url,
        fileType: _this.type,
        filePath: pathUrl,
        header: _this.header,
        name: _this.name,
        formData: formdataObj,
        success(res) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            setTimeout(() => {
              if (index < _this.uploadBeforeList.length) {
                _this.uploadBeforeList[index].uploadPercent = 100;
                _this.numberdata[index].state = 100;
              }
              if (
                _this.erroindex !== '' &&
                _this.erroindex >= 0 &&
                _this.erroindex < _this.uploadBeforeList.length
              ) {
                _this.uploadBeforeList[_this.erroindex].uploadPercent = 100;
                _this.numberdata[_this.erroindex].state = 100;
              }
              if (
                _this.indexs >= 0 &&
                _this.indexs !== '' &&
                _this.indexs < _this.uploadBeforeList.length
              ) {
                _this.uploadBeforeList[_this.indexs].uploadPercent = 100;
                _this.numberdata[_this.indexs].state = 100;
              }
              console.log(JSON.parse(res.data), '~~~~~~~~~');
              const resObj = {
                id: JSON.parse(res.data).data.id,
                type: JSON.parse(res.data).data.type,
                order: _this.lastOrder,
              };
              // console.log(resObj, '这是新增的对象');
              _this.uploadList.push(resObj);
              // console.log(_this.uploadList, '$$$$$$$$$$$$$');
              _this.newindex = [];
              _this.formDataAppend = {};
            }, 500);
          } else {
            _this.number += 1;
            const resObj = JSON.parse(res.data);
            if (resObj.errors[0].detail) {
              uni.showToast({
                icon: 'none',
                title: `${resObj.errors[0].code}\n${resObj.errors[0].detail[0]}`,
              });
            } else {
              uni.showToast({ icon: 'none', title: resObj.errors[0].code });
            }
            if (_this.uploadBeforeList.length > 1) {
              for (let i = 0; i < _this.uploadBeforeList.length; i += 1) {
                if (_this.uploadBeforeList[i] === _this.newindex[index]) {
                  _this.uploadBeforeList.splice(i, 1);
                  _this.uploadList.splice(i, 1);
                  _this.numberdata.splice(i, 1);
                  _this.erroindex = i;
                }
              }
            } else {
              _this.uploadBeforeList.splice(0, 1);
              _this.uploadList.splice(0, 1);
              _this.numberdata.splice(0, 1);
            }
            if (index > 0 && index === _this.uploadBeforeList.length) {
              _this.indexs = index - 1;
            } else if (index > 0 && index < _this.uploadBeforeList.length) {
              _this.indexs = index;
            } else if (index > 0 && index >= _this.uploadBeforeList.length) {
              _this.indexs = index - _this.number;
            } else if (index === 0) {
              _this.indexs = 0;
            }
            _this.$emit('uploadFail', res, _this.uploadList);
            return reject(res);
          }
          _this.newindex = [];
          _this.formDataAppend = {};
          // 抛出接口信息
          _this.$emit('uploadSuccess', res, _this.uploadList);
          // _this.numberdata.splice(index, 1);
          return resolve(_this.uploadList);
        },
        fail(res) {
          _this.uploadBeforeList.splice(index, 1);
          _this.uploadList.splice(index, 1);
          _this.numberdata.splice(index, 1);
          // 上传失败回调
          _this.$emit('uploadFail', res, _this.uploadList);
          return reject(res);
        },
      });

      uploadTask.onProgressUpdate(async res => {
        const progress = await res.progress;
        for (let i = length; i < _this.uploadBeforeList.length; i += 1) {
          if (progress < 100) {
            _this.uploadBeforeList[i].uploadPercent = progress;
            if (_this.numberdata[i]) {
              _this.numberdata[i].state = _this.uploadBeforeList[i].uploadPercent;
            }
          } else if (progress === 100) {
            _this.uploadBeforeList[i].uploadPercent = 90;
            if (_this.numberdata[i]) {
              _this.numberdata[i].state = _this.uploadBeforeList[i].uploadPercent;
            }
          }
        }
        console.log(_this.uploadBeforeList, '!!!!!!!!!!!');
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/base/theme/fn.scss';
@import '@/styles/base/variable/global.scss';

.qui-uploader-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 13rpx;
  width: 100%;
  min-height: 160rpx;
  padding: 30rpx 0;

  &__uploader-file {
    position: relative;
    width: 100%;
    height: calc((100vw - 80rpx) / 3);
    box-sizing: border-box;

    &__box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 10rpx;
    }

    &--image {
      z-index: 0;
      width: 100%;
      height: 100%;
      border: 1px solid --color(--qui-BOR-ED);
      border-radius: 5rpx;
    }
    &--load {
      position: absolute;
      top: 0;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      text-align: center;
      border: 1px solid --color(--qui-BOR-ED);
      border-radius: 5rpx;
      &__mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: --color(--qui-BG-ED);
        border: 1px solid --color(--qui-BOR-ED);
        border-radius: 5rpx;
        opacity: 0.7;
      }

      &__text {
        position: relative;
        z-index: 2;
        font-size: $fg-f28;
        line-height: 160rpx;
        color: --color(--qui-FC-34);
      }

      progress {
        position: absolute;
        bottom: 9.5rpx;
        z-index: 3;
        width: 87.5%;
      }
    }
    &__del {
      position: absolute;
      bottom: 0;
      left: 1px;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 30rpx;
      background: --color(--qui-BG-00);
      border-radius: 0 0 5rpx 5rpx;
      opacity: 0.5;
      .icon-delete {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }
    }
  }

  &__add {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc((100vw - 80rpx) / 3);
    background-color: --color(--qui-FC-f7);
    border: 1px solid --color(--qui-BOR-ED);
    border-radius: 5rpx;
  }
}
</style>
