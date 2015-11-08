var libraries = (function () {
    var a = "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
        b = "1234567890234567890134567890124567890123567890123467890123457890123456890123456790123456780123456789",
        c = "98109840984098409156481068456541684065964819841065106865710397464513210416435401645030648036034063974065004951094209420942097421970490274195049120974210974209742190274092740492097420929892490974202241",
        d = c + c + c + c + c + c + c + c + c + c,
        e = d + d + d + d + d + d + d + d + d + d,
        f = e + e + e,
        c2 = a + b,
        d2 = c2 + c2 + c2 + c2 + c2 + c2 + c2 + c2 + c2 + c2,
        e2 = d2 + d2 + d2 + d2 + d2 + d2 + d2 + d2 + d2 + d2,
        f2 = e2 + e2 + e2,
        s1 = 12345,
        s2 = 98765,
        s3 = 5437654,
        _5 = 5,
        _22 = 22,
        _23 = 23;
    var vars = { a: a, b: b, c: c, d: d, e: e, f: f, c2: c2, d2: d2, e2: e2, f2: f2, s1: s1, s2: s2, s3: s3, _5: _5, _22: _22, _23: _23 };

    var createInitialization = function (fName, radix) {
        var str = "";
        radix = radix || "";
        for (var i in vars) {
            str += i + "=" + fName + "('" + vars[i] + "'" + radix + ");" + i + "_str='" + vars[i] + "';";
        }
        return str;
    };

    var createOnCycle = function (f) {
        var str = "";
        for (var i in vars) {
            str += f(i) + ";";
        }
        return str;
    };

    var tests = {
        "Addition: large1 + large2": "a.add(b)",
        "Addition: large + small": "a.add(s1)",
        "Addition: small + large": "s1.add(a)",
        "Addition: small1 + small2": "s1.add(s2)",
        "Addition: 200 digits": "c.add(c2)",
        "Addition: 2,000 digits": "d.add(d2)",
        "Addition: 20,000 digits": "e.add(e2)",
        "Addition: 60,000 digits": "f.add(f2)",
        "Subtraction: large1 - large2": "b.minus(a)",
        "Subtraction: large - small": "b.minus(s1)",
        "Subtraction: small - large": "s1.minus(b)",
        "Subtraction: small - small": "s2.minus(s1)",
        "Subtraction: 200 digits": "c.minus(c2)",
        "Subtraction: 2,000 digits": "d.minus(d2)",
        "Subtraction: 20,000 digits": "e.minus(e2)",
        "Subtraction: 60,000 digits": "f.minus(f2)",
        "Multiplication: large * large": "a.times(b)",
        "Multiplication: large * small": "a.times(s1)",
        "Multiplication: small * large": "s1.times(a)",
        "Multiplication: small1 * small2": "s1.times(s2)",
        "Multiplication: 400 digits": "c.times(b)",
        "Multiplication: 2,200 digits": "d.times(c)",
        "Multiplication: 22,000 digits": "e.times(d)",
        "Multiplication: 82,000 digits": "f.times(e)",
        "Squaring: small": "s1.square()",
        "Squaring: 200 digits": "a.square()",
        "Squaring: 400 digits": "c.square()",
        "Squaring: 4,000 digits": "d.square()",
        "Squaring: 40,000 digits": "e.square()",
        "Division: large1 / large2": "b.over(a)",
        "Division: large / small": "a.over(s1)",
        "Division: small / large": "s2.over(b)",
        "Division: small / small": "s2.over(s1)",
        "Division: 200 digits": "c.over(b)",
        "Division: 2,000 digits": "d.over(c)",
        "Division: 20,000 digits": "e.over(d)",
        "Division: 60,000 digits": "f.over(e)",
        "Exponentiation: 5 ^ 22": "_5.pow(_22)",
        "Exponentiation: 5 ^ 23": "_5.pow(_23)",
        "Exponentiation: 5 ^ 12345": "_5.pow(s1)",
        "Exponentiation: 12345 ^ 12345": "s1.pow(s1)",
        "parseInt: 5 decimal digits": "parseInt(s1_str, 10)",
        "parseInt: 100 decimal digits": "parseInt(a_str, 10)",
        "parseInt: 2,000 decimal digits": "parseInt(d_str, 10)",
        "parseInt: 20,000 decimal digits": "parseInt(e_str, 10)",
        "parseInt: 5 hex digits": "parseInt(s1_str, 16)",
        "parseInt: 83 hex digits": "parseInt(a_str, 16)",
        "parseInt: 1,661 hex digits": "parseInt(d_str, 16)",
        "parseInt: 16,610 hex digits": "parseInt(e_str, 16)",
        "toString: 5 decimal digits": "s1.toString(10)",
        "toString: 100 decimal digits": "a.toString(10)",
        "toString: 2,000 decimal digits": "d.toString(10)",
        "toString: 20,000 decimal digits": "e.toString(10)",
        "toString: 5 hex digits": "s2.toString(16)",
        "toString: 83 hex digits": "a.toString(16)",
        "toString: 1,661 hex digits": "d.toString(16)",
        "toString: 16,610 hex digits": "e.toString(16)"
    };

    function generateTests(transformation, skip) {
        skip = skip || [];
        var t = {};
        for (var i in tests) {
            if (skip.indexOf(i.split(":")[0]) > -1) continue;
            t[i] = transformation(tests[i]);
        };
        return t;
    }

    var libraries = {
        "Peter Olson BigInteger.js": {
            url: ["../BigInteger.js"],
            projectURL: "https://github.com/peterolson/BigInteger.js",
            onStart: createInitialization("bigInt"),
            tests: generateTests(function (x) { return x.replace("parseInt", "bigInt"); })
        },
        "Yaffle BigInteger": {
            url: ["https://rawgit.com/Yaffle/BigInteger/master/BigInteger.js"],
            projectURL: "https://github.com/Yaffle/BigInteger",
            onStart: createInitialization("BigInteger.parseInt"),
            tests: generateTests(function (x) {
                return x
                .replace(/([_a-zA-Z0-9]+)\.add\(([_a-zA-Z0-9]+)\)/g, "BigInteger.add($1, $2)")
                .replace(/([_a-zA-Z0-9]+)\.minus\(([_a-zA-Z0-9]+)\)/g, "BigInteger.subtract($1, $2)")
                .replace(/([_a-zA-Z0-9]+)\.times\(([_a-zA-Z0-9]+)\)/g, "BigInteger.multiply($1, $2)")
                .replace(/([_a-zA-Z0-9]+)\.over\(([_a-zA-Z0-9]+)\)/g, "BigInteger.divide($1, $2)")
                .replace(/([_a-zA-Z0-9]+)\.square\(\)/g, "BigInteger.multiply($1, $1)")
                .replace(/([_a-zA-Z0-9]+)\.toString\(([_a-zA-Z0-9]+)\)/g, "($1).toString($2)")
                .replace("parseInt", "BigInteger.parseInt");
            }, ["Exponentiation"])
        },
        "Silent Matt BigInteger": {
            url: ["https://rawgit.com/silentmatt/javascript-biginteger/master/biginteger.js"],
            projectURL: "http://silentmatt.com/biginteger/",
            onStart: createInitialization("BigInteger.parse"),
            tests: generateTests(function (x) {
                return x.replace(/\.minus/g, ".subtract")
                .replace(/\.times/g, ".multiply")
                .replace(/\.over/g, ".divide")
                .replace("parseInt", "BigInteger.parse");
            })
        },
        "Tom Wu jsbn": {
            url: ["http://www-cs-students.stanford.edu/~tjw/jsbn/jsbn.js", "http://www-cs-students.stanford.edu/~tjw/jsbn/jsbn2.js"],
            projectURL: "http://www-cs-students.stanford.edu/~tjw/jsbn/",
            onStart: createInitialization("new BigInteger"),
            tests: generateTests(function (x) {
                return x.replace(/\.minus/g, ".subtract")
                .replace(/\.times/g, ".multiply")
                .replace(/\.over/g, ".divide")
                .replace("parseInt", "new BigInteger");
            })
        },
        "Fedor Indutny bn.js": {
            url: ["https://rawgit.com/indutny/bn.js/master/lib/bn.js"],
            projectURL: "https://github.com/indutny/bn.js",
            onStart: createInitialization("new BN"),
            tests: generateTests(function (x) {
                return x.replace(/\.minus/g, ".sub")
                .replace(/\.times/g, ".mul")
                .replace(/(.+)\.square\(\)/g, "$1.mul($1)")
                .replace(/\.over/g, ".div")
                .replace("parseInt", "new BN");
            }, ["Exponentiation"])
        },
        "MikeMcl bignumber.js": {
            url: ["https://rawgit.com/MikeMcl/bignumber.js/master/bignumber.min.js"],
            projectURL: "http://mikemcl.github.io/bignumber.js/",
            onStart: createInitialization("new BigNumber") + "BigNumber.config({POW_PRECISION: 0});",
            tests: generateTests(function (x) {
                return x.replace(/\.over/g, ".div")
                .replace(/(.+)\.square\(\)/g, "$1.times($1)")
                .replace("parseInt", "new BigNumber");
            })
        }/*, // Leemon Baird library link is broken
        "Leemon Baird BigInt.js": {
            url: ["http://www.leemon.com/crypto/BigInt.js"],
            projectURL: "http://www.leemon.com/crypto/BigInt.html",
            onStart: createInitialization("str2bigInt", ",10"),
            onCycle: createOnCycle(function (v) {
                return v + "=" + v + ".concat()";
            }),
            tests: generateTests(function(x) {
                return x.replace(/(\w+)\.add\(([^\)]*)\)/g, "add($1, $2)")
                .replace(/(\w+)\.minus\(([^\)]*)\)/g, "sub($1, $2)")
                .replace(/(\w+)\.times\(([^\)]*)\)/g, "mult($1, $2)")
                .replace(/(\w+)\.over\(([^\)]*)\)/g, "divInt_($1, $2)")
                .replace(/(\w+)\.square\(([^\)]*)\)/g, "mult($1, $1)")
                .replace("parseInt", "str2bigInt")
                .replace(/(\w+)\.toString\(([^\)]*)\)/g, "bigInt2str($1, $2)")
            }, ["Exponentiation"])
        }*/
    };
    return libraries;
})();
