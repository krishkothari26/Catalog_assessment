function decodeValue(valueStr, base) {
    return parseInt(valueStr, base);
}

function findPolynomialCoefficients(xValues, yValues) {
    const n = xValues.length;
   
    const A = Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) => Math.pow(xValues[i], j))
    );
   
    function gaussianElimination(A, b) {
        const n = b.length;
        for (let i = 0; i < n; i++) {
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
                    maxRow = k;
                }
            }
            [A[i], A[maxRow]] = [A[maxRow], A[i]];
            [b[i], b[maxRow]] = [b[maxRow], b[i]];
           
            for (let k = i + 1; k < n; k++) {
                const factor = A[k][i] / A[i][i];
                for (let j = i; j < n; j++) {
                    A[k][j] -= factor * A[i][j];
                }
                b[k] -= factor * b[i];
            }
        }
       
        const x = Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            x[i] = b[i] / A[i][i];
            for (let k = 0; k < i; k++) {
                b[k] -= A[k][i] * x[i];
            }
        }
       
        return x;
    }
   
    const b = yValues.slice();
    return gaussianElimination(A, b);
}

function evaluatePolynomial(coeffs, x) {
    return coeffs.reduce((sum, coeff, power) => sum + coeff * Math.pow(x, power), 0);
}

function main(jsonInput) {
    const data = JSON.parse(jsonInput);
   
    const n = data.keys.n;
    const k = data.keys.k;
   
    const xValues = [];
    const yValues = [];
   
    for (const key in data) {
        if (key !== "keys") {
            const base = parseInt(data[key].base, 10);
            const encodedValue = data[key].value;
            const decodedValue = decodeValue(encodedValue, base);
            xValues.push(parseInt(key, 10));
            yValues.push(decodedValue);
        }
    }
   
    if (xValues.length < k) {
        throw new Error("Not enough data points to determine the polynomial.");
    }
   
    const coeffs = findPolynomialCoefficients(xValues.slice(0, k), yValues.slice(0, k));
    const constantTerm = coeffs[0];
   
    const incorrectRoots = [];
    const tolerance = 1e-6; // Tolerance for floating-point comparisons
   
    for (let i = 0; i < xValues.length; i++) {
        const x = xValues[i];
        const y = yValues[i];
        const calculatedY = evaluatePolynomial(coeffs, x);
       
        if (Math.abs(y - calculatedY) > tolerance) {
            incorrectRoots.push(x);
        }
    }
   
    return {
        constantTerm: constantTerm,
        incorrectRoots: incorrectRoots
    };
}

// Sample JSON input
const jsonInput1 = `{
    "keys": {
        "n": 9,
        "k": 6
    },
    "1": {
        "base": "10",
        "value": "28735619723837"
    },
    "2": {
        "base": "16",
        "value": "1A228867F0CA"
    },
    "3": {
        "base": "12",
        "value": "32811A4AA0B7B"
    },
    "4": {
        "base": "11",
        "value": "917978721331A"
    },
    "5": {
        "base": "16",
        "value": "1A22886782E1"
    },
    "6": {
        "base": "10",
        "value": "28735619654702"
    },
    "7": {
        "base": "14",
        "value": "71AB5070CC4B"
    },
    "8": {
        "base": "9",
        "value": "122662581541670"
    },
    "9": {
        "base": "8",
        "value": "642121030037605"
    }

}`;



console.log("Test Case 1:", main(jsonInput1));
