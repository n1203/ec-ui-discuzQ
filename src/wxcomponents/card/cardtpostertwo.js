export default class LastMayday {
  palette(obj) {
    return (
      {
        "width": "700px",
        "height": `${1082-obj.contentheight}px`,
        "background": "#ffffff",
        "views": [
          {
            "type": "rect",
            "css": {
              "background": "#F7F7F7",
              "width": `${obj.marglength}px`,
              "height": "50px",
              "top": `${757-obj.contentheight}px`,
              "left": "40px",
              "rotate": "0",
              "borderRadius": "6px",
              "shadow": "",
              "color": "#F7F7F7"
            }
          },
          {
            "type": "text",
            "text":obj.goddessvideo,
            "css": {
              "color": "#777777",
              "background": "rgba(0,0,0,0)",
              "width": `${obj.attachlength}px`,
              "height": "27.119999999999997px",
              "top": `${769-obj.contentheight}px`,
              "left": "60px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
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
              "top": `${882-obj.contentheight}px`,
              "left": "0px",
              "rotate": "0",
              "borderRadius": "",
              "shadow": "",
              "color": "#F9FAFC"
            }
          },
          {
            "type": "image",
            "url": obj.userweixincode,
            "css": {
              "width": "140px",
              "height": "140px",
              "top": `${912-obj.contentheight}px`,
              "left": "40px",
              "rotate": "0",
              "borderRadius": "0px",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "mode": "scaleToFill"
            }
          },
          {
            "type": "text",
            "text":obj.longpressrecog,
            "css": {
              "color": "#333333",
              "background": "rgba(0,0,0,0)",
              "width": "337px",
              "height": "31.639999999999997px",
              "top": `${942-obj.contentheight}px`,
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
              "lineHeight": "31.080000000000002px",
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
              "width": "450px",
              "height": "27.119999999999997px",
              "top": `${989-obj.contentheight}px`,
              "left": "210px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "24px",
              "fontWeight": "400",
              "maxLines": "1",
              "lineHeight": "26.64px",
              "textStyle": "fill",
              "textDecoration": "none",
              "fontFamily": "",
              "textAlign": "left"
            }
          },
          {
            "type": "text",
            "text": obj.usertitle,
            "css": {
              "color": "#303133",
              "background": "rgba(0,0,0,0)",
              "width": "453px",
              "height": "33.9px",
              "top": "159px",
              "left": "40px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "30px",
              "fontWeight": "bold",
              "maxLines": "1",
              "lineHeight": "33.300000000000004px",
              "textStyle": "fill",
              "textDecoration": "none",
              "fontFamily": "",
              "textAlign": "left"
            }
          },
          {
            "type": "text",
            "text": obj.usercontent,
            "css": {
              "color": "#333333",
              "background": "rgba(0,0,0,0)",
              "width": "616px",
              "height": `${472.77999999999986-obj.contentheight}px`,
              "top": "240px",
              "left": "40px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "28px",
              "fontWeight": "400",
              "maxLines": "11",
              "lineHeight": "46.620000000000005px",
              "textStyle": "fill",
              "textDecoration": "none",
              "fontFamily": "",
              "textAlign": "left"
            }
          },
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
            "text": obj.username + obj.stay + obj.useratttype + obj.published+obj.contents,
            "css": {
              "color": "#333333",
              "background": "rgba(0,0,0,0)",
              "width": "535px",
              "height": "27.119999999999997px",
              "top": "88px",
              "left": "140px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "24px",
              "fontWeight": "400",
              "maxLines": "2",
              "lineHeight": "26.64px",
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
          //     "color": "#000000",
          //     "background": "rgba(0,0,0,0)",
          //     "width": "57px",
          //     "height": "31.639999999999997px",
          //     "top": "41px",
          //     "left":  `${obj.renamewidth}px`,
          //     "rotate": "0",
          //     "borderRadius": "",
          //     "borderWidth": "",
          //     "borderColor": "#000000",
          //     "shadow": "",
          //     "padding": "0px",
          //     "fontSize": "28px",
          //     "fontWeight": "400",
          //     "maxLines": "1",
          //     "lineHeight": "31.080000000000002px",
          //     "textStyle": "fill",
          //     "textDecoration": "none",
          //     "fontFamily": "",
          //     "textAlign": "left"
          //   }
          // },
          {
            "type": "text",
            "text": obj.reconame,
            "css": {
              "color": "#000000",
              "background": "rgba(0,0,0,0)",
              "width": "500px",
              "height": "31.639999999999997px",
              "top": "39px",
              "left": "139px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "28px",
              "fontWeight": "bold",
              "maxLines": "1",
              "lineHeight": "31.080000000000002px",
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
