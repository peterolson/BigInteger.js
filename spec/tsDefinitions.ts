import * as bigInt from '../BigInteger';
import * as _ from 'lodash';

const staticFns = _.keysIn(bigInt);
const instanceFns = _(bigInt())
    .functionsIn()
    .reject((fn : string) => {
        return (
            fn === '_multiplyBySmall' // Filter out private function
        );
    })
    .value();

const testedStaticFns = [
    'fromArray',
    'gcd',
    'isInstance',
    'lcm',
    'max',
    'min',
    'minusOne',
    'one',
    'randBetween',
    'zero',
].concat(_.range(-999, 1000).map((i : number) => i.toString()));

const testedInstanceFns = [
    'abs',
    'add',
    'and',
    'bitLength',
    'compare',
    'compareAbs',
    'compareTo',
    'divide',
    'divmod',
    'eq',
    'equals',
    'geq',
    'greater',
    'greaterOrEquals',
    'gt',
    'isDivisibleBy',
    'isEven',
    'isNegative',
    'isOdd',
    'isPositive',
    'isPrime',
    'isProbablePrime',
    'isUnit',
    'isZero',
    'leq',
    'lesser',
    'lesserOrEquals',
    'lt',
    'minus',
    'mod',
    'modInv',
    'modPow',
    'multiply',
    'negate',
    'neq',
    'next',
    'not',
    'notEquals',
    'or',
    'over',
    'plus',
    'pow',
    'prev',
    'remainder',
    'shiftLeft',
    'shiftRight',
    'square',
    'subtract',
    'times',
    'toArray',
    'toJSNumber',
    'toString',
    'toJSON',
    'valueOf',
    'xor',
];

const untestedStaticFns = _.difference(staticFns, testedStaticFns);
const removedStaticFns = _.difference(testedStaticFns, staticFns);
const untestedInstanceFns = _.difference(instanceFns, testedInstanceFns);
const removedInstanceFns = _.difference(testedInstanceFns, instanceFns);

if (untestedStaticFns.length) {
    throw new Error(`New static functions need to be added to the TS definition: ${untestedStaticFns}`);
};

if (untestedInstanceFns.length) {
    throw new Error(`New instance functions need to be added to the TS definition: ${untestedInstanceFns}`);
};

if (removedStaticFns.length) {
    throw new Error(`Static functions need to be removed from the TS definition: ${removedStaticFns}`);
};

if (removedInstanceFns.length) {
    throw new Error(`Instance functions need to be removed from the TS definition: ${removedInstanceFns}`);
};

// constructor tests
const noArgument = bigInt();
const numberArgument = bigInt(93);
const nativeBigintArgument = bigInt(93n);
const stringArgument = bigInt("75643564363473453456342378564387956906736546456235345");
const baseArgumentInt = bigInt("101010", 2);
const baseArgumentStr = bigInt("101010", "2");
const baseArgumentBi  = bigInt("101010", bigInt(2));
const bigIntArgument = bigInt(noArgument);

// method tests
const x = bigInt(10);
let isBigInteger: bigInt.BigInteger;
let isNumber: number;
let isBoolean: boolean;
let isString: string;
let isDivmod: {quotient: bigInt.BigInteger, remainder: bigInt.BigInteger};
let isBaseArray: bigInt.BaseArray;

// Static methods/properties
isBigInteger = bigInt.minusOne;
isBigInteger = bigInt.zero;
isBigInteger = bigInt.one;

isBigInteger = bigInt[-999];
isBigInteger = bigInt[0];
isBigInteger = bigInt[999];

isBigInteger = bigInt.fromArray([1, 2, 3]);
isBigInteger = bigInt.fromArray([1n, 2n, 3n]);
isBigInteger = bigInt.fromArray(['1', '2', '3']);
isBigInteger = bigInt.fromArray([bigInt.one, bigInt.zero, bigInt(9)], 10, true);

isBigInteger = bigInt.gcd(0, 1);
isBoolean = bigInt.isInstance(x);
isBigInteger = bigInt.lcm(0, 1);
isBigInteger = bigInt.max(0, 1);
isBigInteger = bigInt.min(0, 1);
isBigInteger = bigInt.randBetween(0, 1);
isBigInteger = bigInt.randBetween(0, 1, () => 0.5);

// Instance methods
isBigInteger = x.abs();
isBigInteger = x.add(0).add(x).add("100").add(100n);
isBigInteger = x.and(0).and(x).and("100").and(100n);

isNumber = x.compare(0);
isNumber = x.compare(x);
isNumber = x.compare("100");
isNumber = x.compare(100n);

isNumber = x.compareAbs(0);
isNumber = x.compareAbs(x);
isNumber = x.compareAbs("100");
isNumber = x.compareAbs(100n);

isNumber = x.compareTo(0);
isNumber = x.compareTo(x);
isNumber = x.compareTo("100");
isNumber = x.compareTo(100n);

isBigInteger = x.divide(10).divide(x).divide('10').divide(10n);

isDivmod = x.divmod(10);
isDivmod = x.divmod(x);
isDivmod = x.divmod("100");
isDivmod = x.divmod(100n);

isBoolean = x.eq(0);
isBoolean = x.eq(x);
isBoolean = x.eq("100");
isBoolean = x.eq(100n);

isBoolean = x.equals(0);
isBoolean = x.equals(x);
isBoolean = x.equals("100");
isBoolean = x.equals(100n);

isBoolean = x.geq(0);
isBoolean = x.geq(x);
isBoolean = x.geq("100");
isBoolean = x.geq(100n);

isBoolean = x.greater(0);
isBoolean = x.greater(x);
isBoolean = x.greater("100");
isBoolean = x.greater(100n);

isBoolean = x.greaterOrEquals(0);
isBoolean = x.greaterOrEquals(x);
isBoolean = x.greaterOrEquals("100");
isBoolean = x.greaterOrEquals(100n);

isBoolean = x.gt(0);
isBoolean = x.gt(x);
isBoolean = x.gt("100");
isBoolean = x.gt(100n);

isBoolean = x.isDivisibleBy(x);
isBoolean = x.isEven();
isBoolean = x.isNegative();
isBoolean = x.isOdd();
isBoolean = x.isPositive();
isBoolean = x.isPrime();

isBoolean = x.isProbablePrime();
isBoolean = x.isProbablePrime(5);
isBoolean = x.isProbablePrime(11, () => 0.5);

isBoolean = x.isUnit();
isBoolean = x.isZero();
isBoolean = x.leq(x);
isBoolean = x.lesser(0);
isBoolean = x.lesserOrEquals(0);
isBoolean = x.lt(0);
isBigInteger = x.minus(0).minus(x).minus('0').minus(0n);
isBigInteger = x.mod(10).mod(x).mod('10').mod(10n);
isBigInteger = bigInt(3).modInv(11).modInv(11n);
isBigInteger = x.modPow(10, 2).modPow(x, x).modPow('10', '2').modPow(10n, 2n);
isBigInteger = x.multiply(0).multiply(x).multiply('0').multiply(0n);
isBigInteger = x.negate();
isBoolean = x.neq(x);
isBigInteger = x.next();
isBigInteger = x.not();

isBoolean = x.notEquals(0);
isBoolean = x.notEquals(x);
isBoolean = x.notEquals("100");
isBoolean = x.notEquals(100n);

isBigInteger = x.or(10).or(x).or('10').or(10n);
isBigInteger = x.over(10).over(x).over('10').over(10n);
isBigInteger = x.plus(0).plus(x).plus('0').plus(0n);
isBigInteger = x.pow(0).pow(x).pow('0').pow(0n);
isBigInteger = x.prev();
isBigInteger = x.remainder(10).remainder(x).remainder('10').remainder(10n);
isBigInteger = x.shiftLeft(0).shiftLeft('0').shiftLeft(0n);
isBigInteger = x.shiftRight(0).shiftRight('0').shiftRight(0n);
isBigInteger = x.square();
isBigInteger = x.subtract(0).subtract(x).subtract('0').subtract(0n);
isBigInteger = x.times(0).times(x).times('0').times(0n);
isNumber = x.toJSNumber();

isBaseArray = x.toArray(10);
isBaseArray = x.toArray(36);

isString = x.toString();
isString = x.toString(36);
isString = x.toJSON();

isNumber = x.valueOf();
isBigInteger = x.xor(0).xor(x).xor('0').xor(0n);
