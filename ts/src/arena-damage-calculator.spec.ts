/*arena-damage-calculator.spec.ts*/
import { ArenaDamageCalculator } from "./arena-damage-calculator";
import { Hero } from "./model/hero";
import { HeroElement } from "./model/hero-element";
import { Buff } from "./model/buff";

describe("Arena damage calculator", function() {
  let arena: ArenaDamageCalculator;
  beforeEach(() =>{
    arena = new ArenaDamageCalculator();
  });

   it("should inflict gross damage without bonus or buff", () => {
    const attacker = new Hero(HeroElement.Water, 100, 0, 0, 0, 1000);
    const defender = new Hero(HeroElement.Water, 0, 0, 0, 0, 1000);

    const result = arena.computeDamage(attacker, [defender]);

    expect(result[0].lp).toBe(900);
  });

  it("should reduce damage according to defense", () => {
    const attacker = new Hero(HeroElement.Water, 100, 0, 0, 0, 1000);
    const defender = new Hero(HeroElement.Water, 0, 750, 0, 0, 1000); // 750 DEF = -10% dégâts
    const result = arena.computeDamage(attacker, [defender]);

    const dmg = 100 * (1 - 750 / 7500); // 100 * 0.9 = 90
    expect(result[0].lp).toBe(910);
  });

  it("should always inflict a critical hit if CRTR = 100", () => {
    const attacker = new Hero(HeroElement.Water, 100, 0, 0, 100, 1000); // 100% crit
    const defender = new Hero(HeroElement.Water, 0, 0, 0, 0, 1000);
    const result = arena.computeDamage(attacker, [defender]);

    const dmg = (100 + (0.5 + 0 / 5000) * 100); // Critique = +50% parce que pas de leth
    expect(result[0].lp).toBe(850);
  });

  it("should add 25% damage if the attacker has the Attack buff", () => {
    const attacker = new Hero(HeroElement.Water, 100, 0, 0, 0, 1000);
    const defender = new Hero(HeroElement.Water, 0, 0, 0, 0, 1000);
    attacker.buffs.push(Buff.Attack);
    const result = arena.computeDamage(attacker, [defender]);

    expect(result[0].lp).toBe(875);
  });

  it("should reduce damage by 25% if the defender has the Defense buff", () => {
  const attacker = new Hero(HeroElement.Water, 100, 0, 0, 0, 1000);
  const defender = new Hero(HeroElement.Water, 0, 0, 0, 0, 1000);
  defender.buffs.push(Buff.Defense);
  const result = arena.computeDamage(attacker, [defender]);

  expect(result[0].lp).toBe(925);
});

});