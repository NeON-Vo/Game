const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 64 * 16; // 1024
canvas.height = 64 * 9; // 576

const offset = {
  x: -735,
  y: -650,
};
let itemZones = parse2D(itemsZonesData);
let boundaries = [];
let collisionsMap;
let collisionBlocks;
let image;
let background;
let foregroundImage;
let foreground;
let movables;
let renderables;
let lvl = 0;

const boundWidth = 48;
const boundHeight = 48;

let characters = [];

const kyznecImg = new Image();
kyznecImg.src = "./img/kyznec/Idle.png";

const koshatnikImg = new Image();
koshatnikImg.src = "./img/koshatnik/Idle.png";

const stranijImg = new Image();
stranijImg.src = "./img/stranij/Idle.png";

const itemImg = new Image();
itemImg.src = "./img/item.png";

const charactersMap = parse2D(charactersMapData);
const itemZonesMap = parse2D(itemsZonesData);

charactersMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    // 485 === stranniy
    if (symbol === 485) {
      characters.push(
        new Character({
          name: "koshatnik",
          position: {
            x: j * boundWidth + offset.x,
            y: i * boundHeight + offset.y,
          },
          image: stranijImg,
          frames: {
            max: 4,
            hold: 60,
          },
          scale: 1,
          animate: true,
          introDialogue: ["Привет! Я слышал тебе кое-что нужно?", "Я дам тебе руды если ты принесёшь мне кристалл..", "Мне так нравятся кристаллы, их блеск так завораживает.."],
          errorDialogue: ["Я жду кристалл..."],
          endDialogue: ["Спасибо тебе! Держи руду!", "Вы получили руду!", "И да, дерево найти не сложно, оно у тебя перед носом.."],
          outroDialogue: ["Дерево у тебя перед носом.."],
        }),
      );
    }
    // 487 === stranij
    else if (symbol === 487) {
      characters.push(
        new Character({
          name: "stranij",
          position: {
            x: j * boundWidth + offset.x,
            y: i * boundHeight + offset.y,
          },
          image: koshatnikImg,
          frames: {
            max: 4,
            hold: 60,
          },
          scale: 1,
          animate: true,
          introDialogue: [
            "Эй! Куда ты прёшь?!",
            "Ты испугал мою кошку!!",
            "Где она??"],
          errorDialogue: ["Найди мою кошку!!"],
          endDialogue: [
            "Погоди, этот почерк...",
            "Видимо тебе меч нужен? И судя по списку для меча тебе нужны полоски кожи?",
            "Держи! Ты хоть и испугал мою кошку, но потом нашёл же. Так что это бесплатно!",
            "Вы получили полоски кожи!",
          ],
          outroDialogue: ["Удачи на пути!"],
        }),
      );
    }
    // 486 === kyznec
    else if (symbol === 486) {
      characters.push(
        new Character({
          name: "kyznec",
          position: {
            x: j * boundWidth + offset.x,
            y: i * boundHeight + offset.y,
          },
          image: kyznecImg,
          frames: {
            max: 4,
            hold: 60,
          },
          scale: 1,
          animate: true,
          introDialogue: [
            "Доброе утро!",
            "Для твоих приключений тебе нужен ничейный занпакто! Держи, здесь написано всё что нужно тебе найти, а потом я выкую его тебе!!",
            "Вы получили список компонентов! (нажмите C для просмотра)",
          ],
          errorDialogue: ["Ты принёс не все компоненты."],
          endDialogue: ["Ты принёт все компненты! Молодец!!", "Подожди, теперь дело за мной.."],
          outroDialogue: ["А хорошая у меня работа получилась! Хе-хех)"],
        }),
      );
    }
  });
});

itemZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 424) {
      characters.push(
        new Character({
          name: "crystal",
          position: {
            x: j * boundWidth + offset.x,
            y: i * boundHeight + offset.y,
          },
          image: itemImg,
          scale: 1,
          introDialogue: ["Вы нашли кристалл!"],
        }),
      );
    } else if (symbol === 421) {
      characters.push(
        new Character({
          name: "vetki",
          position: {
            x: j * boundWidth + offset.x,
            y: i * boundHeight + offset.y,
          },
          image: itemImg,
          scale: 1,
          introDialogue: ["Вы подняли ветки дерева!"],
        }),
      );
    } else if (symbol === 422) {
      characters.push(
        new Character({
          name: "koshka",
          position: {
            x: j * boundWidth + offset.x,
            y: i * boundHeight + offset.y,
          },
          image: itemImg,
          scale: 1,
          introDialogue: ["Вы схватили кошку!"],
        }),
      );
    }
  });
});

const playerDownImage = new Image();
playerDownImage.src = "./img/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./img/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./img/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./img/playerRight.png";

let koshkaImg = new Image();
koshkaImg.src = "./img/koshka.png";

const koshka = new Sprite({
  position: {
    x: 600,
    y: 510,
  },
  image: koshkaImg,
  scale: 1,
  frames: {
    max: 1,
    hold: 10,
  },
});

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
  },
});
console.log(player);
const init = () => {
  boundaries = [];

  collisionsMap = parse2D(collisions_level1);
  collisionBlocks = createObjectsFrom2D(collisionsMap, charactersMap);
  console.log();
  foregroundImage = new Image();
  foregroundImage.src = "./img/foregroundObjects.png";

  image = new Image();
  image.src = "./img/Pellet Town.png";

  background = new Sprite({
    position: {
      x: offset.x,
      y: offset.y,
    },
    image: image,
  });

  foreground = new Sprite({
    position: {
      x: offset.x,
      y: offset.y,
    },
    image: foregroundImage,
  });

  movables = [background, ...boundaries, ...characters, foreground, koshka];
  renderables = [background, ...boundaries, ...characters, koshka, player, foreground];
};

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

function animate() {
  const animationId = window.requestAnimationFrame(animate);
  renderables.forEach((renderable) => {
    renderable.draw();
  });

  let moving = true;
  player.animate = false;
  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.up;

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: 0, y: 3 },
    });

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        player.animate = false;
        moving = false;
        break;
      }
    }

    if (moving) {
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
    }
  } else if (keys.a.pressed && lastKey === "a") {
    player.animate = true;
    player.image = player.sprites.left;

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: 3, y: 0 },
    });

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        player.animate = false;
        moving = false;
        break;
      }
    }

    if (moving) {
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
    }
  } else if (keys.s.pressed && lastKey === "s") {
    player.animate = true;
    player.image = player.sprites.down;

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: 0, y: -3 },
    });

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        player.animate = false;
        moving = false;
        break;
      }
    }

    if (moving) {
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
    }
  } else if (keys.d.pressed && lastKey === "d") {
    player.animate = true;
    player.image = player.sprites.right;

    checkForCharacterCollision({
      characters,
      player,
      characterOffset: { x: -3, y: 0 },
    });

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        player.animate = false;
        moving = false;
        break;
      }
    }

    if (moving) {
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
    }
  }
}
init();
animate();
