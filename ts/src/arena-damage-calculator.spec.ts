/*arena-damage-calculator.spec.ts*/
import { ArenaDamageCalculator } from "./arena-damage-calculator";
import { Hero } from "./model/hero";
import { HeroElement } from "./model/hero-element";
import { Buff } from "./model/buff";

describe("Arena damage calculator", function () {
  let arena: ArenaDamageCalculator;
  beforeEach(() => {
    arena = new ArenaDamageCalculator();
  });
  it("should return an defender", () => {
    const attacker = new Hero(HeroElement.Water, 100, 0, 0, 0, 1000);
    const defender = new Hero(HeroElement.Water, 0, 0, 0, 0, 1000);

    const result = arena.computeDamage(attacker, [defender]);

    expect(result.length).toBe(1);
  })
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
  })

  it("should combine the Attack buff with a critical hit", () => {
    const attacker = new Hero(HeroElement.Water, 100, 0, 0, 100, 1000);
    attacker.buffs.push(Buff.Attack);
    const defender = new Hero(HeroElement.Water, 0, 0, 0, 0, 1000);

    const defenders = arena.computeDamage(attacker, [defender]);

    // Dégâts normaux sur critique : 100 + (0.5 * 100) = 150
    // Buff attaque : +25% de dégâts => +25 sur base et +25% sur bonus critique
    // Dégâts supplémentaires : (100 * 0.25) + (50 * 0.25) = 25 + 12.5 = 37.5
    // Total : 150 + 37.5 = 187.5 → arrondi vers le bas → 187
    expect(defenders[0].lp).toBe(813);
  });

  it("should have 3 defenders", () => {
    const alicia = new Hero(HeroElement.Water, 1, 1, 1, 1, 1);
    const defender1 = new Hero(HeroElement.Fire, 100, 100, 100, 100, 100);
    const defender2 = new Hero(HeroElement.Earth, 100, 100, 100, 100, 100);
    const defender3 = new Hero(HeroElement.Water, 100, 100, 100, 100, 100);

    expect(arena.computeDamage(alicia, [defender1, defender2, defender3]).length).toBe(3);
  })

  it("should compute damage correctly when hero malus", () => {
    const alicia = new Hero(HeroElement.Fire, 100, 0, 0, 0, 1000);
    const bob = new Hero(HeroElement.Water, 100, 0, 0, 0, 1000);
    const charlie = new Hero(HeroElement.Earth, 100, 0, 0, 0, 1000);

    const result1 = arena.computeDamage(alicia, [bob]);
    const result2 = arena.computeDamage(bob, [charlie]);
    const result3 = arena.computeDamage(charlie, [alicia]);

    expect(result1[0].lp).toEqual(1000 - 100 * 0.8);
    expect(result1[0].element).toBe(HeroElement.Water);
    expect(result2[0].lp).toEqual(1000 - 100 * 0.8);
    expect(result2[0].element).toBe(HeroElement.Earth);
    expect(result3[0].lp).toEqual(1000 - 100 * 0.8);
    expect(result3[0].element).toBe(HeroElement.Fire);
  });

  it("should not lower LPs below 0", () => {
    const attacker = new Hero(HeroElement.Water, 5000, 0, 0, 0, 1000);
    const defender = new Hero(HeroElement.Water, 0, 0, 0, 0, 10);
    const result = arena.computeDamage(attacker, [defender]);

    expect(result[0].lp).toBe(0);
  });

  it("should not attack a hero already at 0 LP", () => {
    const attackerWater = new Hero(HeroElement.Water, 100, 0, 0, 0, 1000);
    const attackerFire = new Hero(HeroElement.Fire, 100, 0, 0, 0, 1000);
    const attackerEarth = new Hero(HeroElement.Earth, 100, 0, 0, 0, 1000);
    const dead = new Hero(HeroElement.Water, 0, 0, 0, 0, 0);
    const alive1 = new Hero(HeroElement.Water, 0, 0, 0, 0, 1000);
    const alive2 = new Hero(HeroElement.Water, 0, 0, 0, 0, 1000);
    const alive3 = new Hero(HeroElement.Water, 0, 0, 0, 0, 1000);

    const defenders1 = arena.computeDamage(attackerWater, [dead, alive1]);
    const defenders2 = arena.computeDamage(attackerFire, [dead, alive2]);
    const defenders3 = arena.computeDamage(attackerEarth, [dead, alive3]);

    expect(defenders1[0].lp).toBe(0);
    expect(defenders1[1].lp).toBe(900);
    expect(defenders2[0].lp).toBe(0);
    expect(defenders2[1].lp).toBe(920);
    expect(defenders3[0].lp).toBe(0);
    expect(defenders3[1].lp).toBe(880);
  });

  it("should apply lethality to a critical blow", () => {
    const attacker = new Hero(HeroElement.Water, 100, 0, 1000, 100, 1000);
    const defender = new Hero(HeroElement.Water, 0, 0, 0, 0, 1000);

    const defenders = arena.computeDamage(attacker, [defender]);

    // Dégâts critiques : 100 + (0.5 + 1000 / 5000) * 100 = 100 + 70 = 170
    expect(defenders[0].lp).toBe(830);
  });

  it("should compute damage correctly when hero bonus", () => {
    const alicia = new Hero(HeroElement.Water, 100, 0, 0, 0, 1000);
    const bob = new Hero(HeroElement.Fire, 100, 0, 0, 0, 1000);
    const charlie = new Hero(HeroElement.Earth, 100, 0, 0, 0, 1000);

    const result1 = arena.computeDamage(alicia, [bob]);
    const result2 = arena.computeDamage(bob, [charlie]);
    const result3 = arena.computeDamage(charlie, [alicia]);

    expect(result1[0].lp).toEqual(1000 - 100 * 1.20);
    expect(result1[0].element).toBe(HeroElement.Fire);
    expect(result2[0].lp).toEqual(1000 - 100 * 1.20);
    expect(result2[0].element).toBe(HeroElement.Earth);
    expect(result3[0].lp).toEqual(1000 - 100 * 1.20);
    expect(result3[0].element).toBe(HeroElement.Water);
  });

  it("should compute damage to the right defender", () => {
    const alicia = new Hero(HeroElement.Water, 100, 0, 0, 0, 1000);
    const bob = new Hero(HeroElement.Fire, 100, 0, 0, 0, 1000);
    const charlie = new Hero(HeroElement.Earth, 100, 0, 0, 0, 1000);
    const dave = new Hero(HeroElement.Water, 100, 0, 0, 0, 1000);

    const result1 = arena.computeDamage(alicia, [charlie, bob, dave]);
    const result2 = arena.computeDamage(dave, [charlie, alicia]);

    expect(result1[1].lp).toEqual(1000 - 100 * 1.20);
    expect(result1[0].lp).toEqual(1000);
    expect(result1[2].lp).toEqual(1000);

    expect(result2[1].lp).toEqual(1000 - 100);
    expect(result2[0].lp).toEqual(1000);
  })

});