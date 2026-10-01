import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

class LemonadeStand {
    price: number;

    cups: number;
    ice: number;
    lemons: number;
    sugar: number;

    money: number;
    day: number;

    lemonsPerCup: number;
    sugarPerCup: number;
    icePerCup: number;

    constructor() {
        this.price = 0;
        this.money = 20;
        this.day = 1;

        this.cups = 0;
        this.ice = 0;
        this.lemons = 0;
        this.sugar = 0;

        this.lemonsPerCup = 1;
        this.sugarPerCup = 1;
        this.icePerCup = 1;
    }

    canMakeCup(): boolean {
        return (
            this.cups >= 1 &&
            this.lemons >= this.lemonsPerCup &&
            this.sugar >= this.sugarPerCup &&
            this.ice >= this.icePerCup
        );
    }

    sellCup(): boolean {
        if (!this.canMakeCup()) {
            return false;
        }

        this.cups -= 1;
        this.lemons -= this.lemonsPerCup;
        this.sugar -= this.sugarPerCup;
        this.ice -= this.icePerCup;

        this.money += this.price;

        return true;
    }

    buySupply(type: string, quantity: number, unitPrice: number): boolean {
        const cost = quantity * unitPrice;

        if (cost > this.money) {
            return false;
        }

        this.money -= cost;

        if (type === "cups") {
            this.cups += quantity;
        } else if (type === "ice") {
            this.ice += quantity;
        } else if (type === "lemons") {
            this.lemons += quantity;
        } else if (type === "sugar") {
            this.sugar += quantity;
        }

        return true;
    }

    setPrice(price: number) {
        this.price = price;
    }

    makeLemonade(cups: number) {
        this.cupsMade = cups;
    }

    runDay(customers: number) {
        let sold = 0;

        for (let i = 0; i < customers; i++) {
            if (this.sellCup()) {
                sold++;
            } else {
                break;
            }
        }

        console.log(`Customers: ${customers}`);
        console.log(`Sold: ${sold} cups`);
        console.log(`Cups left: ${this.cups}`);
        console.log(`Ice left: ${this.ice}`);
        console.log(`Lemons left: ${this.lemons}`);
        console.log(`Sugar left: ${this.sugar}`);
        console.log(`Cash balance: $${this.money}`);

        this.day++;
    }
}



async function main() {
    const rl = createInterface({ input, output });

    const stand = new LemonadeStand();

    let keepPlaying = true;

    while (keepPlaying) {
        console.log(`\nDay ${stand.day}`);

        const temperature = Math.floor(Math.random() * 31) + 60;
        console.log(`Weather: ${temperature}°F`);

        let customers: number;

        if (temperature >= 85) {
            customers = Math.floor(Math.random() * 11) + 15;
        } else if (temperature >= 75) {
            customers = Math.floor(Math.random() * 11) + 8;
        } else {
            customers = Math.floor(Math.random() * 8) + 3;
        }

        const cupPrice = Math.floor(Math.random() * 3) + 1;
        const icePrice = Math.floor(Math.random() * 3) + 1;
        const lemonPrice = Math.floor(Math.random() * 3) + 1;
        const sugarPrice = Math.floor(Math.random() * 3) + 1;

        console.log(`Cups: $${cupPrice} each`);
        console.log(`Ice: $${icePrice} each`);
        console.log(`Lemons: $${lemonPrice} each`);
        console.log(`Sugar: $${sugarPrice} each`);

        let purchaseComplete = false;

        while (!purchaseComplete) {
            console.log(`Current cash: $${stand.money}`);

            const cupsToBuy = Number(
                await rl.question("How many cups do you want to buy? ")
            );

            const iceToBuy = Number(
                await rl.question("How much ice do you want to buy? ")
            );

            const lemonsToBuy = Number(
                await rl.question("How many lemons do you want to buy? ")
            );

            const sugarToBuy = Number(
                await rl.question("How much sugar do you want to buy? ")
            );

            const totalCost =
                cupsToBuy * cupPrice +
                iceToBuy * icePrice +
                lemonsToBuy * lemonPrice +
                sugarToBuy * sugarPrice;

            console.log(`Total cost: $${totalCost}`);

            if (totalCost > stand.money) {
                console.log("Not enough money. Please choose smaller quantities.\n");
            } else {
                stand.buySupply("cups", cupsToBuy, cupPrice);
                stand.buySupply("ice", iceToBuy, icePrice);
                stand.buySupply("lemons", lemonsToBuy, lemonPrice);
                stand.buySupply("sugar", sugarToBuy, sugarPrice);

                purchaseComplete = true;
            }
        }

        const priceInput = await rl.question("Price per cup: $");
        stand.setPrice(Number(priceInput));

        stand.runDay(customers);

        const answer = await rl.question("Play another day? (y/n): ");
        keepPlaying = answer.toLowerCase() === "y";
    }

    rl.close();
}

main();


