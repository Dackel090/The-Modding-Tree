let modInfo = {
	name: "The Universal Tree",
	id: "tttt",
	author: "dackel09",
	pointsName: "Virtual Particles",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 0.5,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1.1",
	name: "Start of Nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1.1</h3><br>
		- started the game.<br>
		- Added everything.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	
	if (hasUpgrade('p', 11)) gain = gain.times(2)
	if (hasUpgrade('p', 12)) gain = gain.times(upgradeEffect('p', 12))
	if (hasUpgrade('p', 14)) gain = gain.times(upgradeEffect('p', 14))
	if (hasUpgrade('p', 15)) gain = gain.times(upgradeEffect('p', 15))
	if (hasUpgrade('p', 16)) gain = gain.times(3)
	if (hasUpgrade('p', 22)) gain = gain.mul(upgradeEffect('p', 22))
	if (hasMilestone("f", 0)) gain = gain.mul(2.5)
	if (hasMilestone('f', 2)) gain = gain.mul(getBuyableAmount('p', 16).add(getBuyableAmount('p', 17).add(getBuyableAmount('p', 18))).add(1))
	gain = gain.mul(buyableEffect('f', 11))
	gain = gain.pow(buyableEffect('f', 12))
	if (hasMilestone('p', 0)) gain = gain.pow(1.1)

	
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = ["The current end of the game is e110 Virtual Particles"
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e110"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}