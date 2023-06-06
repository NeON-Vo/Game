"use strict";

var lastKey = "";
window.addEventListener("keydown", function (e) {
  player.inventory = {
    crystal: false,
    vetki: false,
    ruda: false,
    koshka: false,
    koza: false
  };

  if (player.isInteracting) {
    switch (e.key) {
      case ' ':
        player.interactionAsset.dialogueIndex++;
        var _player$interactionAs = player.interactionAsset,
            dialogueIndex = _player$interactionAs.dialogueIndex,
            dialogue = _player$interactionAs.dialogue;

        if (dialogueIndex <= dialogue.length - 1) {
          document.querySelector('#characterDialogueBox').innerHTML = player.interactionAsset.dialogue[dialogueIndex];
          console.log(dialogue.length);
          return;
        } // finish conversation


        player.isInteracting = false;
        player.interactionAsset.dialogueIndex = 0;
        document.querySelector('#characterDialogueBox').style.display = 'none';
        break;
    }

    return;
  }

  var move = null;

  if (e.keyCode === 87 || e.keyCode === 38) {
    move = "up";
  } else if (e.keyCode === 65 || e.keyCode === 37) {
    move = "left";
  } else if (e.keyCode === 40 || e.keyCode === 83) {
    move = "down";
  } else if (e.keyCode === 39 || e.keyCode === 68) {
    move = "right";
  } else if (e.keyCode === 32) {
    move = "space";
  }

  switch (move) {
    case "up":
      keys.w.pressed = true;
      lastKey = "w";
      break;

    case "left":
      keys.a.pressed = true;
      lastKey = "a";
      break;

    case "down":
      keys.s.pressed = true;
      lastKey = "s";
      break;

    case "right":
      keys.d.pressed = true;
      lastKey = "d";
      break;

    case "space":
      //const p = portal[i];

      /*
      if (
      	player.position.x <= p.position.x + p.width &&
      	player.position.x + player.width >= p.position.x &&
      	player.position.y + player.height >= p.position.y &&
      	player.position.y <= p.position.y + p.height
      ) {
      	console.log("1");
      	p.play();
      
      } */
      if (!player.interactionAsset) return;

      var isIntroDialogue = function isIntroDialogue(character) {
        return !player["".concat(character, "Intro")] && player.interactionAsset.name === character;
      };

      var isLackOfItem = function isLackOfItem(item, character) {
        return !player.inventory[item] && player.interactionAsset.name === character && player["".concat(character, "Intro")];
      };

      var isQuestDone = function isQuestDone(character) {
        return player["".concat(character, "Quest")] && player.interactionAsset.name === character;
      }; // beginning the conversation


      var _dialogue = player.interactionAsset.introDialogue;

      if (isIntroDialogue("kyznec") || isIntroDialogue("koshatnik") || isIntroDialogue("stranij")) {
        _dialogue = player.interactionAsset.introDialogue;
      } else if (isLackOfItem("crystal", "koshatnik") || isLackOfItem("koshka") || isLackOfItem("vetki", "kyznec") || isLackOfItem("ruda", "kyznec") || isLackOfItem("koza", "kyznec")) {
        _dialogue = player.interactionAsset.errorDialogue;
      } else if (isQuestDone("kyznec") || isQuestDone("koshatnik") || isQuestDone("stranij")) {
        _dialogue = player.interactionAsset.outroQuest;
      } else {
        _dialogue = player.interactionAsset.endQuest;
      }

      console.log(_dialogue);
      player.interactionAsset.dialogue = _dialogue;
      keys.w.pressed = false;
      keys.s.pressed = false;
      keys.a.pressed = false;
      keys.d.pressed = false;
      console.log(player.interactionAsset);

      if (!player.kyznecIntro && player.interactionAsset.name === "kyznec") {
        player.kyznecIntro = true;
      }

      var firstMessage = _dialogue[0];
      document.querySelector('#characterDialogueBox').innerHTML = firstMessage;
      document.querySelector('#characterDialogueBox').style.display = 'flex';
      player.isInteracting = true;
      break;
  }
});
window.addEventListener("keyup", function (e) {
  var move = null;

  if (e.keyCode === 87 || e.keyCode === 38) {
    move = "up";
  } else if (e.keyCode === 65 || e.keyCode === 37) {
    move = "left";
  } else if (e.keyCode === 40 || e.keyCode === 83) {
    move = "down";
  } else if (e.keyCode === 39 || e.keyCode === 68) {
    move = "right";
  } else if (e.keyCode === 32) {
    move = "space";
  } else if (e.keyCode === 67) {
		move = "c"
	}

  switch (move) {
    case "up":
      keys.w.pressed = false;
      break;

    case "left":
      keys.a.pressed = false;
      break;

    case "down":
      keys.s.pressed = false;
      break;

    case "right":
      keys.d.pressed = false;
      break;
  }
});