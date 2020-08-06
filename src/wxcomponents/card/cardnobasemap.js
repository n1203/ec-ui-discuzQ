export default class LastMayday {
  palette(obj) {
    return (
      {
        "width": "700px",
        "height": "980px",
        "background": "#ffffff",
        "views": [
          {
            "type": "rect",
            "css": {
              "background": "#1878F3",
              "width": "700px",
              "height": "450px",
              "top": "0px",
              "left": "0px",
              "rotate": "0",
              "borderRadius": "",
              "shadow": "",
              "color": "#1878F3"
            }
          },
          {
            "type": "image",
            "url": obj.userheader,
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
            "text": obj.username,
            "css": {
              "color": "#FFFFFF",
              "background": "rgba(0,0,0,0)",
              "width": "500px",
              "height": "40.04px",
              "top": "41px",
              "left": "140px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "28px",
              "fontWeight": "bold",
              "maxLines": "1",
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
          //     "color": "#FFFFFF",
          //     "background": "rgba(0,0,0,0)",
          //     "width": "57px",
          //     "height": "40.04px",
          //     "top": "41px",
          //     "left": `${obj.renamewidth}px`,
          //     "rotate": "0",
          //     "borderRadius": "",
          //     "borderWidth": "",
          //     "borderColor": "#000000",
          //     "shadow": "",
          //     "padding": "0px",
          //     "fontSize": "28px",
          //     "fontWeight": "400",
          //     "maxLines": "1",
          //     "lineHeight": "40.40400000000001px",
          //     "textStyle": "fill",
          //     "textDecoration": "none",
          //     "fontFamily": "",
          //     "textAlign": "left"
          //   }
          // },
          {
            "type": "text",
            "text": obj.slitename,
            "css": {
              "color": "#FFFFFF",
              "background": "rgba(0,0,0,0)",
              "width": "500px",
              "height": "34.32px",
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
              "maxLines": "1",
              "lineHeight": "34.632000000000005px",
              "textStyle": "fill",
              "textDecoration": "none",
              "fontFamily": "",
              "textAlign": "left"
            }
          },
          {
            "type": "image",
            "url":obj.slitelogo,
            "css": {
              // "width": "285.71px",
              "height": "88px",
              "top": "232.99999999999997px",
              "left":  `${obj.leftwidth}px`,
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
            "text": obj.member,
            "css": {
              "color": "rgba(255,255,255,0.5)",
              "background": "rgba(0,0,0,0)",
              "width": "53px",
              "height": "37.18000000000001px",
              "top": "365px",
              "left": "160px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "26px",
              "fontWeight": "400",
              "maxLines": "1",
              "lineHeight": "37.51800000000001px",
              "textStyle": "fill",
              "textDecoration": "none",
              "fontFamily": "",
              "textAlign": "left"
            }
          },
          {
            "type": "text",
            "text": `${obj.themnumber}`,
            "css": {
              "color": "#FFFFFF",
              "background": "rgba(0,0,0,0)",
              "width": "89px",
              "height": "40.04px",
              "top": "364px",
              "left": "227px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "28px",
              "fontWeight": "400",
              "maxLines": "1",
              "lineHeight": "40.40400000000001px",
              "textStyle": "fill",
              "textDecoration": "none",
              "fontFamily": "",
              "textAlign": "left"
            }
          },
          {
            "type": "text",
            "text": obj.contents,
            "css": {
              "color": "rgba(255,255,255,0.5)",
              "background": "rgba(0,0,0,0)",
              "width": "53px",
              "height": "37.18000000000001px",
              "top": "365px",
              "left": "381px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "26px",
              "fontWeight": "400",
              "maxLines": "1",
              "lineHeight": "37.51800000000001px",
              "textStyle": "fill",
              "textDecoration": "none",
              "fontFamily": "",
              "textAlign": "left"
            }
          },
          {
            "type": "text",
            "text": `${obj.contdata}`,
            "css": {
              "color": "#FFFFFF",
              "background": "rgba(0,0,0,0)",
              "width": "92px",
              "height": "40.04px",
              "top": "364px",
              "left": "448px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "28px",
              "fontWeight": "400",
              "maxLines": "1",
              "lineHeight": "40.40400000000001px",
              "textStyle": "fill",
              "textDecoration": "none",
              "fontFamily": "",
              "textAlign": "left"
            }
          },
          {
            "type": "text",
            "text": obj.siteintroduction,
            "css": {
              "color": "#333333",
              "background": "rgba(0,0,0,0)",
              "width": "113px",
              "height": "40.04px",
              "top": "500px",
              "left": "40px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "28px",
              "fontWeight": "bold",
              "maxLines": "1",
              "lineHeight": "40.40400000000001px",
              "textStyle": "fill",
              "textDecoration": "none",
              "fontFamily": "",
              "textAlign": "left"
            }
          },
          {
            "type": "text",
            "text":obj.introd,
            "css": {
              "color": "#6D6D6D",
              "background": "rgba(0,0,0,0)",
              "width": "622px",
              "height": "122.304px",
              "top": "557px",
              "left": "40px",
              "rotate": "0",
              "borderRadius": "",
              "borderWidth": "",
              "borderColor": "#000000",
              "shadow": "",
              "padding": "0px",
              "fontSize": "28px",
              "fontWeight": "400",
              "maxLines": "5",
              "lineHeight": "40.40400000000001px",
              "textStyle": "fill",
              "textDecoration": "none",
              "fontFamily": "",
              "textAlign": "left"
            }
          },
          {
            "type": "rect",
            "css": {
              "background": "#F9FAFC",
              "width": "700px",
              "height": "200px",
              "top": "782px",
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
              "top": "812px",
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
            "text": obj.longpressrecog,
            "css": {
              "color": "#333333",
              "background": "rgba(0,0,0,0)",
              "width": "338px",
              "height": "40.04px",
              "top": "842px",
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
              "lineHeight": "40.40400000000001px",
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
              "height": "34.32px",
              "top": "889px",
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
              "lineHeight": "34.632000000000005px",
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
