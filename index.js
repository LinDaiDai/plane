/**
 * Created by Administrator on 2017/8/2.
 */
window.onload = function (ev) {
    let homePage = document.getElementById('homePage');
    let game = document.getElementById('game');
    let p = document.getElementById('p');
    let startBtn = document.querySelector('#startBtn');


    let plane = document.createElement('img');    //创建飞机

    let shield = document.createElement('img');  //创建护罩

    let ball = document.createElement('img');   //创建子弹

    let enemy = document.createElement('img');  //创建敌机

    let enemyBall = document.createElement('img');  //创建敌机

    let score = 0;

    let timeEnemy;
    //按回车键开始游戏
    document.onkeydown = function (e) {
        let ev = event||ev;
        if(ev.keyCode===13){
            start();
        }
    }
    //点击按钮开始游戏
    startBtn.onclick = function(){
        start();
    }
    //定义开始游戏函数
    function start() {
        createPlane(game);              //引用创建飞机函数
        // createshield(game);             //引用创建护罩函数
        plane.style.display = 'block';
        ball.style.display = 'block';
        shield.style.display = 'block';
        homePage.style.cursor = 'none';           //隐藏鼠标

        startBtn.parentNode.style.display = 'none';  //隐藏开始按钮
        game.style.background = 'url("img/center.jpg")';//改变主页背景颜色
        setTimeout(function stepBall() {
            createBall(homePage);       //引用创建子弹函数
            setTimeout(stepBall, 40);
        }, 0);
        setTimeout(function stepEnemy() {
            createEnemy(homePage);      //引用创建敌机函数
            timeEnemy=setTimeout(stepEnemy, 500);
        }, 0);
            //引用获得模式函数
        let radio = document.getElementsByName('mode');
        var modeValue = getMode(radio);
        console.log(modeValue)
        if(modeValue==1){
            document.onmousemove = function (ev) {
                move(ev,modeValue)
            };
        }else if(modeValue==2){
            document.onkeydown = function(){
                move(ev,modeValue)
            };
        }
            function  move(ev,value){
            let enemys = document.querySelectorAll('.enemy');   //获取敌机集合
            let balls = document.querySelectorAll('.ball');     //获取子弹集合
            let enemyBalls = document.querySelectorAll('.enemyBall');
            var oEvent = event || ev;
                //判断模式
                if(value == 2){                         //键盘模式
                    //获取事件对象
                    switch (oEvent.keyCode){
                        case 65:                //左
                        case 37:
                            plane.style.left=plane.offsetLeft-40+'px';
                            break;
                        case 68:                //右
                        case 39:
                            plane.style.left=plane.offsetLeft+40+'px';
                            break;
                        case 87:                //上
                        case 38:
                            plane.style.top=plane.offsetTop-40+'px';
                            break;
                        case 83:                    //下
                        case 40:
                            plane.style.top=plane.offsetTop+40+'px';
                            break;
                    }
                }else if(value==1){                 //鼠标模式
                    var pos = getPos(oEvent);       //引用鼠标位置函数
                    var posX = pos.x - plane.offsetWidth/2;
                    var posY = pos.y;
                    plane.style.left = posX + 'px';    //设置飞机的位置
                    plane.style.top = posY + 'px';
                }

                for(let i=0;i<balls.length;i++){        //对子弹集合遍历
                if(balls[i].offsetTop<=0){          //若子弹超出范围
                    homePage.removeChild(balls[i]);
                }else{
                    for(let j=0;j<enemys.length;j++){   //对敌机集合遍历
                        if(bomb(enemys[j],balls[i])){       //若子弹与敌机相碰
                            enemys[j].src='img/bomb.png';
                            homePage.removeChild(balls[i]);
                            enemys[j].onload = null;
                            setTimeout(function(){
                                homePage.removeChild(enemys[j]);
                            },300);
                            score++;
                        }
                        if(enemys[j].offsetTop>=homePage.offsetHeight
                            -enemys[j].offsetHeight){           //若敌机超出范围
                            homePage.removeChild(enemys[j]);
                        }
                    }
                }
            }

            //对飞机超出边界做判断
            var maxLeft = parseInt(470+homePage.offsetWidth-plane.offsetWidth);
            if (plane.offsetLeft <= 450) {
                plane.style.left = 450 + 'px';
            }
            if (plane.offsetTop >= 550) {
                plane.style.top = 550 + 'px';
            }
            if (plane.offsetLeft >= maxLeft) {
                plane.style.left = maxLeft + 'px';
            }
            p.innerHTML=score;

            if(score>=30){
                plane.src = 'img/plane6.png';
            }else if(score>=60){
                plane.src='img/plane3.png';
                // game.style.background = 'url("img/back2.png")';//改变主页背景颜色
            }else if(score>=80){
                plane.src='img/plane2.png';
            }

            //游戏结束
            if(gameover(enemyBalls,plane)){
                plane.src='img/bomb.png';
                setTimeout(function(){
                    alert("哎呦!炸鸡了!您此次的分数是:"+score+",再接再厉哦!");
                    location.reload();
                },500);
            }
        };
    };
    //获取模式
    function getMode(radio){
        var mode;
        for(var r of radio){
            if(r.checked==true){
                var val = r.value;
                if(val==1){
                    mode=1;
                }else if(val==2){
                    mode=2;
                }
            }
        }
        return mode;
    }

    //生成飞机
    function createPlane(parent) {
        plane.className = 'plane';
        plane.src = 'img/plane3.png';
        plane.style.display = 'none';
        plane.style.left=560+'px';
        plane.style.top=450+'px';
        game.appendChild(plane);
    }

    // //生成护罩
    // function createshield(parent){
    //     shield.className = 'shield';
    //     plane.src = 'img/pao.png';
    //     shield.style.display = 'none';
    //     game.appendChild(shield);
    // }
    //生成子弹

    function createBall(parent) {
        let ball = document.createElement('img');   //创建子弹
        ball.src = 'img/ball2.png';
        if(score>=30){
            ball.src = 'img/ball.png';
        }

        ball.className = 'ball';
        let ballStartLeft = plane.offsetLeft + plane.offsetWidth/2;
        let ballStartTop = plane.offsetTop - 5;
        ball.style.left = ballStartLeft + 'px';
        ball.style.top = ballStartTop + 'px';
        ball.onload = function () {
             setTimeout(function ballMove(){
                ball.style.top = ball.offsetTop - 50 + 'px';
                setTimeout(ballMove, 100);
            }, 0);
        };
        parent.appendChild(ball);
    }


    //生成敌机
    function createEnemy(parent) {
        let enemy = document.createElement('img');  //创建敌机
        enemy.className = 'enemy';
        enemy.src = 'img/enemy'+randomInt(1,5)+'.png';
        if(score>=40){
            enemy.src = 'img/enemy4.png';
        }

        var enemyMaxLeft = parseInt(450+homePage.offsetWidth-70);
        let randomLeft = randomInt(450,enemyMaxLeft);
        enemy.style.left = randomLeft + 'px';
        enemy.style.top = 0;
        //控制敌机移动并生产子弹
        enemy.onload = function () {
            setTimeout(function enemyMove(){
                if(enemy.offsetTop>=homePage.offsetHeight-enemy.offsetHeight){
                    homePage.removeChild(enemy);
                }
                enemy.style.top = enemy.offsetTop + 10 + 'px';
                setTimeout(enemyMove, 100);
            }, 0);
            createEnemyBall(homePage,enemy);//引用创建敌机子弹
        };

        parent.appendChild(enemy)
    }
    
    //生成敌方子弹
    function createEnemyBall(parent,enemy){
        let enemyBall = document.createElement('img');  //创建敌机子弹
        enemyBall.className='enemyBall';
        enemyBall.src='img/enemyBall'+randomInt(1,2)+'.png';
        let enemyBallLeft = enemy.offsetLeft+enemy.offsetWidth/2;
        let enemyBallTop = enemy.offsetTop;
        enemyBall.style.left = enemyBallLeft + 'px';
        enemyBall.style.top = enemyBallTop + 'px';
        enemyBall.onload=function(){
            setTimeout(function enemyBallMove(){
                if(enemyBall.offsetTop>=550){
                    homePage.removeChild(enemyBall);
                }
                enemyBall.style.top=enemyBall.offsetTop+20+'px';
                setTimeout(enemyBallMove,100);
            },0)
        };
        parent.appendChild(enemyBall);
    }

    //定义爆炸条件

    function bomb(enemy,ball){
        var top = ball.offsetTop-enemy.offsetHeight;
        if(top<=enemy.offsetTop
            &&(ball.offsetLeft>=enemy.offsetLeft&&ball.offsetLeft<=enemy.offsetLeft+enemy.offsetWidth)){
            return true;
        }
    }

    //定义游戏结束
    var count =0;
    function gameover(enemyBalls,plane){
        for(let n=0;n<enemyBalls.length;n++){
                if((enemyBalls[n].offsetTop+enemyBalls[n].offsetHeight>=plane.offsetTop&&enemyBalls[n].offsetTop<=plane.offsetTop+plane.offsetHeight)&&((enemyBalls[n].offsetLeft>=parseInt(plane.offsetLeft)+10)&&enemyBalls[n].offsetLeft<=(plane.offsetLeft+plane.offsetWidth-10))){
                    count++;
                }
                if(count==1){
                    plane.src='img/plane4.png';
                    return false
                }else if(count==2){
                    return true;
                }
        }
        return false;
    }
    //定义函数  获取鼠标移动时的坐标信息；
    function getPos(ev) {
        var e = ev || window.event;
        var movex = e.pageX;
        var movey = e.pageY;
        return {
            x: movex,
            y: movey
        }
    }

    //定义一个求范围的随机数的函数
    function randomInt(from, to) {
        return parseInt((Math.random() * (to + 1 - from)) + from);
    }
};
