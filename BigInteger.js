var bigInt = (function () {
	var base = 10000000, logBase = 7;
	var sign = {
		positive: false,
		negative: true
	};

	var normalize = function (first, second) {
		var a = first.value, b = second.value;
		var length = a.length > b.length ? a.length : b.length;
		for (var i = 0; i < length; i++) {
			a[i] = a[i] || 0;
			b[i] = b[i] || 0;
		}
		first.value = a;
		second.value = b;
	};

	var parse = function (text, first) {
		if (typeof text === "object") return text;
		text += "";
		var s = sign.positive, value = [];
		if (text[0] === "-") {
			s = sign.negative;
			text = text.slice(1);
		}
		var isValid = /^([1-9][0-9]*)|(\-?0)$/.test(text);
		if (!isValid) throw new Error("Invalid integer");
		while (text.length) {
			var divider = text.length > logBase ? text.length - logBase : 0;
			value.push(+text.slice(divider));
			text = text.slice(0, divider);
		}
		var val = bigInt(value, s);
		if (first) normalize(first, val);
		return val;
	};

	var bigInt = function (value, s) {
		var self = {
			value: value,
			sign: s
		};
		var o = {
			value: value,
			sign: s,
			negate: function (m) {
				var first = m || self;
				return bigInt(first.value, !first.sign);
			},
			abs: function (m) {
				var first = m || self;
				return bigInt(first.value, sign.positive);
			},
			add: function (n, m) {
				var s, first = self, second;
				if (m) (first = parse(n)) && (second = parse(m));
				else second = parse(n, first);
				s = first.sign;
				if (first.sign !== second.sign) {
					first = bigInt(first.value, sign.positive);
					second = bigInt(second.value, sign.positive);
					return s === sign.positive ?
						o.subtract(first, second) :
						o.subtract(second, first);
				}
				var a = first.value, b = second.value;
				var result = [],
					carry = 0;
				for (var i = 0; i < a.length || carry > 0; i++) {
					var sum = a[i] + b[i] + carry;
					carry = sum > base ? 1 : 0;
					sum -= carry * base;
					result.push(sum);
				}
				return bigInt(result, s);
			},
			plus: function (n, m) {
				return o.add(n, m);
			},
			subtract: function (n, m) {
				var s, first = self, second;
				if (m) (first = parse(n)) && (second = parse(m));
				else second = parse(n, first);
				if (first.sign !== second.sign) return o.add(first, o.negate(second));
				if (first.sign === sign.negative) return o.subtract(o.negate(second), o.negate(first));
				if (o.compare(first, second) === -1) return o.negate(o.subtract(second, first));
				var a = first.value, b = second.value;
				var result = [],
					borrow = 0;
				for (var i = 0; i < a.length; i++) {
					a[i] -= borrow;
					borrow = a[i] < b[i] ? 1 : 0;
					var minuend = (borrow * base) + a[i] - b[i];
					result.push(minuend);
				}
				return bigInt(result, sign.positive);
			},
			minus: function (n, m) {
				return o.subtract(n, m);
			},
			multiply: function (n, m) {
				var s, first = self, second;
				if (m) (first = parse(n)) && (second = parse(m));
				else second = parse(n, first);
				s = first.sign !== second.sign;
				var a = first.value, b = second.value;
				var resultSum = [];
				for (var i = 0; i < a.length; i++) {
					resultSum[i] = [];
					var j = i;
					while (j--) {
						resultSum[i].push(0);
					}
				}
				var carry = 0;
				for (var i = 0; i < a.length; i++) {
					var x = a[i];
					for (var j = 0; j < b.length || carry > 0; j++) {
						var y = b[j];
						var product = y ? (x * y) + carry : carry;
						carry = product > base ? Math.floor(product / base) : 0;
						product -= carry * base;
						resultSum[i].push(product);
					}
				}
				var max = -1;
				for (var i = 0; i < resultSum.length; i++) {
					var len = resultSum[i].length;
					if (len > max) max = len;
				}
				var result = [], carry = 0;
				for (var i = 0; i < max || carry > 0; i++) {
					var sum = carry;
					for (var j = 0; j < resultSum.length; j++) {
						sum += resultSum[j][i] || 0;
					}
					carry = sum > base ? Math.floor(sum / base) : 0;
					sum -= carry * base;
					result.push(sum);
				}
				return bigInt(result, s);
			},
			times: function (n, m) {
				return o.multiply(n, m);
			},
			next: function (m) {
				var first = m || self;
				return o.add(first, 1);
			},
			prev: function (m) {
				var first = m || self;
				return o.subtract(first, 1);
			},
			compare: function (n, m, compareAbs) {
				var first = self, second;
				if (m) (first = parse(n)) && (second = parse(m));
				else second = parse(n, first);
				if (second.sign !== first.sign) return first.sign === sign.positive ? 1 : -1;
				var multiplier = first.sign === sign.positive || compareAbs ? 1 : -1;
				var a = first.value, b = second.value;
				for (var i = a.length - 1; i >= 0; i--) {
					if (a[i] > b[i]) return 1 * multiplier;
					if (b[i] > a[i]) return -1 * multiplier;
				}
				return 0;
			},
			compareAbs: function (n, m) {
				return o.compare(n, m, true);
			},
			equals: function (n, m) {
				return o.compare(n, m) === 0;
			},
			notEquals: function (n, m) {
				return !o.equals(n, m);
			},
			less: function (n, m) {
				return o.compare(n, m) < 0;
			},
			greater: function (n, m) {
				return o.compare(n, m) > 0;
			},
			greaterOrEquals: function (n, m) {
				return o.compare(n, m) >= 0;
			},
			lessOrEquals: function (n, m) {
				return o.compare(n, m) <= 0;
			},
			toString: function (m) {
				var first = m || self;
				var str = "", len = first.value.length;
				while (len--) {
					str += first.value[len];
				}
				while (str[0] === "0") {
					str = str.slice(1);
				}
				if (!str.length) str = "0";
				var s = first.sign === sign.positive ? "" : "-";
				return s + str;
			}
		};
		return o;
	};

	//multiply, divide, mod, pow

	return function (a) {
		if (typeof a === "undefined") return bigInt(0);
		return parse(a);
	};
})();