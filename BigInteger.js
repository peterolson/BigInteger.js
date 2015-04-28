"use strict";
var bigInt = (function () {
    var base = 10000000, logBase = 7, zeros = "0000000";
    var sign = {
        positive: false,
        negative: true
    };

    function BigInteger(value, sign) {
        this.value = value;
        this.sign = sign;
    }

    function trim(value) {
        while (value[value.length - 1] === 0 && value.length > 1) value.pop();
        return value;
    }

    function fastAdd(a, b) {
        var sign = b < 0;
        if (a.sign !== sign) {
            if(sign) return fastSubtract(a.abs(), -b);
            return fastSubtract(a.abs(), b).negate();
        }
        if (sign) b = -b;
        var value = a.value,
            result = [],
            carry = 0;
        for (var i = 0; i < value.length || carry > 0; i++) {
            var sum = (value[i] || 0) + (i > 0 ? 0 : b) + carry;
            carry = sum >= base ? 1 : 0;
            result.push(sum % base);
        }
        return new BigInteger(trim(result), a.sign);
    }

    function fastSubtract(a, b) {
        var value = a.value;
        if (value.length === 1) {
            value = value[0];
            if (a.sign) value = -value;
            return new BigInteger([Math.abs(value - b)], (value - b) < 0);
        }
        if (a.sign !== (b < 0)) return fastAdd(a, -b);
        var sign = false;
        if (a.sign) sign = true;
        if (value.length === 1 && value[0] < b) return new BigInteger([b - value[0]], !sign);
        if (sign) b = -b;
        var result = [],
            borrow = 0;
        for (var i = 0; i < value.length; i++) {
            var tmp = value[i] - borrow - (i > 0 ? 0 : b);
            borrow = tmp < 0 ? 1 : 0;
            result.push((borrow * base) + tmp);
        }

        return new BigInteger(trim(result), sign);
    }

    function fastMultiplyInternal(value, lambda) {
        var result = [];
        var carry = 0;
        for (var i = 0; i < value.length; i++) {
            carry += lambda * value[i];
            var q = Math.floor(carry / base);
            result[i] = (carry - q * base) | 0;
            carry = q;
        }
        result[value.length] = carry | 0;
        return result;
    }

    function fastMultiply(a, b) {
        var result = fastMultiplyInternal(a.value, b < 0 ? -b : b);
        return new BigInteger(trim(result), b < 0 ? !a.sign : a.sign);
    }

    function fastDivModInternal(value, lambda) {
        var quotient = [];
        for (var i = 0; i < value.length; i++) {
            quotient[i] = 0;
        }
        var remainder = 0;
        for (var i = value.length - 1; i >= 0; i--) {
            var divisor = remainder * base + value[i];
            var q = Math.floor(divisor / lambda);
            remainder = divisor - q * lambda;
            quotient[i] = q | 0;
        }
        return {
          quotient: quotient,
          remainder: remainder | 0
        };
    }

    function fastDivMod(a, b) {
        if (b === 0) throw new Error("Cannot divide by zero.");
        var result = fastDivModInternal(a.value, b < 0 ? -b : b);
        return {
            quotient: new BigInteger(trim(result.quotient), b < 0 ? !a.sign : a.sign),
            remainder: new BigInteger([result.remainder], a.sign)
        };
    }

    function isSmall(n) {
        return ((typeof n === "number" || typeof n === "string") && +Math.abs(n) <= base) ||
            (n instanceof BigInteger && n.value.length <= 1);
    }
    
    function fromTwosComp(twosComp) {
    	var sign = (parseInt(twosComp[0]) == 1);
    	var result = twosComp.substr(1);
    	if (sign) {
    		var i = result.length;
    		while (i >= 0) {
    			i--;
    			if (result[i + 1] == 1) break;
    		}
    		for (var j = i; j >= 0; j--) 
    			result = result.substr(0, j) + Math.abs(result[j] - 1) + result.substr(j + 1);
    	}
    	var value = bigInt.zero;
    	var exp = 0;
    	for (var i = result.length - 1; i >= 0; i--) {
    		if (parseInt(result[i]) == 1) {
    			var addend = bigInt.one;
    			var help = exp;
    			while (help > 0) {
    				addend = addend.multiply(new BigInteger([2]));
    				help--;
    			}
    			value = value.add(addend);
    		}
    		exp++;
    	}
    	if (sign) value = value.negate();
    	return value;
    }
    
    function getTwosComp(bI, bits) {		
    	var posString = bI.abs().toString(2);	
    	var minbits = posString.length + 2; 	//+2 because of miscalculations when bitcount is exceeded, e.g. when calling .TwosCompNot(15)
    											// result without '+2' would be 0 instead of -16, which isn't incorrect, but in Java and other cases,
    											// where 32/64 bits are used, -16 would be the result and thus this wouldn't meet expectations.
    	
    	if (bits === undefined) bits = minbits;
    	
    	var result = "";
    	var count = 0;
    	
		for (var i = posString.length - 1; i >= 0; i--)  {
			if (count >= bits) break;
			result = posString[i] + result;
			count++;
		}
		for (var i = bits-posString.length - 1; i >= 0; i--) {
			if (count >= bits) break;
			result = "0" + result;
			count++;
		}
		
    	if (bI.isNegative()) {
    		var i = bits-1;
    		while (i > 0) {
    			i--;
    			if (parseInt(result[i + 1]) == 1) break;
    		}
    		for (var j = i; j >= 0; j--) 
    			result = result.substr(0, j) + ((parseInt(result[j]) + 1) % 2) + result.substr(j + 1);
    	}
    	
    	return result;
    }

    BigInteger.prototype.toTwosComp = function(bits) {
    	return getTwosComp(this, bits);
    }
    BigInteger.prototype.negate = function () {
        return new BigInteger(this.value, !this.sign);
    };
    BigInteger.prototype.abs = function () {
        return new BigInteger(this.value, sign.positive);
    };
    BigInteger.prototype.add = function (n) {
        if(isSmall(n)) return fastAdd(this, +n);
        n = parseInput(n);
        if (this.sign !== n.sign) {
            if (this.sign === sign.positive) return this.abs().subtract(n.abs());
            return n.abs().subtract(this.abs());
        }
        var a = this.value, b = n.value;
        var result = [],
            carry = 0,
            length = Math.max(a.length, b.length);
        for (var i = 0; i < length || carry > 0; i++) {
            var sum = (a[i] || 0) + (b[i] || 0) + carry;
            carry = sum >= base ? 1 : 0;
            result.push(sum % base);
        }
        return new BigInteger(trim(result), this.sign);
    };
    BigInteger.prototype.plus = BigInteger.prototype.add;

    BigInteger.prototype.subtract = function (n) {
        if (isSmall(n)) return fastSubtract(this, +n);
        n = parseInput(n);
        if (this.sign !== n.sign) return this.add(n.negate());
        if (this.sign === sign.negative) return n.negate().subtract(this.negate());
        if (this.compare(n) < 0) return n.subtract(this).negate();
        var a = this.value, b = n.value;
        var result = [],
            borrow = 0,
            length = Math.max(a.length, b.length);
        for (var i = 0; i < length; i++) {
            var ai = a[i] || 0, bi = b[i] || 0;
            var tmp = ai - borrow;
            borrow = tmp < bi ? 1 : 0;
            result.push((borrow * base) + tmp - bi);
        }
        return new BigInteger(trim(result), sign.positive);
    };
    BigInteger.prototype.minus = BigInteger.prototype.subtract;

    BigInteger.prototype.multiply = function (n) {
        if (isSmall(n)) return fastMultiply(this, +n);
        n = parseInput(n);
        var sign = this.sign !== n.sign;

        var a = this.value, b = n.value;
        var result = [];
        for (var i = a.length + b.length; i > 0; i--) {
            result.push(0);
        }
        for (var i = 0; i < a.length; i++) {
            var x = a[i];
            for (var j = 0; j < b.length; j++) {
                var y = b[j];
                var product = x * y + result[i+j];
                var q = Math.floor(product / base);
                result[i+j] = product - q * base;
                result[i+j+1] += q;
            }
        }
        return new BigInteger(trim(result), sign);
    };
    BigInteger.prototype.times = BigInteger.prototype.multiply;

    BigInteger.prototype.divmod = function (n) {
        if (isSmall(n)) return fastDivMod(this, +n);
        n = parseInput(n);
        var quotientSign = this.sign !== n.sign;
        if (n.equals(ZERO)) throw new Error("Cannot divide by zero");
        if (this.equals(ZERO)) return {
            quotient: new BigInteger([0], sign.positive),
            remainder: new BigInteger([0], sign.positive)
        };
        var a = this.value, b = n.value;
        var result = [0];
        for (var i = 0; i < b.length; i++) {
            result[i] = 0;
        }
        var divisorMostSignificantDigit = b[b.length - 1];
        // normalization
        var lambda = Math.ceil(base / 2 / divisorMostSignificantDigit);
        var remainder = fastMultiplyInternal(a, lambda);
        var divisor = fastMultiplyInternal(b, lambda);
        divisorMostSignificantDigit = divisor[b.length - 1];
        for (var shift = a.length - b.length; shift >= 0; shift--) {
            var quotientDigit = base - 1;
            if (remainder[shift + b.length] !== divisorMostSignificantDigit) {
                quotientDigit = Math.floor((remainder[shift + b.length] * base + remainder[shift + b.length - 1]) / divisorMostSignificantDigit);
            }
            // remainder -= quotientDigit * divisor
            var carry = 0;
            var borrow = 0;
            for (var i = 0; i < divisor.length; i++) {
                carry += quotientDigit * divisor[i];
                var q = Math.floor(carry / base);
                borrow += remainder[shift + i] - (carry - q * base);
                carry = q;
                if (borrow < 0) {
                    remainder[shift + i] = (borrow + base) | 0;
                    borrow = -1;
                } else {
                    remainder[shift + i] = borrow | 0;
                    borrow = 0;
                }
            }
            while (borrow !== 0) {
                quotientDigit -= 1;
                var carry = 0;
                for (var i = 0; i < divisor.length; i++) {
                    carry += remainder[shift + i] - base + divisor[i];
                    if (carry < 0) {
                        remainder[shift + i] = (carry + base) | 0;
                        carry = 0;
                    } else {
                        remainder[shift + i] = carry | 0;
                        carry = +1;
                    }
                }
                borrow += carry;
            }
            result[shift] = quotientDigit | 0;
        }
        // denormalization
        remainder = fastDivModInternal(remainder, lambda).quotient;
        return {
            quotient: new BigInteger(trim(result), quotientSign),
            remainder: new BigInteger(trim(remainder), this.sign)
        };
    };
    BigInteger.prototype.divide = function (n) {
        return this.divmod(n).quotient;
    };
    BigInteger.prototype.over = BigInteger.prototype.divide;

    BigInteger.prototype.mod = function (n) {
        return this.divmod(n).remainder;
    };
    BigInteger.prototype.remainder = BigInteger.prototype.mod;

    BigInteger.prototype.pow = function (n) {
        n = parseInput(n);
        var a = this, b = n, r = ONE;
        if (b.equals(ZERO)) return r;
        if (a.equals(ZERO) || b.lesser(ZERO)) return ZERO;
        while (true) {
            if (b.isOdd()) {
                r = r.times(a);
            }
            b = b.divide(2);
            if (b.equals(ZERO)) break;
            a = a.times(a);
        }
        return r;
    };
    BigInteger.prototype.modPow = function (exp, mod) {
        exp = parseInput(exp);
        mod = parseInput(mod);
        if (mod.equals(ZERO)) throw new Error("Cannot take modPow with modulus 0");
        var r = ONE,
            base = this.mod(mod);
        if (base.equals(ZERO)) return ZERO;
        while (exp.greater(0)) {
            if (exp.isOdd()) r = r.multiply(base).mod(mod);
            exp = exp.divide(2);
            base = base.square().mod(mod);
        }
        return r;
    };
    BigInteger.prototype.square = function () {
        return this.multiply(this);
    };
    function gcd(a, b) {
        a = parseInput(a).abs();
        b = parseInput(b).abs();
        if (a.equals(b)) return a;
        if (a.equals(ZERO)) return b;
        if (b.equals(ZERO)) return a;
        if (a.isEven()) {
            if (b.isOdd()) {
                return gcd(a.divide(2), b);
            }
            return gcd(a.divide(2), b.divide(2)).multiply(2);
        }
        if (b.isEven()) {
            return gcd(a, b.divide(2));
        }
        if (a.greater(b)) {
            return gcd(a.subtract(b).divide(2), b);
        }
        return gcd(b.subtract(a).divide(2), a);
    }
    function lcm(a, b) {
        a = parseInput(a).abs();
        b = parseInput(b).abs();
        return a.multiply(b).divide(gcd(a, b));
    }
    BigInteger.prototype.next = function () {
        return fastAdd(this, 1);
    };
    BigInteger.prototype.prev = function () {
        return fastSubtract(this, 1);
    };
    BigInteger.prototype.compare = function (n) {
        var first = this, second = parseInput(n);
        if (first.value.length === 1 && second.value.length === 1 && first.value[0] === 0 && second.value[0] === 0) return 0;
        if (second.sign !== first.sign) return first.sign === sign.positive ? 1 : -1;
        var multiplier = first.sign === sign.positive ? 1 : -1;
        var a = first.value, b = second.value,
            length = Math.max(a.length, b.length) - 1;
        for (var i = length; i >= 0; i--) {
            var ai = (a[i] || 0), bi = (b[i] || 0);
            if (ai > bi) return 1 * multiplier;
            if (bi > ai) return -1 * multiplier;
        }
        return 0;
    };

    BigInteger.prototype.compareAbs = function (n) {
        return this.abs().compare(n.abs());
    };
    BigInteger.prototype.equals = function (n) {
        return this.compare(n) === 0;
    };
    BigInteger.prototype.notEquals = function (n) {
        return !this.equals(n);
    };
    BigInteger.prototype.lesser = function (n) {
        return this.compare(n) < 0;
    };
    BigInteger.prototype.greater = function (n) {
        return this.compare(n) > 0;
    };
    BigInteger.prototype.greaterOrEquals = function (n) {
        return this.compare(n) >= 0;
    };
    BigInteger.prototype.lesserOrEquals = function (n) {
        return this.compare(n) <= 0;
    };

    BigInteger.prototype.compareTo = BigInteger.prototype.compare;
    BigInteger.prototype.lt = BigInteger.prototype.lesser;
    BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;
    BigInteger.prototype.gt = BigInteger.prototype.greater;
    BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;
    BigInteger.prototype.eq = BigInteger.prototype.equals;
    BigInteger.prototype.neq = BigInteger.prototype.notEquals;

    function max (a, b) {
        a = parseInput(a);
        b = parseInput(b);
        return a.greater(b) ? a : b;
    }
    function min (a, b) {
        a = parseInput(a);
        b = parseInput(b);
        return a.lesser(b) ? a : b;
    }
    BigInteger.prototype.isPositive = function () {
        if (this.value.length === 1 && this.value[0] === 0) return false;
        return this.sign === sign.positive;
    };
    BigInteger.prototype.isNegative = function () {
        if (this.value.length === 1 && this.value[0] === 0) return false;
        return this.sign === sign.negative;
    };
    BigInteger.prototype.isEven = function () {
        return this.value[0] % 2 === 0;
    };
    BigInteger.prototype.isOdd = function () {
        return this.value[0] % 2 === 1;
    };
    BigInteger.prototype.isUnit = function () {
        return this.value.length === 1 && this.value[0] === 1;
    };
    BigInteger.prototype.isZero = function () {
        return this.value.length === 1 && this.value[0] === 0;
    };
    BigInteger.prototype.isDivisibleBy = function (n) {
        n = parseInput(n);
        if (n.isZero()) return false;
        return this.mod(n).equals(ZERO);
    };
    BigInteger.prototype.isPrime = function () {
        var n = this.abs(),
            nPrev = n.prev();
        if (n.isUnit()) return false;
        if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
        if (n.lesser(25)) return true;
        var a = [2, 3, 5, 7, 11, 13, 17, 19],
            b = nPrev,
            d, t, i, x;
        while (b.isEven()) b = b.divide(2);
        for (i = 0; i < a.length; i++) {
            x = bigInt(a[i]).modPow(b, n);
            if (x.equals(ONE) || x.equals(nPrev)) continue;
            for (t = true, d = b; t && d.lesser(nPrev); d = d.multiply(2)) {
                x = x.square().mod(n);
                if (x.equals(nPrev)) t = false;
            }
            if (t) return false;
        }
        return true;
    };
    function randBetween (a, b) {
        a = parseInput(a);
        b = parseInput(b);
        var low = min(a, b), high = max(a, b);
        var range = high.subtract(low);
        var length = range.value.length - 1;
        var result = [], restricted = true;
        for (var i = length; i >= 0; i--) {
            var top = restricted ? range.value[i] : base;
            var digit = Math.floor(Math.random() * top);
            result.unshift(digit);
            if (digit < top) restricted = false;
        }
        return low.add(new BigInteger(result, false));
    }

    var powersOfTwo = [1];
    while (powersOfTwo[powersOfTwo.length - 1] <= base) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
    var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];

    BigInteger.prototype.shiftLeft = function (n) {
        if (!isSmall(n)) {
            if (n.isNegative()) return this.shiftRight(n.abs());
            return this.times(bigInt(2).pow(n));
        }
        n = +n;
        if (n < 0) return this.shiftRight(-n);
        var result = this;
        while (n >= powers2Length) {
            result = fastMultiply(result, highestPower2);
            n -= powers2Length - 1;
        }
        return fastMultiply(result, powersOfTwo[n]);
    };

    BigInteger.prototype.shiftRight = function (n) {
        if (!isSmall(n)) {
            if (n.isNegative()) return this.shiftLeft(n.abs());
            return this.over(bigInt(2).pow(n));
        }
        n = +n;
        if (n < 0) return this.shiftLeft(-n);
        var result = this;
        while (n >= powers2Length) {
            if (result.equals(ZERO)) return result;
            result = fastDivMod(result, highestPower2).quotient;
            n -= powers2Length - 1;
        }
        return fastDivMod(result, powersOfTwo[n]).quotient;
    };

    // Reference: http://en.wikipedia.org/wiki/Bitwise_operation#Mathematical_equivalents
    function bitwise(x, y, fn) {
        var sum = ZERO;
        var limit = max(x.abs(), y.abs());
        var n = 0, _2n = ONE;
        while (_2n.lesserOrEquals(limit)) {
            var xMod, yMod;
            xMod = x.over(_2n).isEven() ? 0 : 1;
            yMod = y.over(_2n).isEven() ? 0 : 1;

            sum = sum.add(_2n.times(fn(xMod, yMod)));

            _2n = fastMultiply(_2n, 2);
        }
        return sum;
    }

    BigInteger.prototype.not = function () {
        var body = bitwise(this, this, function (xMod) { return (xMod + 1) % 2; });
        return !this.sign ? body.negate() : body;
    };

    BigInteger.prototype.and = function (n) {
        n = parseInput(n);
        var body = bitwise(this, n, function (xMod, yMod) { return xMod * yMod; });
        return this.sign && n.sign ? body.negate() : body;
    };

    BigInteger.prototype.or = function (n) {
        n = parseInput(n);
        var body = bitwise(this, n, function (xMod, yMod) { return (xMod + yMod + xMod * yMod) % 2 });
        return this.sign || n.sign ? body.negate() : body;
    };

    BigInteger.prototype.xor = function (n) {
        n = parseInput(n);
        var body = bitwise(this, n, function (xMod, yMod) { return (xMod + yMod) % 2; });
        return this.sign ^ n.sign ? body.negate() : body;
    };
    
    
    function TwosCompBitWise(x, y, fn, bits) {
    	//both 2Complements need equal many bits
    	var bitCount = 0;
    	if (x.abs().greaterOrEquals(y.abs())) {
    		x = x.toTwosComp(bits);
    		bitCount = x.length;
    		y = y.toTwosComp(bitCount);
    	} else {
    		y = y.toTwosComp(bits);
    		bitCount = y.length;
    		x = x.toTwosComp(bitCount);
    	}
    	
    	var result = "";
    	for (var i = 0; i < bitCount; i++) {
    		var a = parseInt(x[i]);
    		var b = parseInt(y[i]);
    		result += fn(a, b);
    	}
    	    	
    	return fromTwosComp(result);
    }
    
    BigInteger.prototype.TwosCompNot = function (bits) {
    	return TwosCompBitWise(this, this, function(a, b) { return (a + 1) % 2; }, bits);
    }
    
    BigInteger.prototype.TwosCompAnd = function (n, bits) {
    	return TwosCompBitWise(this, n, function(a, b) { return (a * b); }, bits);
    }
    
    BigInteger.prototype.TwosCompOr  = function (n, bits) {
    	return TwosCompBitWise(this, n, function(a, b) { return (a + b + a * b) % 2; }, bits);
    }
    
    BigInteger.prototype.TwosCompXor = function (n, bits) {
    	return TwosCompBitWise(this, n, function(a, b) { return (a + b) % 2; }, bits);
    }

    BigInteger.prototype.toString = function (radix) {
        if (radix === undefined) {
            radix = 10;
        }
        if (radix !== 10) return toBase(this, radix);
        var first = this;
        var str = "", len = first.value.length;
        if (len === 0 || (len === 1 && first.value[0] === 0)) {
            return "0";
        }
        len -= 1;
        str = first.value[len].toString();
        while (--len >= 0) {
            var digit = first.value[len].toString();
            str += zeros.slice(digit.length) + digit;
        }
        var s = first.sign === sign.positive ? "" : "-";
        return s + str;
    };
    BigInteger.prototype.toJSNumber = function () {
        return this.valueOf();
    };
    BigInteger.prototype.valueOf = function () {
        if (this.value.length === 1) return this.sign ? -this.value[0] : this.value[0];
        return +this.toString();
    };

    var ZERO = new BigInteger([0], sign.positive);
    var ONE = new BigInteger([1], sign.positive);
    var MINUS_ONE = new BigInteger([1], sign.negative);


    function parseInput(text) {
        if (text instanceof BigInteger) return text;
        if (Math.abs(+text) < base && +text === (+text | 0)) {
            var value = +text;
            return new BigInteger([Math.abs(value)], (value < 0 || (1 / value) === -Infinity));
        }
        text += "";
        var s = sign.positive, value = [];
        if (text[0] === "-") {
            s = sign.negative;
            text = text.slice(1);
        }
        var text = text.split(/e/i);
        if (text.length > 2) throw new Error("Invalid integer: " + text.join("e"));
        if (text[1]) {
            var exp = text[1];
            if (exp[0] === "+") exp = exp.slice(1);
            exp = parseInput(exp);
            var decimalPlace = text[0].indexOf(".");
            if (decimalPlace >= 0) {
                exp = exp.minus(text[0].length - decimalPlace);
                text[0] = text[0].slice(0, decimalPlace) + text[0].slice(decimalPlace + 1);
            }
            if (exp.lesser(0)) throw new Error("Cannot include negative exponent part for integers");
            while (exp.notEquals(0)) {
                text[0] += "0";
                exp = exp.prev();
            }
        }
        text = text[0];
        if (text === "-0") text = "0";
        var isValid = /^([0-9][0-9]*)$/.test(text);
        if (!isValid) throw new Error("Invalid integer: " + text);
        while (text.length) {
            var divider = text.length > logBase ? text.length - logBase : 0;
            value.push(+text.slice(divider));
            text = text.slice(0, divider);
        }
        return new BigInteger(trim(value), s);
    }

    var parseBase = function (text, base) {
        base = parseInput(base);
        var val = ZERO;
        var digits = [];
        var i;
        var isNegative = false;
        function parseToken(text) {
            var c = text[i].toLowerCase();
            if (i === 0 && text[i] === "-") {
                isNegative = true;
                return;
            }
            if (/[0-9]/.test(c)) digits.push(parseInput(c));
            else if (/[a-z]/.test(c)) digits.push(parseInput(c.charCodeAt(0) - 87));
            else if (c === "<") {
                var start = i;
                do { i++; } while (text[i] !== ">");
                digits.push(parseInput(text.slice(start + 1, i)));
            }
            else throw new Error(c + " is not a valid character");
        }
        for (i = 0; i < text.length; i++) {
            parseToken(text);
        }
        digits.reverse();
        for (i = 0; i < digits.length; i++) {
            val = val.add(digits[i].times(base.pow(i)));
        }
        return isNegative ? val.negate() : val;
    };

    function stringify(digit) {
        var v = digit.value;
        if (v.length === 1 && v[0] <= 36) {
            return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(v[0]);
        }
        return "<" + v + ">";
    }

    function toBase(n, base) {
        base = bigInt(base);
        if (base.equals(0)) {
            if (n.equals(0)) return "0";
            throw new Error("Cannot convert nonzero numbers to base 0.");
        }
        if (base.equals(-1)) {
            if (n.equals(0)) return "0";
            if (n.lesser(0)) return Array(1 - n).join("10");
            return "1" + Array(+n).join("01");
        }
        var minusSign = "";
        if (n.isNegative() && base.isPositive()) {
            minusSign = "-";
            n = n.abs();
        }
        if (base.equals(1)) {
            if (n.equals(0)) return "0";
            return minusSign + Array(+n + 1).join(1);
        }
        var out = [];
        var left = n, divmod;
        while (left.lesser(0) || left.compareAbs(base) >= 0) {
            divmod = left.divmod(base);
            left = divmod.quotient;
            var digit = divmod.remainder;
            if (digit.lesser(0)) {
                digit = base.minus(digit).abs();
                left = left.next();
            }
            out.push(stringify(digit));
        }
        out.push(stringify(left));
        return minusSign + out.reverse().join("");
    }

    var fnReturn = function (a, b) {
        if (typeof a === "undefined") return ZERO;
        if (typeof b !== "undefined") return parseBase(a, b);
        return parseInput(a);
    };
    fnReturn.zero = ZERO;
    fnReturn.one = ONE;
    fnReturn.minusOne = MINUS_ONE;
    fnReturn.randBetween = randBetween;
    fnReturn.min = min;
    fnReturn.max = max;
    fnReturn.gcd = gcd;
    fnReturn.lcm = lcm;
    return fnReturn;
})();

if (typeof module !== "undefined") {
    module.exports = bigInt;
}
