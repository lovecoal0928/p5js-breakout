function setup() {
    createCanvas(400, 400);
}

class Ball {
    constructor(_p, _v, _r) {
        this.p = _p;
        this.v = _v;
        this.r = _r;
    }
}

class Block {
    constructor(_p, _r) {
        this.p = _p;
        this.r = _r;
    }
}
class Paddle {
    constructor(_p, _r) {
        this.p = _p;
        this.r = _r;
    }
}

class Vec2 {
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
    }
    add(b) {
        let a = this;
        return new Vec2(a.x + b.x, a.y + b.y);
    }
    mul(s) {
        let a = this;
        return new Vec2(s*a.x, s*a.y);
    }
    mag() {
        let a = this;
        return sqrt(a.x**2 + a.y**2);
    }
    sub(b) {
        let a = this;
        return new Vec2(a.x-b.x, a.y-b.y);
    }
    norm() {
        let a = this;
        return a.mul(1/a.mag());
    }
    dot(b) {
        let a = this;
        return a.x*b.x + a.y*b.y;
    }
    reflect(w) {
        let v = this;
        let cosTheta = v.mul(-1).dot(w) / (v.mul(-1).mag() * w.mag());
        let n = w.norm().mul(v.mag() * cosTheta);
        let r = v.add(n.mul(2));
        return r;
    }
}
let ball = new Ball(
    // ボールの位置
    new Vec2(114, 512),
    // ボールの速度
    new Vec2(240, -60),
    15
);

let blocks = [];
for (let i=0; i<15; i++) {
    let p = new Vec2(80*(i%5)+40, 80*Math.floor(i/5)+50);
    blocks.push(new Block(p, 25))
}

let paddle = new Paddle(new Vec2(200, 360), 30);

// 点数
let score = 0;

function draw() {
    // 速度に合わせてボールを移動させる
    ball.p = ball.p.add(ball.v.mul(1/60));
    // 左右壁で反射
    if ((ball.p.x > 385) || (ball.p.x < 15)) {
        // 反射ベクトルのx成分の変更
        ball.v.x = -ball.v.x;
        score += 1;
    }
    // 天井で反射
    if (ball.p.y < 15) {
        ball.v.y = -ball.v.y;
        score += 1;
    }
    // ボールとブロックの衝突判定
    for(let block of blocks) {
        let d = block.p.sub(ball.p).mag();
        if (d < (ball.r+block.r)) {
            let w = ball.p.sub(block.p);
            let r = ball.v.reflect(w);
            ball.v = r;
            // ブロックを消す
            blocks.splice(blocks.indexOf(block),1);
        }
    }
    paddle.p.x = mouseX;
    let d = paddle.p.sub(ball.p).mag();
        if (d < (ball.r+paddle.r)) {
            let w = ball.p.sub(paddle.p);
            let r = ball.v.reflect(w);
            ball.v = r;
            // めり込み防止
            ball.p = paddle.p.add(w.norm().mul(ball.r + paddle.r));
        }

    // 描画
    background(220);
    circle(ball.p.x, ball.p.y, 2*ball.r);

    for (let b of blocks) {
        circle(b.p.x, b.p.y, 2*b.r);
    }
    circle(paddle.p.x, paddle.p.y, 2*paddle.r);

    textSize(24)
    text(score, 350, 370);
}