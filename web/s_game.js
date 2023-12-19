//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width = 422;
canvas.height = 750;
document.body.appendChild(canvas); //body에 canvas를 자식으로 세팅
//이미지 세팅
let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
//점수표
let score = 0;
//우주선 좌표찍기
let spaceshipX = canvas.width / 2 - 32
let spaceshipY = canvas.height - 64
//게임종료 실행변수
let isGameOver = false; //true이면 게임종료, false이면 게임시작 

//이미지 불러오기 
function loadImage() {
    backgroundImage = new Image();
    spaceshipImage = new Image();
    bulletImage = new Image();
    enemyImage = new Image();
    gameOverImage = new Image();
    gemImage = new Image();

    backgroundImage.src = "images/space2.jpg";
    spaceshipImage.src = "images/icon_spaceship.png"
    bulletImage.src = "images/bullet.png";
    enemyImage.src = "images/stone.png";
    gameOverImage.src = "images/gameover.png";
    gemImage.src = "images/gem.png";

    backgroundImage.onload = checkImagesLoaded;
    spaceshipImage.onload = checkImagesLoaded;
    bulletImage.onload = checkImagesLoaded;
    enemyImage.onload = checkImagesLoaded;
    gameOverImage.onload = checkImagesLoaded;
    gemImage.onload = checkImagesLoaded;

}

// 이미지 로딩 관련 변수
let imagesLoaded = 0;
const totalImages = 6; // 로딩할 이미지의 총 개수

// 이미지 로딩이 완료된 후에 main 함수를 호출
function checkImagesLoaded() {
    imagesLoaded++;
    console.log(`Image loaded: ${imagesLoaded}/${totalImages}`);

    if (imagesLoaded === totalImages) {
        setupKeyboardListener();
        main();
        createEnemy();
    }
}

//총알 세팅
let bulletList = []; // 총알들을 저장하는 리스트
class Bullet {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.alive = false;
    }

    init() {
        this.x = spaceshipX + 8;
        this.y = spaceshipY;
        this.alive = true;
        bulletList.push(this);
    }

    updateKey() {
        if (score < 30) {
            this.y -= 5;
        } else if (score >= 30 && score < 60) {
            this.y -= 6;
        } else if (score >= 90) {
            this.y -= 7;
        }
    }

    checkHit() {
        for (let i = bulletList.length - 1; i >= 0; i--) {
            for (let j = enemyList.length - 1; j >= 0; j--) {
                if (
                    bulletList[i].y <= enemyList[j].y + 64 &&
                    bulletList[i].y >= enemyList[j].y &&
                    bulletList[i].x >= enemyList[j].x &&
                    bulletList[i].x <= enemyList[j].x + 64
                ) {
                    score++;
                    bulletList[i].alive = false;
                    enemyList.splice(j, 1);
                    bulletList.splice(i, 1);
                    break;
                }
            }
        }
    }
}

function createBullet() {
    let bullet = new Bullet();
    bullet.init();
}
//총알 그리기
function drawBullet() {
    for (let i = 0; i < bulletList.length; i++) {
        ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
}

function generateRandomValue(min, max) {
    let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
    return randomNumber;
}

//적군 생성하기
let enemyList = [];
class Enemy {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    init() {
        this.x = generateRandomValue(0, canvas.width - 64);
        this.y = 0;
        enemyList.push(this);
    }

    updateKey() {
        if (score < 30) {
            this.y += 1;
        } else if (score >= 30 && score < 60) {
            this.y += 1.5;
        } else if (score >= 90) {
            this.y += 1.75;
        } 
    }
}


//적군 그리기
function drawEnemy() {
    //console.log("Drawing enemies");
    for (let i = 0; i < enemyList.length; i++) {
        //console.log(`Enemy ${i} coordinates: (${enemyList[i].x}, ${enemyList[i].y})`);
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }
}

function createEnemy() {
    const interval = setInterval(function () {
        if (!isGameOver) {
            let enemy = new Enemy();
            enemy.init();
        } else {
            clearInterval(interval);
        }
    }, 1000);
}


//보석 생성하기
let gemList = [];
let gemCount = 0; //획득한 보석수(우주선과 보석 만나면 획득)
class Gem {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.alive = false;
    }

    init() {
        this.x = generateRandomValue(0, canvas.width - 64);
        this.y = 0;
        this.alive = true;
        gemList.push(this);
    }

    updateKey() {
        this.y += 3;
    }

    checkHit() {
        for (let i = 0; i < gemList.length; i++) {
            if (
                gemList[i].alive &&
                spaceshipX < gemList[i].x + 48 &&
                spaceshipX + 64 > gemList[i].x &&
                spaceshipY < gemList[i].y + 48 &&
                spaceshipY + 64 > gemList[i].y
            ) {
                gemCount++;
                gemList[i].alive = false;
                gemList.splice(i, 1);
            }
        }
    }
}

 //보석 그리기
function drawGem() {
    for (let i = 0; i < gemList.length; i++) {
        ctx.drawImage(gemImage, gemList[i].x, gemList[i].y);
    }
}

function createGem() {
    const interval = setInterval(function () {
        if (!isGameOver) {
            let gem = new Gem();
            gem.init();
        } else {
            clearInterval(interval);
        }
    }, 3000);
}

//UI 그리기
function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    drawEnemy();
    drawBullet();
    drawGem();
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
    ctx.fillStyle = "yellow";
    ctx.fillText("Gem: " + gemCount, 10, 40);
    if (isGameOver) {
        ctx.drawImage(gameOverImage, 0, 200, 422, 200);
    }
}

keysDown = []; //키이동값 배열
function setupKeyboardListener() {
    //우주선 이동
    document.addEventListener("keydown", function (event) {
        keysDown[event.key] = true;
        //console.log(event.keysDown); //눌린 키보드 출력
    });
    document.addEventListener("keyup", function (event) {
        keysDown[event.key] = false;

        if (event.key === " ") { //스페이스바 떼면 총알생성
            createBullet();
        }
    });
}

function updateEnemy() {
    if (!isGameOver) {
        for (let i = 0; i < enemyList.length; i++) {
            console.log(`Enemy position: (${enemyList[i].x}, ${enemyList[i].y})`);
            enemyList[i].updateKey();
            //적군이 캔버스 바닥에 닿으면 게임종료
            if (enemyList[i].y + 64 >= canvas.height) {
                isGameOver = true;
            }
            //적군이 우주선과 만나면 게임종료
            if (
                spaceshipX < enemyList[i].x + 64 &&
                spaceshipX + 64 > enemyList[i].x &&
                spaceshipY < enemyList[i].y + 64 &&
                spaceshipY + 64 > enemyList[i].y
            ) {
                isGameOver = true;
            }
        }
    }
}
function updateGem() {
    if (!isGameOver) {
        for (let i = 0; i < gemList.length; i++) {
            gemList[i].updateKey();
            gemList[i].checkHit();
        }
    }
}

function updateKey() {
    if (keysDown["ArrowLeft"]) {     //혹은 if(37 in keysDown){
        spaceshipX -= 7;
    }
    if (keysDown["ArrowRight"]) {
        spaceshipX += 7;
    }
    if (keysDown["ArrowUp"]) {
        spaceshipY -= 7;
    }
    if (keysDown["ArrowDown"]) {
        spaceshipY += 7;
    }
    if (spaceshipX <= 0) {  //우주선 왼쪽이동 제한
        spaceshipX = 0;
    }
    if (spaceshipX >= canvas.width - 64) { //우주선 오른쪽이동 제한
        spaceshipX = canvas.width - 64;
    }
    if (spaceshipY <= canvas.height / 2) {//우주선 위쪽이동 제한(캔버스 절반높이까지)
        spaceshipY = canvas.height / 2;
    }
    if (spaceshipY + 64 >= canvas.height) {//우주선 아래쪽이동 제한(캔버스 안까지)
        spaceshipY = canvas.height - 64;
    }
    //총알의 y좌표 업데이트하는 함수 호출 
    for (let i = 0; i < bulletList.length; i++) {
        if (bulletList[i].alive) {
            bulletList[i].updateKey();
            bulletList[i].checkHit();
            //화면 위로 벗어난 총알 제거
            if (bulletList[i].y < 0) {
                bulletList.splice(i, 1);
                i++;
            }
        }
    }
    //적의 y좌표 업데이트하는 함수 호출
    for (let i = 0; i < enemyList.length; i++) {
        enemyList[i].updateKey();
    }
}

function main() {
    updateKey(); //키이동후 좌표값 업데이트
    updateEnemy(); //적군이동후 좌표값 업데이트
    updateGem(); //보석이동후 좌표값 업데이트
    render(); //그려주기 - 계속 호출
    //console.log("animation calls main function");
    if (!isGameOver) { //게임중
        requestAnimationFrame(main); //main(자기자신) 계속 호출    
    }
}

function initGame() {
    loadImage();
    setupKeyboardListener();
    createEnemy();
    createGem();
    main();
}
// 게임 시작
initGame();
