package org.katas;

import java.util.ArrayList;
import java.util.List;

public class Hero {

    private HeroElement element;
    private int pow;
    private int def;
    private int leth;
    private int crtr;
    private int lp;
    private List<Buff> buffs;

    public Hero(HeroElement element, int pow, int def, int leth, int crtr, int lp) {

        this.element = element;
        this.pow = pow;
        this.def = def;
        this.leth = leth;
        this.crtr = crtr;
        this.lp = lp;
        this.buffs = new ArrayList<>();
    }

    public HeroElement getElement() {
        return element;
    }

    public void setElement(HeroElement element) {
        this.element = element;
    }

    public int getPow() {
        return pow;
    }

    public void setPow(int pow) {
        this.pow = pow;
    }

    public int getDef() {
        return def;
    }

    public void setDef(int def) {
        this.def = def;
    }

    public int getLeth() {
        return leth;
    }

    public void setLeth(int leth) {
        this.leth = leth;
    }

    public int getCrtr() {
        return crtr;
    }

    public void setCrtr(int crtr) {
        this.crtr = crtr;
    }

    public int getLp() {
        return lp;
    }

    public void setLp(int lp) {
        this.lp = lp;
    }

    public List<Buff> getBuffs() {
        return buffs;
    }

    public void setBuffs(List<Buff> buffs) {
        this.buffs = buffs;
    }
}
