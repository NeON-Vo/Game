const isIntroDialogue = function (character) {
  return !quests[`${character}Intro`] && player.interactionAsset.name === character;
};

const notInInventory = function (item) {
  return !inventory[`${item}`] && player.interactionAsset.name === item;
};

const isInInventory = function (item, character) {
  return (inventory[`${item}`] && player.interactionAsset.name === item) || (!quests[`${character}Intro`] && player.interactionAsset.name === item);
};

const isLackOfItem = function (item, character) {
  return !inventory[item] && player.interactionAsset.name === character && quests[`${character}Intro`];
};

const isQuestDone = function (character) {
  return quests[`${character}Quest`] && player.interactionAsset.name === character;
};

function checkIntroDialogue(character) {
  if (!quests[`${character}Intro`] && player.interactionAsset.name === character) {
    localStorage.setItem(`${character}Intro`, "true");
    quests[`${character}Intro`] = true;
  }

  if (quests.kyznecIntro) {
    localStorage.setItem("komponents", "true");
    inventory.komponents = true;
  }
  if (!quests.kyznecIntro && player.interactionAsset.name !== "kyznec") quests[`${character}Intro`] = false;
}

function checkForItem(item) {
  if (!inventory[`${item}`] && player.interactionAsset.name === item) {
    localStorage.setItem(`${item}`, "true");
    inventory[`${item}`] = true;
  }
  if (inventory.koshka) {
    koshka.opacity = 0;
    boundaries.splice(
      boundaries.findIndex((el) => el.name === 1030),
      1,
    );
  }
}
