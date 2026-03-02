// Mirem el input type="range" en HTML per saber la quantitat de proves
const value = document.querySelector("#value");
const input = document.querySelector("#polynomialRange");
value.textContent = input.value;

input.addEventListener("input", (event) => {
    const val = event.target.value;
    if (val < 100) {
        value.textContent = val;
    } else if (val >= 100 && val < 500) {
        value.textContent = val + " ( calculs maybe will take some time)"; 
    } else {
        value.textContent = val + " ( calculs maybe will take more time)"; 
    }
});

//fem una classe per podetreballar amb els nombres complexos, ja que JS no sap que es i
class Complex {
    constructor(re, im = 0) {
        this.re = re; //la part real
        this.im = im; //la part imaginaria
    }
    add(other) { return new Complex(this.re + other.re, this.im + other.im); }
    sub(other) { return new Complex(this.re - other.re, this.im - other.im); }
    mul(other) {
        return new Complex(
            this.re * other.re - this.im * other.im,
            this.re * other.im + this.im * other.re
        );
    }
    div(other) {
        const den = other.re ** 2 + other.im ** 2;
        return new Complex(
            (this.re * other.re + this.im * other.im) / den,
            (this.im * other.re - this.re * other.im) / den
        );
    }

    //Això ha proposat Gemini per fer els resultats mès binocs pel usuari
    toString() {
        const re = parseFloat(this.re.toFixed(3));
        const im = parseFloat(this.im.toFixed(3));
        if (Math.abs(im) < 0.000000001) return `${re}`; //
        const sign = im >= 0 ? "+" : "-";
        return `(${re} ${sign} ${Math.abs(im)}i)`;
    }
}

//la part princcipal: fem la funcció per calcular les arrels
function solvePolynomial(coeffs, maxIter) {
    const n = coeffs.length - 1;
    const roots = [];
    const lead = coeffs[0];
    const poly = coeffs.map(c => c / lead);

    //aproximació inicial
    for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n + 0.5; //Desplaçament 0,5 per evitar la simetria (Gemini). Aixó es com en aquestes images del video amb el cercle
        roots.push(new Complex(Math.cos(angle), Math.sin(angle)));
    }

    const evaluate = (z) => { //aquí, si la z es la arrel, donarà un 0, i sabrem que es la arrel
        let res = new Complex(poly[0]);
        for (let i = 1; i <= n; i++) {
            res = res.mul(z).add(new Complex(poly[i]));
        }
        return res;
    };

    for (let iter = 0; iter < maxIter; iter++) {
        const nextRoots = [];
        for (let i = 0; i < n; i++) {
            const pZ = evaluate(roots[i]);
            let denominator = new Complex(1, 0);
            for (let j = 0; j < n; j++) { //per que les arrels no quedin en un punt, proposat per Mr G.
                if (i === j) continue;
                denominator = denominator.mul(roots[i].sub(roots[j]));
            }
            const delta = pZ.div(denominator);
            nextRoots[i] = roots[i].sub(delta);
        }
        roots.splice(0, n, ...nextRoots);
    }
    return roots;
}

//el bottó de la pàgina WEB, s'utilitza per llgir ho que ha introduit el usuari
function calc() {
    const inputStr = document.getElementById('polynomialInput').value;
    const iterations = parseInt(document.getElementById('polynomialRange').value);

    //posem lo intruit en la variable fer poder fer els calculs
    const coeffs = inputStr.split(',')
                           .map(item => parseFloat(item.trim()))
                           .filter(item => !isNaN(item));

    //proposat per Gemini per no calcular operacións molt senzilles, però ho trec fins ara                   
    /*if (coeffs.length < 2) {
        alert("Please enter at least 2 coefficients!");
        return;
    }*/

    //per cridar la funció del càlcul
    const roots = solvePolynomial(coeffs, iterations);
    
    //mostrem  les arrels en la pàgina WEB
    let rootsHTML = "<b>Roots:</b><br>";
    roots.forEach((r, i) => {
        rootsHTML += `x<sub>${i+1}</sub> = ${r.toString()}<br>`;
    });
    document.getElementById('polynomialRoots').innerHTML = rootsHTML;

    //factorització, proposata per Gemini, surt molt més simple de que jo pensava
    const leadCoeff = coeffs[0];
    let factorHTML = "<b>Factored Form:</b><br>";
    let expression = leadCoeff === 1 ? "" : `${leadCoeff}`;
    
    roots.forEach(r => { //aquí simplement preparem els resultats per demostrar-les
        if (Math.abs(r.im) < 0.000000001) {
            const val = parseFloat(r.re.toFixed(3));
            const sign = val >= 0 ? "-" : "+";
            expression += `(x ${sign} ${Math.abs(val)})`;
        } else {
            expression += `(x - ${r.toString()})`;
        }
    });
    
    document.getElementById('polynomialFactor').innerHTML = factorHTML + expression;
}