/* eslint-disable prettier/prettier */
/* eslint-disable class-methods-use-this */
export default class LastCard {
  palette(obj) {
    return (
          {
            "width": "700px",
            "height": "1082px",
            "background": "#ffffff", // 海报颜色
            "views": [
            {
              "type": "image",
              "url": obj.recoimg,
              "css": {
                "width": "80px",
                "height": "80px",
                "top": "40px",
                "left": "40px",
                "rotate": "0",
                "borderRadius": "40px",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "mode": "scaleToFill"
              }
            },
            {
              "type": "text",
              "text":  obj.reconame,
              "css": {
                "color": "#000000", // name颜色
                "background": "rgba(0,0,0,0)",
                "width": "500px",
                "height": "40px",
                "top": "41px",
                "left": "140px",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0",
                "fontSize": "28px",
                "fontWeight": "bold",
                "maxLines": "2",
                "lineHeight": "40.40400000000001px",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "left"
              }
            },
            // {
            //   "type": "text",
            //   "text": obj.recomment,
            //   "css": {
            //     "color": "#000000", // 帖子类型颜色
            //     "background": "rgba(0,0,0,0)",
            //     "width": "57px",
            //     "height": "40px",
            //     "top": "41px",
            //     "left": `${obj.renamewidth}px`,
            //     "rotate": "0",
            //     "borderRadius": "",
            //     "borderWidth": "",
            //     "borderColor": "#000000",
            //     "shadow": "",
            //     "padding": "0",
            //     "fontSize": "28px",
            //     "fontWeight": "400",
            //     "maxLines": "2",
            //     "lineHeight": "40.40400000000001px",
            //     "textStyle": "fill",
            //     "textDecoration": "none",
            //     "fontFamily": "",
            //     "textAlign": "left"
            //   }
            // },
            {
              "type": "text",
              "text":obj.username + obj.stay + obj.useratttype + obj.published+obj.contents,
              "css": {
                "color": "#333333", // 用户个人简介颜色
                "background": "rgba(0,0,0,0)",
                "width": "535px",
                "height": "34px",
                "top": "88px",
                "left": "140px",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0",
                "fontSize": "24px",
                "fontWeight": "400",
                "maxLines": "2",
                "lineHeight": "34.632000000000005px",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "left"
              }
            },
            {
              "type": "text",
              "text":  obj.usercontent,
              "css": {
                "color": "#333333", // 帖子文字颜色
                "background": "rgba(0,0,0,0)",
                "width": "620px",
                "height": "520.2399999999998px",
                "top": "161px",
                "left": "40px",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "28px",
                "fontWeight": "400",
                "maxLines": "12",
                "lineHeight": "46.3px",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "left",
                "overflow": "hidden"
              }
            },
            {
              "type": "rect",
              "css": {
                "background": "#F7F7F7",
                "width": `${obj.marglength}px`,
                "height": "50px",
                "top": "757px",
                "left": "40px",
                "rotate": "0",
                "borderRadius": "6px",
                "shadow": "",
                "color": "#F7F7F7"
              }
            },
            {
              "type": "text",
              "text": obj.goddessvideo,
              "css": {
                "color": "#777777",
                "background": "rgba(0,0,0,0)",
                "width": `${obj.attachlength}px`,
                "height": "27.2px",
                "top": "769px",
                "left": "60px",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0",
                "fontSize": "24px",
                "fontWeight": "400",
                "maxLines": "1",
                "lineHeight": "26.64px",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "center"
              }
            },
            {
              "type": "rect",
              "css": {
                "background": "#F9FAFC",
                "width": "700px",
                "height": "200px",
                "top": "882px",
                "left": "0px",
                "rotate": "0",
                "borderRadius": "NaNpx",
                "shadow": "",
                "color": "#F9FAFC"
              }
            },
            {
              "type": "image",
              "url": `${obj.userweixincode}`,
              "css": {
                "min-width": "140px",
                "height": "140px",
                "top": "912px",
                "left": "40px",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "mode": "scaleToFill"
              }
            },
            {
              "type": "text",
              "text": obj.longpressrecog,
              "css": {
                "color": "#333333",
                "background": "rgba(0,0,0,0)",
                "width": "337px",
                "height": "31.7px",
                "top": "942px",
                "left": "210px",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0px",
                "fontSize": "28px",
                "fontWeight": "400",
                "maxLines": "1",
                "lineHeight": "31px",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "left"
              }
            },
            {
              "type": "text",
              "text": obj.comefrom+obj.slitename,
              "css": {
                "color": "#AAAAAA",
                "background": "rgba(0,0,0,0)",
                "width": "164px",
                "height": "27px",
                "top": "989px",
                "left": "210px",
                "rotate": "0",
                "borderRadius": "",
                "borderWidth": "",
                "borderColor": "#000000",
                "shadow": "",
                "padding": "0",
                "fontSize": "24px",
                "fontWeight": "400",
                "maxLines": "1",
                "lineHeight": "26px",
                "textStyle": "fill",
                "textDecoration": "none",
                "fontFamily": "",
                "textAlign": "left"
              }
            }
            ]
          }
    );
  }
}