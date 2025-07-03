package org.katas;

import java.util.ArrayList;
import java.util.List;

import static java.lang.Math.*;

public class ArenaDamageCalculator {
    public List<Hero> computeDamage(Hero attacker, List<Hero> defenders) {
        var pow = attacker.getPow();

        var adv = new ArrayList<Hero>();
        var eq = new ArrayList<Hero>();
        var dis = new ArrayList<Hero>();

        if (attacker.getElement() == HeroElement.Water) {
            for (var h : defenders) {
                if (h.getLp() == 0) {
                    continue;
                }
                if (h.getElement() == HeroElement.Fire) {
                    adv.add(h);
                } else if (h.getElement() == HeroElement.Water) {
                    eq.add(h);
                } else {
                    dis.add(h);
                }
            }
        } else if (attacker.getElement() == HeroElement.Fire) {
            for (var h : defenders) {
                if (h.getLp() == 0) {
                    continue;
                }
                if (h.getElement() == HeroElement.Fire) {
                    eq.add(h);
                } else if (h.getElement() == HeroElement.Water) {
                    dis.add(h);
                } else {
                    adv.add(h);
                }
            }
        } else {    // Hero is of type water
            for (var h : defenders) {
                if (h.getLp() == 0) {
                    continue;
                }
                if (h.getElement() == HeroElement.Fire) {
                    dis.add(h);
                } else if (h.getElement() == HeroElement.Water) {
                    adv.add(h);
                } else {
                    eq.add(h);
                }
            }
        }

        var attacked = adv.size() > 0 ? adv.get((int) floor(random() * adv.size())) : eq.size() > 0 ? eq.get((int) floor(random() * eq.size())) : dis.get((int) floor(random() * dis.size()));

        var c= random() * 100 < attacker.getCrtr();
        var dmg = 0.0;

        if (c) {
            dmg = round(attacker.getPow() + (0.5 + attacker.getLeth()/(float)5000) * attacker.getPow()) * (1 - attacked.getDef()/(float)7500);
        } else {
            dmg = attacker.getPow() * (1 - attacked.getDef()/(float)7500);
        }

        // BUFFS
        if (attacker.getBuffs().contains(Buff.Attack)) {
            if(c) {
                dmg += round(attacker.getPow() * 0.25 + (0.5 + attacker.getLeth()/(float)5000) * attacker.getPow() *0.25) * (1 - attacked.getDef()/(float)7500);
            } else {
                dmg += attacker.getPow() * 0.25 * (1 - attacked.getDef()/(float)7500);
            }
        }

        if (attacked.getBuffs().contains(Buff.Defense)) {
            dmg = dmg / (1 - attacked.getDef()/(float)7500) * (1 - attacked.getDef()/(float)7500 - 0.25);
        }

        dmg = max(0, dmg);
        if (dmg > 0) {
            if (adv.contains(attacked)) {
                dmg = dmg + dmg * 20 / (float)100;
            } else if (eq.contains(attacked)) {

            } else {
                dmg = dmg - dmg * 20 / (float)100;
            }

            dmg =  floor(dmg);
            if (dmg > 0) {
                attacked.setLp(attacked.getLp() -(int) dmg);
                if (attacked.getLp() < 0) {
                    attacked.setLp(0);
                }
            }
        }

        return defenders;
    }
}
