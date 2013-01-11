/// <reference path="BigInteger.js" />
var testResults = (function (bigInt) {
	var assertions = [];
	var assert = function (obj) {
		for (var i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
			var test = obj[i], title = i;
			var result = test ? "<b>Passed</b>" : "<u>Failed</u>";
			assertions.push(title + ": " + result);
		}
	};

	function factorial(n) {
	    if (n.equals(bigInt.zero) || n.equals(bigInt.one)) {
	        return bigInt.one;
	    }
	    return factorial(n.prev()).times(n);
	}

	assert({
	    "1 = 1": bigInt("1").equals("1"),
	    "987 = 987": bigInt("987").equals("987"),
	    "-123456789 = -123456789": bigInt("-123456789").equals("-123456789"),
	    "12e5 = 1200000": bigInt("12e5").equals(1200000),
	    "str.equals(num)": bigInt("1").equals(1),
	    "bInt.equals(bInt)": bigInt(123).equals(bigInt(123)),
	    "0 = -0": bigInt("0").greater("-0"),
	    "54 != -54": bigInt(54).notEquals(-54),
	    "4 > 2": bigInt(4).greater(2),
	    "4 >= 2": bigInt(4).greaterOrEquals(2),
	    "2 >= 2": bigInt(2).greaterOrEquals(2),
	    "2 > -2": bigInt(2).greater(-2),
	    "2 < 4": bigInt(2).lesser(4),
	    "2 <= 4": bigInt(2).lesserOrEquals(4),
	    "2 <= 2": bigInt(2).lesserOrEquals(2),
	    "-2 < 2": bigInt(-2).lesser(2),
	    "0 != 1": bigInt(0).notEquals(1),
	    "1 + 1 = 2": bigInt(1).plus(1).equals(2),
	    "1 + -5 = -4": bigInt(1).plus(-5).equals(-4),
	    "-1 + 5 = 4": bigInt(-1).plus(5).equals(4),
	    "-1 + -5 = -6": bigInt(-1).plus(-5).equals(-6),
	    "1234567890987654321 + 9876543210123456789": bigInt("1234567890987654321").plus("9876543210123456789").equals("11111111101111111110"),
	    "7 - 3 = 4": bigInt(7).minus(3).equals(4),
	    "7 - -3 = 10": bigInt(7).minus(-3).equals(10),
	    "-7 - 3 = -10": bigInt(-7).minus(3).equals(-10),
	    "0 - 5 = -5": bigInt(0).minus(5).equals(-5),
	    "|-2| = 2": bigInt(-2).abs().equals(2),
	    "100 * 100 = 10000": bigInt(100).times(100).equals(10000),
	    "-100 * 100 = -10000": bigInt(-100).times(100).equals(-10000),
	    "100 * -100 = -10000": bigInt(100).times(-100).equals(-10000),
	    "-100 * -100 = 10000": bigInt(-100).times(-100).equals(10000),
	    "1234567890987654321 * 132435465768798 = 163500573666152634716420931676158": bigInt("1234567890987654321").times("132435465768798").equals("163500573666152634716420931676158"),
	    "15 / 5 = 3": bigInt(15).over(5).equals(3),
	    "15 / -5 = -3": bigInt(15).over(-5).equals(-3),
	    "-15 / 5 = -3": bigInt(-15).over(5).equals(-3),
	    "-15 / -5 = 3": bigInt(-15).over(-5).equals(3),
	    "786456456335437356436 / 5423424653 = 145011041298": bigInt("786456456335437356436").over("5423424653").equals(145011041298),
	    "93453764643534523 / 2342 = 39903400787162": bigInt("93453764643534523").over(2342).equals("39903400787162"),
	    "124234233 % 2 = 1": bigInt(124234233).mod(2).equals(1),
	    "124234233 % -2 = 1": bigInt(124234233).mod(-2).equals(1),
	    "-124234233 % 2 = -1": bigInt(-124234233).mod(2).equals(-1),
	    "-124234233 % -2 = -1": bigInt(-124234233).mod(-2).equals(-1),
	    "93453764643534523 % 2342 = 1119": bigInt("93453764643534523").mod(2342).equals(1119),
	    "2 ^ 3 = 8": bigInt(2).pow(3).equals(8),
	    "-2 ^ 3 = -8": bigInt(-2).pow(3).equals(-8),
	    "2 ^ -3 = 0": bigInt(2).pow(-3).equals(0),
	    "0-- = -1": bigInt.zero.prev().equals(-1),
	    "9007199254740992++ = 9007199254740993": bigInt(9007199254740992).next().equals("9007199254740993"),
		"Leading zeroes":bigInt("10000000").toString()=="10000000",
		"Leading zeroes 2":bigInt("100001010000000").toString()=="100001010000000",
		"10 Factorial" : (function () {
			var res = "3628800"; //http://www.wolframalpha.com/input/?i=10%21
			return factorial(bigInt(10)).equals(res);
		})(),
		"100 Factorial" : (function () {
			var res = "93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000"; //http://puzzles.nigelcoldwell.co.uk/nineteen.htm
			return factorial(bigInt(100)).equals(res);
		})(),
	    "Fail on negative exponent": (function () {
	        try {
	            bigInt("12e-5");
	            return false;
	        } catch (e) {
	            return true;
	        }
	    })(),
	    "Fail on divide by zero": (function () {
	        try {
	            bigInt("135346").divide("0");
	            return false;
	        } catch (e) {
	            return true;
	        }
	    })(),
	    "Fail on invalid character in number": (function () {
	        try {
	            bigInt("43a34");
	            return false;
	        } catch (e) {
	            return true;
	        }
	    })()
	});
	return assertions.join("<br>");
})(bigInt);