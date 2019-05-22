var DrawUtil = {
    //div设置的高度应该 startY-endY，目前画出来的是585px
    //div设置的宽度应该 endX-startX，目前画出来的是410px
    startX:75,
    startY:450,
    endX:380,
    endY:30,
    yWidth:10,//纵轴上每个cell的高度
    xWidth:7,//横轴上每个cell的宽度
    yMaibo:[40,60,80,100,120,140,160,180],
    yTiwen:[35,36,37,38,39,40,41,42],
    //绘制X轴
    //每个度数之间是5个，每个是15px,8个一共是585px
    drawXAxis(){
      var group = new zrender.Group();
      var y = DrawUtil.startY;
      var color;
      for (var i = 0; i <= 40; i++) {
          color = i%5==0?"#000":"#c3c3c3";
          var line = new zrender.Line({
            shape:{
              x1:DrawUtil.startX,
              y1:y,
              x2:DrawUtil.endX,
              y2:y
            },
            style:{
              stroke:color,
              lineWidth:1
            }
          });
          y = y - DrawUtil.yWidth;
          group.add(line);
      }
      return group;

    },
    //绘制Y轴
    //每一天6个时间段，每个时间段10px，7天一共是420px
    drawYAxis(){
      var group = new zrender.Group();
      var x = DrawUtil.startX;
      var color;
      for (var i = 0; i < 42; i++) {
        color = i%6==0?"#000":"#c3c3c3";
          var line = new zrender.Line({
            shape:{
              x1:x,
              y1:DrawUtil.startY,
              x2:x,
              y2:DrawUtil.endY
            },
            style:{
              stroke:color,
              lineWidth:1
            }
          });
          x = x + DrawUtil.xWidth;
          group.add(line);
      }
      return group;
    },
    //绘制x轴箭头
    drawXAxisSolid(){
      var group = new zrender.Group();
      var line = new zrender.Line({
        shape:{
          x1:DrawUtil.endX,
          y1:DrawUtil.startY,
          x2:DrawUtil.endX-5,
          y2:DrawUtil.startY+5
        },
        style:{
          stroke:'#000',
          lineWidth:1
        }
      });
      group.add(line);
      line = new zrender.Line({
        shape:{
          x1:DrawUtil.endX,
          y1:DrawUtil.startY,
          x2:DrawUtil.endX-5,
          y2:DrawUtil.startY-5
        },
        style:{
          stroke:'#000',
          lineWidth:1
        }
      });
      group.add(line);
      return group;

    },
    //绘制Y轴箭头
    drawYAxisSolid(){
      var group = new zrender.Group();
      var line = new zrender.Line({
        shape:{
          x1:DrawUtil.startX,
          y1:DrawUtil.endY,
          x2:DrawUtil.startX-5,
          y2:DrawUtil.endY+5
        },
        style:{
          stroke:'#000',
          lineWidth:1
        }
      });
      group.add(line);
      line = new zrender.Line({
        shape:{
          x1:DrawUtil.startX,
          y1:DrawUtil.endY,
          x2:DrawUtil.startX+5,
          y2:DrawUtil.endY+5
        },
        style:{
          stroke:'#000',
          lineWidth:1
        }
      });
      group.add(line);
      return group;
    },
    //绘制X文本
    drawXAxisText(arr){
      var group = new zrender.Group();
      for (var i = 0; i < arr.length; i++) {
        var text = new zrender.Text({
            style: {
                text: arr[i],
                fontSize: 14,
                textFill: '#000',
                textBackgroundColor: '#FFF'
            }
        })
        var x = DrawUtil.xWidth * 6 * i;
        text.attr('position', [DrawUtil.startX-10 + x, DrawUtil.startY+5]);
        group.add(text);
      }
      return group;
    },
    //绘制Y文本
    drawYAxisText(arr){
      var group = new zrender.Group();
      for (var i = 0; i < DrawUtil.yTiwen.length; i++) {
        var text = new zrender.Text({
            style: {
                text: DrawUtil.yTiwen[i],
                fontSize: 14,
                textFill: '#000',
                textBackgroundColor: '#FFF'
            }
        })
        var y = DrawUtil.yWidth * 5 * (i+1);
        text.attr('position', [DrawUtil.startX - 30, DrawUtil.startY -5 - y]);
        group.add(text);
      }

      for (var i = 0; i < DrawUtil.yMaibo.length; i++) {
        var text = new zrender.Text({
            style: {
                text: DrawUtil.yMaibo[i],
                fontSize: 14,
                textFill: '#e51c23',
                textBackgroundColor: '#FFF'
            }
        })
        var y = DrawUtil.yWidth * 5 * (i+1);
        text.attr('position', [DrawUtil.startX - 60, DrawUtil.startY -5 - y]);
        group.add(text);
      }
      return group;
    },
    //绘制描述
    drawDesc(){
      var group = new zrender.Group();
      var tiwen = new zrender.Text({
          style: {
              text: "体温(°C)",
              fontSize: 14,
              textFill: '#000',
              textBackgroundColor: '#FFF'
          }
      });
      tiwen.attr('position', [DrawUtil.endX - 140, DrawUtil.endY - 25]);
      group.add(tiwen);
      var maibo = new zrender.Text({
          style: {
              text: "脉搏(次/分)",
              fontSize: 14,
              textFill: '#e51c23',
              textBackgroundColor: '#FFF'
          }
      });
      maibo.attr('position', [DrawUtil.endX - 80, DrawUtil.endY - 25]);
      group.add(maibo);

      return group
    },
    // 绘制纵向文本
    drawText (str, dx, dy) {
        var group = new zrender.Group()

        for (var i = 0; i < str.length; i++) {
            var text = new zrender.Text({
                style: {
                    text: str.charAt(i),
                    fontSize: 14,
                    textFill: '#FF4949',
                    textBackgroundColor: '#FFF',
                }
            })
            var y = 14 * i
            text.attr('position', [0, y])
            group.add(text)
        }

        group.attr('position', [dx, dy])
        return group
    },
    // 绘制实心圆
    drawCircle (Obj, Color) {
        return new zrender.Circle({
            shape: {
                cx: Obj.x,
                cy: Obj.y,
                r: 4
            },
            style: {
                fill: Color
            }
        });
    },
    // 绘制三角形
    drawIsogon (Obj, Color) {
        return new zrender.Isogon({
            shape: {
                x: Obj.x,
                y: Obj.y,
                r: 6,
                n: 3
            },
            style: {
                fill: Color
            }
        });
    },
    // 绘制空心圆
    drawHollowCircle (Obj, Color) {
        return new zrender.Circle({
            shape: {
                cx: Obj.x,
                cy: Obj.y,
                r: 4
            },
            style: {
                fill: '#FFFFFF',
                stroke: Color
            }
        });
    },
    // 绘制×
    drawX (Obj, Color) {
        return new zrender.Text({
            style: {
                text: '×',
                fontSize: 20,
                textFill: Color,
            },
            position: [Obj.x - 7, Obj.y - 11]
        });
    },
    // 绘制圆圈中有点的圆
    drawPointCircle (Obj, Color) {
        var group = new zrender.Group()
        var Point = new zrender.Circle({
            shape: {
                cx: 4,
                cy: 4,
                r: 1
            },
            style: {
                fill: Color
            }
        })
        var OutCircle = new zrender.Circle({
            shape: {
                cx: 4,
                cy: 4,
                r: 4
            },
            style: {
                fill: '#FFFFFF',
                stroke: Color
            }
        })
        group.add(OutCircle)
        group.add(Point)
        group.attr('position', [Obj.x - 3, Obj.y - 3])

        return group
    },
    // 绘制圆圈中有H的圆
    drawHCircle (Obj, Color) {
        var group = new zrender.Group()
        var h = new zrender.Text({
            style: {
                text: 'H',
                fontSize: 8,
                textFill: Color
            },
            position: [2, -1]
        })
        var OutCircle = new zrender.Circle({
            shape: {
                cx: 5,
                cy: 5,
                r: 5
            },
            style: {
                fill: '#FFFFFF',
                stroke: Color
            }
        })

        group.add(OutCircle)
        group.add(h)
        group.attr('position', [Obj.x - 4, Obj.y - 4])

        return group
    },
    // 绘制圆圈中有加号的圆
    drawAddCircle (Obj, Color) {
        var group = new zrender.Group()
        var h = new zrender.Text({
            style: {
                text: '+',
                fontSize: 8,
                textFill: Color
            },
            position: [2, -1]
        })
        var OutCircle = new zrender.Circle({
            shape: {
                cx: 5,
                cy: 5,
                r: 5
            },
            style: {
                fill: '#FFFFFF',
                stroke: Color
            }
        })

        group.add(OutCircle)
        group.add(h)
        group.attr('position', [Obj.x - 4, Obj.y - 4])

        return group
    },
}
