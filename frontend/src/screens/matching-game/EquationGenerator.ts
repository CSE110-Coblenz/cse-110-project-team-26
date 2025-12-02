/**
 * Generates a random linear equation in the form mx + b = y.
 * 
 * @returns {[q: string, a: string]}
 *          A array containing:
 *          - `q`: equation string like "3x+4=19"
 *          - `a`: answer string like "x=5"
 */export function generate_linear_equation_1() {
    const m  = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const x = Math.floor(Math.random() * 20) + 1;
    const y = m * x + b;
    let q = "";
    if (m == 1) {
        q = "x+"+String(b)+"="+String(y);
    }
    else {
        q = String(m)+"x+"+String(b)+"="+String(y);
    }
    const a = "x="+String(x);
    return [q,a];
}

/**
 * Generates a random linear equation in the form mx + b = y.
 * 
 * @returns {[q: string, a: string]}
 *          A array containing:
 *          - `q`: equation string like "3x+4=19"
 *          - `a`: answer string like "x=5"
 */export function generate_linear_equation_2() {
    const m = (() => {
        let val: number;
        do {
            val = Math.floor(Math.random() * 19) - 9;  // -9 to +9
        } while (val === 0);
        return val;
    })();

    const b = (() => {
        let val: number;
        do {
            val = Math.floor(Math.random() * 19) - 9;
        } while (val === 0);
        return val;
    })();

    const x = (() => {
        let val: number;
        do {
            val = Math.floor(Math.random() * 19) - 9;
        } while (val === 0);
        return val;
    })();
    const y = m * x + b;

    let q = "";
    if (m == 1) {
        q = "x"
    }
    else if (m == -1) q = "-x";
    else q = String(m) + "x";

    if (b > 0) q = q +"+" + String(b) + "=" + String(y);
    else q = q + String(b) + "=" + String(y);
    const a = "x="+String(x);
    return [q,a];
}

/**
 * Generates a random quadratic equation in the form x^2+bx+c=d.
 * 
 * @returns {[q: string, a: string]}
 *          A array containing:
 *          - `q`: equation string like "x^2+14x+45=0"
 *          - `a`: answer string like "x=5 \ x=9"
 */export function generate_quadratic_equation_1() {
    const x_1 = Math.floor(Math.random() * 19) - 9;  // -9 to +9
    const x_2 = Math.floor(Math.random() * 19) - 9;  // -9 to +9
    const b = -x_1 - x_2;
    const c = x_1 * x_2;
    let q = "x²";
    if (b < 0) {
        if ( b == -1) {
            q += "-x";
        }
        else{
            q += String(b)+"x";
        }
    }
    else if (b == 0) {
        q += "";
    }
    else if (b == 1) {
        q += "+x";
    }
    else {
        q += "+"+String(b)+"x";
    }
    if (c < 0) {
        q += String(c);
    }
    else if (c == 0) {
        q += "";
    }
    else if (c == 1) {
        q += "+x";
    }
    else {
        q += "+"+String(c);
    }
    q += "=0"
    const a = "x=" + String(x_1) + " \ " + "x=" + String(x_2);
    return [q,a];
}

/**
 * Generates a random quadratic equation in the form ax^2+bx+c=d.
 * 
 * @returns {[q: string, a: string]}
 *          A array containing:
 *          - `q`: equation string like "x^2+14x+45=0"
 *          - `a`: answer string like "x=5 \ x=9"
 */export function generate_quadratic_equation_2() {
    const x_1 = Math.floor(Math.random() * 9) + 1;  // 1, 2, ..., 9
    const x_2 = Math.floor(Math.random() * 9) + 1;  // 1, 2, ..., 9
    const a = (() => {
        let val: number;
        do {
            val = Math.floor(Math.random() * 9) + 1;  // 1 to 9
        } while (val === 1);  // exclude only 1
        return val;
    })();
    const b = -1 * a * (x_1 + x_2);
    const c = x_1 * x_2;
    let q = String(a) + "x²";
    if (b < 0) {
        if ( b == -1) {
            q += "-x";
        }
        else{
            q += String(b)+"x";
        }
    }
    else if (b == 0) {
        q += "";
    }
    else if (b == 1) {
        q += "+x";
    }
    else {
        q += "+"+String(b)+"x";
    }
    if (c < 0) {
        q += String(c);
    }
    else if (c == 0) {
        q += "";
    }
    else if (c == 1) {
        q += "+x";
    }
    else {
        q += "+"+String(c);
    }
    q += "=0"
    const ans = "x=" + String(x_1) + " \ " + "x=" + String(x_2);
    return [q,ans];
}