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
        if (hasMilestone("f", 1)) mult = mult.times(player.f.points.pow(.67))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration(){
        
        let generation = new Decimal(buyableEffect('p', 16))
        generation = generation.add(buyableEffect('p', 17))
        return generation
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for energy", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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
                return player.points.add(1).pow(0.1)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" },
        },

        14: {
            title: "energy field excitations",
            description: "further increases virtual particle gain by energy",
            cost: new Decimal(100),
            effect(){
                return player[this.layer].points.add(1).mul(2).pow(.5)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+'x'},
        },

        15: {
            title: "elementary particle formation",
            description: "increases virtual particle gain by virtual particles",
            cost: new Decimal(750),
            effect() {
                return player.points.add(1).pow(0.08)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        16: {
            title: "quark binding",
            description: "triples virtual particle output",
            cost: new Decimal(250)

        },

        21: {
            title: "light atomic fusion",
            description: "unlocks fabricators",
            cost: new Decimal(5000)
        
        },
        22: {
            title: "universal cooling",
            description: "increases virtual particle gain by energy and virtual particles",
            cost: new Decimal(75000),
            effect() {
                return player.points.add(player[this.layer].points).add(1).pow(.05).mul(1.5)
            },
            effectDisplay(){return format(upgradeEffect(this.layer, this.id))+"x"},
        },

    },

    buyables: {
        16: {
            cost(x) { return new Decimal(new Decimal(125).mul(new Decimal(2).pow(new Decimal(x).mul(.8)))).sub(1)},
            display() { return "Fabricates energy based on collectable energy. " + format(tmp[this.layer].buyables[this.id].effect) + "x being generated currently" + "<br>cost: " + this.cost()},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            effect(x) { return new Decimal(x).pow(.4).div(10)

            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title(){
                return format(getBuyableAmount(this.layer, this.id), 0) + " Proton Fabricators"
            }
        },
        17: {
            cost(x) { return new Decimal(new Decimal(1000).mul(new Decimal(3).pow(new Decimal(x))))},
            display(){ return "Fabricates Energy based on collectable Energy " + format(tmp[this.layer].buyables[this.id].effect)+"x being generated currently"+ "<br>cost:" + this.cost()},
            canAfford() {return player[this.layer].points.gte(this.cost())},
            effect(x) {return new Decimal(x).pow(.4).div(5)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " Neutron Fabricators"
            },
        },
        18: {
            cost(x){ 
                return new Decimal(new Decimal(250000).mul(new Decimal(4).pow(new Decimal(x))))
            },
            display() { return "Fabricates Energy based on collectable Energy " + format(tmp[this.layer].buyables[this.id].effect)+"x being generated currently"+"<br>cost: "+ this.cost()},
            canAfford(){ return player[this.layer].points.gte(this.cost())},
            effect(x){ return new Decimal(x).pow(.67).div(5)},
            buy(){
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " Electron Orbital Fabricators"
            },
        },
    },

    microtabs: {
        stuff: {
            "Upgrades": {
                content: [
                    ["blank", "16px"],
                    ["row",[["upgrade", 11], ['upgrade', 12], ['upgrade', 13], ['upgrade', 14]]],
                    ["row",[['upgrade', 16], ['upgrade', 15]]],
                    ["row", [['upgrade', 21], ["upgrade", 22]]],
                    ["blank", "16px"],

                ]
            },
            "Fabricators": {
                unlocked: () => hasUpgrade('p', 21),
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

addLayer("f", {
    name: "formation",
    symbol: "f",
    position: 1,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#52fadb",
    requires: new Decimal(1e9), // Can be a function that takes requirement increases into account
    resource: "matter", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "F: Reset for matter", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    layerShown(){return true},
    

    milestones: {
        0: {
            requirementDescription: "1 Matter",
            effectDescription: "Virtual Particle gain x2.5",
            done(){
                return player[this.layer].points.gte(1)
            },
        },

        1: {
            requirementDescription: "3 Matter",
            effectDescription: "Increases Energy gain by unspent matter",
            done(){
                return player[this.layer].points.gte(3)
            },
        },
        2:{
            requirementDescription: "10 matter",
            effectDescription: "Increases Virtual Particle gain by amount of Fabricators owned",
            done(){
                return player[this.layer].points.gte(10)
            },
        },
    
    },
})