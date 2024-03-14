addLayer("p", {
    name: "expansion", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "e", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFE88F",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "energy", // Name of prestige currency
    baseResource: "virtual particles", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 13)) mult = mult.times(upgradeEffect('p', 13)) 
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration(){
        
        let generation = new Decimal(buyableEffect('p', 16))
        return generation
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],


    upgrades: {
        11: {
            title: "quantum fluctuations",
            description: "doubles virtual particle output",
            cost: new Decimal(5),
        },
        12: {
            title: "increased quantum foam density",
            description: "increases virtual particle gain by energy",
            cost: new Decimal(10),  
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },

        13: {
            title: "antimatter matter annihilations",
            description: "reduced energy cost using virtual particles",
            cost: new Decimal(25),
            effect() {
                return player.points.add(1).pow(0.2)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" },
        },

        15: {
            title: "light atomic fission",
            description: "increases virtual particle gain by virtual particles",
            cost: new Decimal(1000),
            effect() {
                return player.points.add(1).pow(0.075)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" },
        },

        14: {
            title: "elementary particle formation",
            description: "unlocks fabricators",
            cost: new Decimal(100)
        
        },

    },

    buyables: {
        16: {
            cost(x) { return new Decimal(new Decimal(100).add(new Decimal(x).pow(2.4))) },
            display() { return "Fabricates energy based on collectable energy. " + format(tmp[this.layer].buyables[this.id].effect) + "x being generated currently" + "<br>cost: " + this.cost()},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(x) { return new Decimal(x).pow(.5).div(3)

            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title(){
                return format(getBuyableAmount(this.layer, this.id), 0) + " Proton Fabricators"
            }
        },
    },

    microtabs: {
        stuff: {
            "Upgrades": {
                content: [
                    ["blank", "16px"],
                    ["row",[["upgrade", 11], ['upgrade', 12], ['upgrade', 13], ['upgrade', 14]]],
                    ["row",[['upgrade', 15]]],
                    ["blank", "16px"],

                ]
            },
            "Fabricators": {
                unlocked: () => hasUpgrade('p', 14),
                content: [
                    ["blank", "16px"],
                    "buyables"
                ]
            },
        },
        
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        ["blank", "25px"],
        ["blank", "15px"],
        ["microtabs", "stuff"],
        ["blank", "35px"],
    ],
    

    layerShown(){return true}
})
