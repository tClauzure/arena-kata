package org.katas

import kotlin.math.floor
import kotlin.math.max
import kotlin.math.roundToInt

class ArenaDamageCalculator {
    fun computeDamage(attacker: Hero, defenders: List<Hero>): List<Hero>? {
        val pow = attacker.pow
        val adv = mutableListOf<Hero>()
        val eq = mutableListOf<Hero>()
        val dis = mutableListOf<Hero>()
        if (attacker.getElement() === HeroElement.Water) {
            for (h in defenders) {
                if (h.lp == 0) {
                    continue
                }
                if (h.getElement() === HeroElement.Fire) {
                    adv.add(h)
                } else if (h.getElement() === HeroElement.Water) {
                    eq.add(h)
                } else {
                    dis.add(h)
                }
            }
        } else if (attacker.getElement() === HeroElement.Fire) {
            for (h in defenders) {
                if (h.lp == 0) {
                    continue
                }
                if (h.getElement() === HeroElement.Fire) {
                    eq.add(h)
                } else if (h.getElement() === HeroElement.Water) {
                    dis.add(h)
                } else {
                    adv.add(h)
                }
            }
        } else {    // Hero is of type water
            for (h in defenders) {
                if (h.lp == 0) {
                    continue
                }
                if (h.getElement() === HeroElement.Fire) {
                    dis.add(h)
                } else if (h.getElement() === HeroElement.Water) {
                    adv.add(h)
                } else {
                    eq.add(h)
                }
            }
        }
        val attacked =
            if (adv.size > 0) adv[floor(Math.random() * adv.size).toInt()] else if (eq.size > 0) eq[Math.floor(
                Math.random() * eq.size
            ).toInt()] else dis[floor(Math.random() * dis.size).toInt()]
        val c = Math.random() * 100 < attacker.crtr
        var dmg = 0.0
        dmg = if (c) {
            ((attacker.pow + (0.5 + attacker.leth / 5000f) * attacker.pow).roundToInt() * (1 - attacked.def / 7500f)).toDouble()
        } else {
            (attacker.pow * (1 - attacked.def / 7500f)).toDouble()
        }

        // BUFFS
        if (attacker.getBuffs().contains(Buff.Attack)) {
            dmg += if (c) {
                ((attacker.pow * 0.25 + (0.5 + attacker.leth / 5000f) * attacker.pow * 0.25).roundToInt() * (1 - attacked.def / 7500f)).toDouble()
            } else {
                attacker.pow * 0.25 * (1 - attacked.def / 7500f)
            }
        }
        if (attacked.getBuffs().contains(Buff.Defense)) {
            dmg = dmg / (1 - attacked.def / 7500f) * (1 - attacked.def / 7500f - 0.25)
        }
        dmg = max(0.0, dmg)
        if (dmg > 0) {
            if (adv.contains(attacked)) {
                dmg = dmg + dmg * 20 / 100f
            } else if (eq.contains(attacked)) {
            } else {
                dmg = dmg - dmg * 20 / 100f
            }
            dmg = floor(dmg)
            if (dmg > 0) {
                attacked.lp = attacked.lp - dmg.toInt()
                if (attacked.lp < 0) {
                    attacked.lp = 0
                }
            }
        }
        return defenders
    }
}