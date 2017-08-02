/**
 * Created by Administrator on 2017/8/2.
 */
window.onload=function(){
    var homePage = document.getElementById('homePage');
    var game = document.getElementById('game');

    var startBtn = document.querySelector('#startBtn');

    var plane = document.createElement('img');    //创建飞机

    var ball = document.createElement('img');   //创建子弹
    startBtn.onclick=function(){
        createPlane(game);              //引用创建飞机函数

        setTimeout(function step(){
            createBall(homePage);               //引用创建子弹函数
            setTimeout(step,1000);
        },0);

        for(let i=0;i<homePage.childElementCount;i++){
                setTimeout(function ballMove() {
                    console.log(homePage.child[i].offsetTop);
                    homePage.child[i].style.top = homePage.child[i].offsetTop - 5 + 'px';
                    setTimeout(ballMove, 100);
                }, 0);

        }



        document.onmousemove=function (ev) {
            plane.style.display='block';
            ball.style.display='block';
            homePage.style.cursor='none';           //隐藏鼠标

            startBtn.parentNode.style.display='none';  //隐藏开始按钮
            game.style.background='url("img/center.jpg")';//改变主页背景颜色

            var oEvent = event||ev;         //获取事件对象
            var pos = getPos(oEvent);       //引用鼠标位置函数
            var posX = pos.x-40;
            var posY = pos.y;
            plane.style.left=posX+'px';    //设置飞机的位置
            plane.style.top=posY+'px';


            //对超出边界做判断
            if(plane.offsetLeft<=450){
                plane.style.left=450+'px';
            }
            if(plane.offsetTop>=550){
                plane.style.top=550+'px';
            }
            if(plane.offsetLeft>=835){
                plane.style.left=835+'px';
            }

        };
    };


    //生成飞机
    function createPlane(parent){
        plane.className='plane';
        plane.src='img/plane1.png';
        plane.style.display='none';
        game.appendChild(plane);
    }

    //生成子弹

    function createBall(parent){
        var ball = document.createElement('img');   //创建子弹
        ball.src='img/ball.png';
        ball.className='ball';
        var ballStartLeft=plane.offsetLeft+35;
        var ballStartTop = plane.offsetTop-10;
        ball.style.left=ballStartLeft+'px';
        ball.style.top=ballStartTop+'px';

        parent.appendChild(ball);
    }
    //定义函数  获取鼠标移动时的坐标信息；
    function getPos(ev){
            var e= ev || window.event;
            var movex=e.pageX;
            var movey=e.pageY;
            return {
                x:movex,
                y:movey
            }
    }

};
