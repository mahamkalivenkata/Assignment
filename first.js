const fs = require('fs');

// Function to decode a value from a given base to decimal
function decodeBase(value, base) {
    return parseInt(value, base);
}

// Function to parse and decode roots from JSON data
function parseRoots(data) {
    const n = data.keys.n;
    const k = data.keys.k;
    const roots = [];

    for (const key in data) {
        if (key === "keys") continue;
        const x = parseInt(key); // The x value (root)
        const base = parseInt(data[key].base);
        const y = decodeBase(data[key].value, base); // Decoded y value
        roots.push([x, y]);
    }

    return { n, k, roots };
}

// Function to calculate the constant term using Lagrange interpolation
function lagrangeInterpolationConstantTerm(roots, degree) {
    const k = degree + 1;
    let constantTerm = 0;

    for (let i = 0; i < k; i++) {
        const [x_i, y_i] = roots[i];
        
        // Calculate the basis polynomial L_i(0) at x = 0
        let L_i_0 = 1;
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                const [x_j] = roots[j];
                L_i_0 *= -x_j / (x_i - x_j);
            }
        }

        // Add contribution of current term to constant term
        constantTerm += y_i * L_i_0;
    }

    return BigInt(Math.round(constantTerm)); // Ensure safe handling of large integers
}

// Main function to read input, process data, and print result
function main() {
    // Read JSON data from file
    fs.readFile('C:/Users/DELL/Downloads/input2.json', 'utf8', (err, jsonData) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }
        
        const data = JSON.parse(jsonData);
        const { n, k, roots } = parseRoots(data);

        // Ensure n >= k for a solvable polynomial
        if (n < k) {
            console.error("Insufficient roots provided to solve for coefficients.");
            return;
        }

        // Determine polynomial degree
        const degree = k - 1;

        // Calculate constant term (secret c)
        const secretC = lagrangeInterpolationConstantTerm(roots, degree);

        console.log("Secret (constant term c):", secretC.toString());
    });
}

// Run the main function
main();
