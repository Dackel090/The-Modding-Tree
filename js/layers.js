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
        if (hasMilestone('p', 1)) mult = mult.times(1.1)
        return mult
    },

    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("f", 4) && resettingLayer == "f")
            keep.push("upgrades")
        if (layers[resettingLayer].row > this.row)
            layerDataReset("p", keep)
    },

    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },

    passiveGeneration(){
        
        let generation = new Decimal(buyableEffect('p', 16))
        generation = generation.add(buyableEffect('p', 17))
        generation = generation.add(buyableEffect('p', 18))
        generation = generation.mul(buyableEffect('f', 13))
        generation = generation.pow(buyableEffect('f', 14))
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
                return player[this.layer].points.add(1).pow(0.33)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },

        13: {
            title: "antimatter matter annihilations",
            description: "reduced energy cost using virtual particles",
            cost: new Decimal(20),
            effect() {
                return player.points.add(1).pow(0.1)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        23:{
            title: "4 universal forces",
            description: "unlocks milestones for this layer",
            cost: new Decimal(120)
        },  

        14: {
            title: "energy field excitations",
            description: "further increases virtual particle gain by energy",
            cost: new Decimal(75),
            effect(){
                return player[this.layer].points.add(1).pow(.5)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+'x'},
        },

        15: {
            title: "elementary particle formation",
            description: "increases virtual particle gain by virtual particles",
            cost: new Decimal(1000),
            effect() {
                return player.points.add(1).pow(0.075)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        16: {
            title: "quark binding",
            description: "triples virtual particle output",
            cost: new Decimal(250)

        },

        21: {
            title: "electron stabilization",
            description: "unlocks energy fabricators",
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
            cost(x) { return new Decimal(new Decimal(125).mul(new Decimal(2).pow(new Decimal(x)))).pow(1.1)},
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
            cost(x) { return new Decimal(new Decimal(1000).mul(new Decimal(3).pow(new Decimal(x).mul(2)))).pow(1.3)},
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
                return new Decimal(new Decimal(250000).mul(new Decimal(5).pow(new Decimal(x).mul(2)))).pow(1.2)
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
    milestones:{
        0: {
            requirementDescription: "500 Energy - Weak Force",
            effectDescription: "Virtual Particle gain ^1.1",
            done(){
                return player[this.layer].points.gte(500)
            },
        },
        1:{
            requirementDescription: "100000 Energy - Strong Force",
            effectDescription: "Increases Energy gain",
            done(){
                return player[this.layer].points.gte(100000)
            },
        },
        2:{
            requirementDescription: "5e10 Energy - Electromagnetic Force",
            effectDescription: "Decreases the cost requirement for matter",
            done(){
                return player[this.layer].points.gte(5e10)
            },
        },
        3:{
            requirementDescription: "1e21 Energy - Gravitational Force",
            effectDescription: "Unlocks a new layer",
            done(){
                return player[this.layer].points.gte(1e21)
            },
        },
    },

    microtabs: {
        stuff: {
            "Upgrades": {
                content: [
                    ["blank", "16px"],
                    ["row",[["upgrade", 11], ['upgrade', 12], ['upgrade', 13], ['upgrade', 14]]],
                    ["row",[['upgrade', 23], ['upgrade', 16], ['upgrade', 15]]],
                    ["row", [['upgrade', 21], ["upgrade", 22]]],
                    ["blank", "16px"],

                ]
            },

            "Milestones":{
                unlocked: () => hasUpgrade('p', 23),
                content: [
                    ["blank", "16px"],
                    "milestones"
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
    exponent: 1.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasMilestone('p', 2)) mult = mult.times(.9)
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
    branches:[['p', 1]],
    

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
            requirementDescription: "10 Matter",
            effectDescription: "Increases Virtual Particle gain by amount of Fabricators owned",
            done(){
                return player[this.layer].points.gte(10)
            },
        },
        3:{
            requirementDescription: "20 Matter",
            effectDescription: "Unlocks basic elements",
            done(){
                return player[this.layer].points.gte(20)
            },
        },
        4:{
            requirementDescription: "35 Matter",
            effectDescription: "Keep Energy upgrades on collecting energy",
            done(){
                return player[this.layer].points.gte(35)
            },
        },
    
    },

    buyables:{
        11:{
            cost(x){return new Decimal(x).add(1)},
            display(){return "Increases Virtual Particle gain by amount owned. " +"<br>" + format(tmp[this.layer].buyables[this.id].effect)+"x boost currently"+"<br>cost: "+ this.cost()},
            canAfford(){return player[this.layer].points.gte(this.cost())},
            effect(x){return new Decimal(x).add(1)},
            buy(){
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title() {
                return format(getBuyableAmount(this.layer, this.id), 0) + " Hydrogen 1"
            },
        },  
        12:{
            cost(x){return new Decimal(x).add(1)},
            display(){return "Increases Virctual Particle gain by amount owned. " + "<br> ^" +format(tmp[this.layer].buyables[this.id].effect)+" boost currently"+"<br>cost: "+ this.cost()},
            canAfford(){return player[this.layer].points.gte(this.cost())},
            effect(x){return new Decimal(x).div(25).add(1)},
            buy(){
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            title(){return format(getBuyableAmount(this.layer, this.id), 0) + " Hydrogen 2 (Deuterium)"},
        },
        13:{
            cost(x){return new Decimal(x).mul(2).add(5)},
            display(){return "Increases passive Energy gain by amount owned. " + "<br>" +format(tmp[this.layer].buyables[this.id].effect)+"x boost currently"+"<br>cost: "+ this.cost()},
            canAfford(){return player[this.layer].points.gte(this.cost())},
            effect(x){return new Decimal(x).add(1)},
            buy(){
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            title(){return format(getBuyableAmount(this.layer, this.id), 0) + " Helium 2"},
        },
        14:{
            cost(x){return new Decimal(x).mul(2).add(5)},
            display(){return "Increases passive Energy gain by amount owned. " + "<br> ^" +format(tmp[this.layer].buyables[this.id].effect)+" boost currently"+"<br>cost: "+ this.cost()},
            canAfford(){return player[this.layer].points.gte(this.cost())},
            effect(x){return new Decimal(x).div(50).add(1)},
            buy(){
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))

            },
            title(){return format(getBuyableAmount(this.layer, this.id), 0) + "  Helium 3"},
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
    microtabs: {
        stuff: {
            "Milestones": {
                content: [
                    ["blank", "16px"],
                    "milestones"

                ]
            },
            "Elements": {
                unlocked: () => hasMilestone('f', 3),
                content: [
                    ["blank", "16px"],
                    ["row",[['buyable', 11], ['buyable', 12]]],
                    ["row",[["buyable", 13], ['buyable', 14]]],
                ]
            },
        },
        
    },

})

addLayer("g", {
    name: "gravity",
    symbol: "g",
    position: 2,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#452a85",
    requires: new Decimal(1e21), // Can be a function that takes requirement increases into account
    resource: "gravity", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: .25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },

    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "g", description: "G: Reset for gravity", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    layerShown(){
        return hasMilestone('p', 3) || this.layer.points > 0 || hasMilestone(this.layer, 0)
    },
    branches:[['p', 1]],

    upgrades: {
        11:{
            title: "gravity well",
            description: "increases virtual particle gain by gravity",
            cost: new Decimal(10),  
            effect() {
                return player[this.layer].points.add(1).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },

        12:{
            title: "gravitational waves",
            description: "reduces the cost of matter by points",
            cost: new Decimal(1000),
            effect(){
                return new Decimal(1).sub(player.points.pow(.009).sub(player.points.pow(.0091)))
            },
            effectDisplay(){return format(upgradeEffect(this.layer, this.id))+"x"},
        },
             
    },

    milestones:{
        0: {
            requirementDescription: "1 Gravity",
            effectDescription: "keep this layer unlcocked when reseting",
            done(){
                return player[this.layer].points.gte(1)
            },
        },
    },
    microtabs: {
        stuff: {

            "Upgrades": {
                content: [
                    ["blank", "16px"],
                    ["row",[['upgrade', 11], ['upgrade', 12]]],
                    ["blank", "16px"],
                ]
            },
            "Milestones": {
                content: [
                    ["blank", "16px"],
                    "milestones"

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


})