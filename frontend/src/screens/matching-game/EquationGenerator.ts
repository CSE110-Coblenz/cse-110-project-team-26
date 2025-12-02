/**
 * Generates a random linear equation in the form mx + b = y.
 * 
 * @returns {[q: string, a: string]}
 *          A array containing:
 *          - `q`: equation string like "3x+4=19"
 *          - `a`: answer string like "x=5"
 */export function generate_linear_equation() {
    const m  = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const x = Math.floor(Math.random() * 10) + 1;
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