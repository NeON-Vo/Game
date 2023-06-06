let lastKey = "";

let inventory = itemsData;

let quests = questData;

document.querySelector('#endScreen').addEventListener('click', () => {
	localStorage.clear();
	location.reload()
})

const checkQuests = function() {
	if(
		(quests.kyznecIntro && !quests.kyznecQuest) ||
		(quests.koshatnikIntro && !quests.koshatnikIntro) ||
		(quests.stranijIntro && !quests.stranijQuest)
	) {
		let kyznecQuest = quests.kyznecIntro && !quests.kyznecQuest ? "Изготовление меча" : '';
		let stranijQuest = quests.stranijIntro && !quests.kyznecQuest ? "Кошка" : '';
		let koshatnikQuest = quests.koshatnikIntro && !quests.koshatnikQuest ? "Кристалл" : '';
		let unfinishedQuests = [];
		if (kyznecQuest) unfinishedQuests.push(kyznecQuest)
		if (stranijQuest) unfinishedQuests.push(stranijQuest)
		if (koshatnikQuest) unfinishedQuests.push(koshatnikQuest)
		let unfinishedQuestsDialogue = '';
		for (let i = 0; i < unfinishedQuests.length - 1; i++) {
			if (unfinishedQuests[i]) unfinishedQuestsDialogue += unfinishedQuests[i] + ', '
		}
		unfinishedQuestsDialogue += unfinishedQuests[unfinishedQuests.length - 1]
		

		player.reloadedDialogue = true;
		document.querySelector("#characterDialogueBox").innerHTML = `Ты принёс не все компоненты: ${unfinishedQuestsDialogue}`;
		document.querySelector('#characterDialogueBox').style.display = 'flex';
	}
}



window.onload = function() {
	let loaded = localStorage.getItem('loaded');
	if(loaded) {
		checkQuests()
	} else {
		localStorage.setItem('loaded', "true")
	}
}

window.addEventListener("keydown", (e) => {

	if (player.isInteracting) {
		switch (e.key) {
		  case ' ':
			player.interactionAsset.dialogueIndex++
			
			const { dialogueIndex, dialogue } = player.interactionAsset
			if (dialogueIndex <= dialogue.length - 1) {
				document.querySelector('#characterDialogueBox').innerHTML =
				player.interactionAsset.dialogue[dialogueIndex]
			  	return
			}

			// finish conversation
			player.isInteracting = false
			player.interactionAsset.dialogueIndex = 0
			document.querySelector('#characterDialogueBox').style.display = 'none'
			if (quests.kyznecQuest) {
				document.querySelector('#gameDiv').style.display = 'none'
				document.querySelector('#endScreen').style.display = 'flex'
			}
	
			break
		}
		return
	}
	if (player.watchingkomponents) {
		switch (e.keyCode) {
			case 67: 
				player.watchingkomponents = false
				document.querySelector('#komponentsImg').style.display = 'none'
				document.querySelector('#characterDialogueBox').style.display = 'none'
				break;
			case 27: 
				player.watchingkomponents = false
				document.querySelector('#komponentsImg').style.display = 'none'
				document.querySelector('#characterDialogueBox').style.display = 'none'
				break;
		}
		return
	}
	if (player.reloadedDialogue) {
		switch (e.key) {
		  case ' ':
			player.reloadedDialogue = false
			document.querySelector('#characterDialogueBox').style.display = 'none'
	
			break
		}
		return
	}

	let move = null;

	if(e.keyCode === 87 || e.keyCode === 38) {
		move = "up";
	} else if (e.keyCode === 65 || e.keyCode === 37) {
		move = "left"
	} else if (e.keyCode === 40 || e.keyCode === 83) {
		move = "down"
	} else if (e.keyCode === 39 || e.keyCode === 68) {
		move = "right"
	} else if (e.keyCode === 32) {
		move = "space"
	} else if (e.keyCode === 67) {
		move = "c"
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
			if (!player.interactionAsset) return

			// beginning the conversation
			let dialogue = player.interactionAsset.introDialogue
			if (
				isIntroDialogue("kyznec") || 
				(isIntroDialogue("stranij") && quests.kyznecIntro) || 
				(isIntroDialogue("koshatnik") && quests.kyznecIntro) ||
				notInInventory("crystal") ||
				notInInventory("koshka") ||
				notInInventory("vetki")
			) {
				dialogue = player.interactionAsset.introDialogue
			} else if ( 
				isLackOfItem("crystal", "koshatnik") || 
				isLackOfItem("koshka", "stranij") || 
				(
					isLackOfItem("vetki", "kyznec") || 
					isLackOfItem("ruda", "kyznec") || 
					isLackOfItem("koza", "kyznec")
				)
			) {
				dialogue = player.interactionAsset.errorDialogue 
			} else if (
				isQuestDone("kyznec") || 
				isQuestDone("koshatnik") || 
				isQuestDone("stranij")
			) {
				dialogue = player.interactionAsset.outroDialogue
			} else if (
				(isIntroDialogue("koshatnik") && !quests.kyznecIntro) || 
				(isIntroDialogue("stranij") && !quests.kyznecIntro)
			) {
				dialogue = ['Привет..']
			}
			 else {
				dialogue = player.interactionAsset.endDialogue
			}
			if (
				isInInventory("crystal", "koshatnik") ||
				isInInventory("koshka", "stranij") || 
				isInInventory("vetki", "kyznec")
			) return
			player.interactionAsset.dialogue = dialogue
			keys.w.pressed = false
			keys.s.pressed = false
			keys.a.pressed = false
			keys.d.pressed = false

			checkIntroDialogue('kyznec');
			checkIntroDialogue('koshatnik');
			checkIntroDialogue('stranij');

			checkForItem('koshka');
			checkForItem('crystal');
			checkForItem('vetki');

			if (quests.koshatnikIntro && player.interactionAsset.name === "koshatnik" && inventory.crystal) {
				localStorage.setItem('ruda', 'true')
				inventory.ruda = true
				localStorage.setItem('koshatnikQuest', 'true')
				quests.koshatnikQuest = true
			}
			else if (quests.kyznecIntro && player.interactionAsset.name === "kyznec" && 
			inventory.koza && inventory.ruda && inventory.vetki) {
				localStorage.setItem('kyznecQuest', "true")
				quests.kyznecQuest = true
				
			}
			else if (quests.stranijIntro && player.interactionAsset.name === "stranij" && inventory.koshka) {
				localStorage.setItem('koza', 'true')
				inventory.koza = true
				localStorage.setItem('stranijQuest', 'true')
				quests.stranijQuest = true
			} 
			
			const firstMessage = dialogue[0]
			document.querySelector('#characterDialogueBox').innerHTML = firstMessage
			document.querySelector('#characterDialogueBox').style.display = 'flex'
			player.isInteracting = true

			break;
		case "c":
			if (inventory.komponents) {
				keys.w.pressed = false;
				keys.s.pressed = false;
				keys.a.pressed = false;
				keys.d.pressed = false;
				document.querySelector('#komponentsImg').style.display = 'flex';
				player.watchingkomponents = true;
			} else {
				const firstMessage = 'Кто ты?'
				document.querySelector('#characterDialogueBox').innerHTML = firstMessage
				document.querySelector('#characterDialogueBox').style.display = 'flex'
				player.watchingkomponents = true
			}
			
			break;
	}
});

window.addEventListener("keyup", (e) => {

	let move = null;

	if(e.keyCode === 87 || e.keyCode === 38) {
		move = "up";
	} else if (e.keyCode === 65 || e.keyCode === 37) {
		move = "left"
	} else if (e.keyCode === 40 || e.keyCode === 83) {
		move = "down"
	} else if (e.keyCode === 39 || e.keyCode === 68) {
		move = "right"
	} else if (e.keyCode === 32) {
		move = "space"
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
