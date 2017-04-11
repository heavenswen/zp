//o 对象
function zhuanpan(o, object) {
    (function () {
        //帧
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
                // Webkit中此取消方法的名字变了
                window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
    }());
    var info = object.info;//项目
    var age = info.length;//获得个数
    var color = ["#fdd", "#fee", "#fdd", "#fee", "#fdd", "#fee", "#fdd", "#fee", "#fdd", "#fee",];
    var font = "16px 微软雅黑";//项目字体
    var fontColor = "#333";//项目字色
    var step = 2 * Math.PI / age;//一个弧度
    var outerR = w / 2 * 0.95 - 15; //轮盘的大小
    var interR = w / 2 * 0.95 * .25;//内存空白圆的大小
    var beginAngle = 50;//旋转起来时默认开始旋转的度数，度数愈大旋转的初始速度愈大
    var radio = 0.98;//旋转速度衰减系数，影响旋转时间
    var t = null;//帧er
    var canvas = document.querySelector(o);
    var context = canvas.getContext("2d");
    //偏移
    context.translate(w / 2, w / 2);

    init(context);
    this.traggerAnimate = function (n, f) {
        if (t) {
            return false;
        }
        //变量
        var all = 0;
        var random = n;
        var step = beginAngle + (5 * random);
        var angle = 0;

        //帧动画
        t = requestAnimationFrame(animate);

        function animate() {
            step *= radio;

            if (step <= 0.1) {
                //animate init
                cancelAnimationFrame(t);
                t = null;

                //获得旋转到达
                var pos = angle / (360 / age);

                pos = Math.ceil(pos);

                var num = age - pos;
                //num = num > 0? num - 1 : age - 1;
                var res = info[num];
                console.log('num', num, 'ramdom', random, 'all', all)
                //callback
                all = 0;
                if (f) f(res);
            } else {
                //clean 
                context.clearRect(-250, -250, w, w);
                all++;
                angle += step;
                if (angle > 360) {
                    angle -= 360;
                }
                context.save();
                context.beginPath();

                //旋转 幅度
                var rotate = angle * Math.PI / 180;
                context.rotate(rotate);


                init(context);
                context.restore();
                //帧
                t = requestAnimationFrame(animate);

            }
        }
    };

    //canvas init
    function init(context) {

        var start_deg = 360 / age;//单个角
        //block


        for (var i = 0; i < age; i++) {
            context.save();
            context.beginPath();
            context.moveTo(0, 0);
            context.fillStyle = color[i];
            // 偏移 90 angle
            var translateAngle = 2 / 360 * 90;
            var start = 2 / age * i - translateAngle;
            start = start >= 0 ? start : 2 + start;
            //转换成2.0*pi = 360
            start = start * Math.PI;
            context.arc(0, 0, outerR, start, start + step);
            context.fill();
            context.restore();
        }

        // center 
        context.save();
        context.beginPath();
        //context.fillStyle = "#fff";
        context.arc(0, 0, interR, 0, 2 * Math.PI);
        context.fill();
        context.restore();

        //block font

        for (var i = 0; i < age; i++) {
            context.save();
            context.beginPath();
            context.fillStyle = fontColor;
            context.font = font;
            context.textAlign = "center";
            context.textBaseline = "middle";
            //减90度
            var start = i * start_deg - 90;
            start = start >= 0 ? start : 360 + start;
            var rotate = start * Math.PI / 180;
            //rotate = rotate >= 0 ? rotate :
            context.rotate(rotate + step / 2);
            context.fillText(info[i], (outerR + interR) / 2, 0);
            context.restore();
        }
    }
}