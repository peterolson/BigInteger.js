if (typeof require === "function") bigInt = require("../BigInteger.js");

describe("BigInteger", function () {
    beforeAll(function () {
        jasmine.addCustomEqualityTester(function (a, b) {
            return bigInt(a).equals(b);
        });
    });

    it("can handle large numbers", function () {
        var tenFactorial = "3628800",
            hundredFactorial = "93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000",
            threeToTenThousand = "16313501853426258743032567291811547168121324535825379939348203261918257308143190787480155630847848309673252045223235795433405582999177203852381479145368112501453192355166224391025423628843556686559659645012014177448275529990373274425446425751235537341867387607813619937225616872862016504805593174059909520461668500663118926911571773452255850626968526251879139867085080472539640933730243410152186914328917354576854457274195562218013337745628502470673059426999114202540773175988199842487276183685299388927825296786440252999444785694183675323521704432195785806270123388382931770198990841300861506996108944782065015163410344894945809337689156807686673462563038164792190665340124344133980763205594364754963451564072340502606377790585114123814919001637177034457385019939060232925194471114235892978565322415628344142184842892083466227875760501276009801530703037525839157893875741192497705300469691062454369926795975456340236777734354667139072601574969834312769653557184396147587071260443947944862235744459711204473062937764153770030210332183635531818173456618022745975055313212598514429587545547296534609597194836036546870491771927625214352957503454948403635822345728774885175809500158451837389413798095329711993092101417428406774326126450005467888736546254948658602484494535938888656542746977424368385335496083164921318601934977025095780370104307980276356857350349205866078371806065542393536101673402017980951598946980664330391505845803674248348878071010412918667335823849899623486215050304052577789848512410263834811719236949311423411823585316405085306164936671137456985394285677324771775046050970865520893596151687017153855755197348199659070192954771308347627111052471134476325986362838585959552209645382089055182871854866744633737533217524880118401787595094060855717010144087136495532418544241489437080074716158404895914136451802032446707961058757633345691696743293869623745410870051851590672859347061212573446572045088465460616826082579731686004585218284333452396157730036306379421822435818001505905203918209206969662326706952623512427380240468784114535101496733983401240219840048956733689309620321613793757156727562461651933397540266795963865921590913322060572673349849253303397874242381960775337182730037783698708748781738419747698880321601186310506332869704931303076839444790968339306301273371014087248060946851793697973114432706759288546077622831002526800554849696867710280945946603669593797354642136622231192695027321229511912952940320879763123151760555959496961163141455688278842949587288399100273691880018774147568892650186152065335219113072582417699616901995530249937735219099786758954892534365835235843156112799728164123461219817343904782402517111603206575330527850752564642995318064985900815557979945885931124351303252811255254295797082281946658798705979077492469849644183166585950844953164726896146168297808178398470451561320526180542310840744843107469368959707726836608471817060598771730170755446473440774031371227437651048421606224757527085958515947273151027400662948161111284777828103531499488913672800783167888051177155427285103861736658069404797695900758820465238673970882660162285107599221418743657006872537842677883708807515850397691812433880561772652364847297019508025848964833883225165668986935081274596293983121864046277268590401580209059988500511262470167150495261908136688693861324081559046336288963037090312033522400722360882494928182809075406914319957044927504420797278117837677431446979085756432990753582588102440240611039084516401089948868433353748444104639734074519165067632941419347985624435567342072815910754484123812917487312938280670403228188813003978384081332242484646571417574404852962675165616101527367425654869508712001788393846171780457455963045764943565964887518396481296159902471996735508854292964536796779404377230965723361625182030798297734785854606060323419091646711138678490928840107449923456834763763114226000770316931243666699425694828181155048843161380832067845480569758457751090640996007242018255400627276908188082601795520167054701327802366989747082835481105543878446889896230696091881643547476154998574015907396059478684978574180486798918438643164618541351689258379042326487669479733384712996754251703808037828636599654447727795924596382283226723503386540591321268603222892807562509801015765174359627788357881606366119032951829868274617539946921221330284257027058653162292482686679275266764009881985590648534544939224296689791195355783205968492422636277656735338488299104238060289209390654467316291591219712866052661347026855261289381236881063068219249064767086495184176816629077103667131505064964190910450196502178972477361881300608688593782509793781457170396897496908861893034634895715117114601514654381347139092345833472226493656930996045016355808162984965203661519182202145414866559662218796964329217241498105206552200001";
        function factorial(n) {
            if (n.equals(bigInt.zero) || n.equals(bigInt.one)) {
                return bigInt.one;
            }
            return factorial(n.prev()).times(n);
        }
        expect(factorial(bigInt(10))).toEqual(tenFactorial);
        expect(factorial(bigInt(100))).toEqual(hundredFactorial);
        expect(bigInt(3).pow(10000)).toEqual(threeToTenThousand);
    });

    // See issue #7
    //   https://github.com/peterolson/BigInteger.js/issues/7
    it("is immutable", function () {
        var n = bigInt(14930352);
        n.add(9227465);
        expect(n).toEqual(14930352);
        n.subtract(123456);
        expect(n).toEqual(14930352);
    });

    describe("Equality and comparison", function () {
        it("works for positive numbers", function () {
            expect(bigInt.one).toEqual(1);
            expect(1).not.toEqual(2);
            expect(0).not.toEqual(1);
            expect(987).toEqual(987);
            expect(987).not.toEqual(789);
            expect(7895).not.toEqual(9875);
            expect("98765432101234567890").toEqual("98765432101234567890");
            expect("98765432101234567890").not.toEqual("98765432101234567999");
            expect("98765432101234567890").not.toEqual("98765432101234567000");

            expect(bigInt(54).greater(45)).toBe(true);
            expect(bigInt(45).greater(54)).toBe(false);
            expect(bigInt(45).greater(45)).toBe(false);
            expect(bigInt("5498765432109876").greater("4598765432109876")).toBe(true);
            expect(bigInt("4598765432109876").greater("5498765432109876")).toBe(false);
            expect(bigInt("4598765432109876").greater("4598765432109876")).toBe(false);

            expect(bigInt(32).greaterOrEquals(23)).toBe(true);
            expect(bigInt(23).greaterOrEquals(32)).toBe(false);
            expect(bigInt(23).greaterOrEquals(23)).toBe(true);
            expect(bigInt("3298763232109876").greaterOrEquals("2398763232109876")).toBe(true);
            expect(bigInt("2398763232109876").greaterOrEquals("3298763232109876")).toBe(false);
            expect(bigInt("2398763232109876").greaterOrEquals("2398763232109876")).toBe(true);

            expect(bigInt(987).lesser(789)).toBe(false);
            expect(bigInt(789).lesser(987)).toBe(true);
            expect(bigInt(789).lesser(789)).toBe(false);
            expect(bigInt("987987698732109876").lesser("789987698732109876")).toBe(false);
            expect(bigInt("789987698732109876").lesser("987987698732109876")).toBe(true);
            expect(bigInt("789987698732109876").lesser("789987698732109876")).toBe(false);

            expect(bigInt(6012).lesserOrEquals(1195)).toBe(false);
            expect(bigInt(1195).lesserOrEquals(6012)).toBe(true);
            expect(bigInt(1195).lesserOrEquals(1195)).toBe(true);
            expect(bigInt("6012987660126012109876").lesserOrEquals("1195987660126012109876")).toBe(false);
            expect(bigInt("1195987660126012109876").lesserOrEquals("6012987660126012109876")).toBe(true);
            expect(bigInt("1195987660126012109876").lesserOrEquals("1195987660126012109876")).toBe(true);

            expect(bigInt(54).notEquals(45)).toBe(true);
            expect(bigInt(45).notEquals(54)).toBe(true);
            expect(bigInt(45).notEquals(45)).toBe(false);
            expect(bigInt("5498765432109876").notEquals("4598765432109876")).toBe(true);
            expect(bigInt("4598765432109876").notEquals("5498765432109876")).toBe(true);
            expect(bigInt("4598765432109876").notEquals("4598765432109876")).toBe(false);
        });

        it("works for negative numbers", function () {
            expect(bigInt.minusOne).toEqual(-1);
            expect(-1).not.toEqual(-2);
            expect(-0).not.toEqual(-1);
            expect(-987).toEqual(-987);
            expect(-987).not.toEqual(-789);
            expect(-7895).not.toEqual(-9875);
            expect("-98765432101234567890").toEqual("-98765432101234567890");
            expect("-98765432101234567890").not.toEqual("-98765432101234567999");
            expect("-98765432101234567890").not.toEqual("-98765432101234567000");

            expect(bigInt(-54).greater(-45)).toBe(false);
            expect(bigInt(-45).greater(-54)).toBe(true);
            expect(bigInt(-45).greater(-45)).toBe(false);
            expect(bigInt("-5498765432109876").greater("-4598765432109876")).toBe(false);
            expect(bigInt("-4598765432109876").greater("-5498765432109876")).toBe(true);
            expect(bigInt("-4598765432109876").greater("-4598765432109876")).toBe(false);

            expect(bigInt(-32).greaterOrEquals(-23)).toBe(false);
            expect(bigInt(-23).greaterOrEquals(-32)).toBe(true);
            expect(bigInt(-23).greaterOrEquals(-23)).toBe(true);
            expect(bigInt("-3298763232109876").greaterOrEquals("-2398763232109876")).toBe(false);
            expect(bigInt("-2398763232109876").greaterOrEquals("-3298763232109876")).toBe(true);
            expect(bigInt("-2398763232109876").greaterOrEquals("-2398763232109876")).toBe(true);

            expect(bigInt(-987).lesser(-789)).toBe(true);
            expect(bigInt(-789).lesser(-987)).toBe(false);
            expect(bigInt(-789).lesser(-789)).toBe(false);
            expect(bigInt("-987987698732109876").lesser("-789987698732109876")).toBe(true);
            expect(bigInt("-789987698732109876").lesser("-987987698732109876")).toBe(false);
            expect(bigInt("-789987698732109876").lesser("-789987698732109876")).toBe(false);

            expect(bigInt(-6012).lesserOrEquals(-1195)).toBe(true);
            expect(bigInt(-1195).lesserOrEquals(-6012)).toBe(false);
            expect(bigInt(-1195).lesserOrEquals(-1195)).toBe(true);
            expect(bigInt("-6012987660126012109876").lesserOrEquals("-1195987660126012109876")).toBe(true);
            expect(bigInt("-1195987660126012109876").lesserOrEquals("-6012987660126012109876")).toBe(false);
            expect(bigInt("-1195987660126012109876").lesserOrEquals("-1195987660126012109876")).toBe(true);

            expect(bigInt(-54).notEquals(-45)).toBe(true);
            expect(bigInt(-45).notEquals(-54)).toBe(true);
            expect(bigInt(-45).notEquals(-45)).toBe(false);
            expect(bigInt("-5498765432109876").notEquals("-4598765432109876")).toBe(true);
            expect(bigInt("-4598765432109876").notEquals("-5498765432109876")).toBe(true);
            expect(bigInt("-4598765432109876").notEquals("-4598765432109876")).toBe(false);
        });

        it("treats negative and positive numbers differently", function () {
            expect(54).not.toEqual(-54);
            expect("-123456789876543210").not.toEqual("123456789876543210");
            expect(bigInt(76).notEquals(-76)).toBe(true);

            expect(bigInt(2).greater(-2)).toBe(true);
            expect(bigInt(-2).greater(2)).toBe(false);
            expect(bigInt(2).greater(-3)).toBe(true);
            expect(bigInt(2).greater(-1)).toBe(true);
            expect(bigInt(-2).greater(3)).toBe(false);
            expect(bigInt(-2).greater(1)).toBe(false);

            expect(bigInt(2).greaterOrEquals(-2)).toBe(true);
            expect(bigInt(-2).greaterOrEquals(2)).toBe(false);
            expect(bigInt(2).greaterOrEquals(-3)).toBe(true);
            expect(bigInt(2).greaterOrEquals(-1)).toBe(true);
            expect(bigInt(-2).greaterOrEquals(3)).toBe(false);
            expect(bigInt(-2).greaterOrEquals(1)).toBe(false);

            expect(bigInt(2).lesser(-2)).toBe(false);
            expect(bigInt(-2).lesser(2)).toBe(true);
            expect(bigInt(2).lesser(-3)).toBe(false);
            expect(bigInt(2).lesser(-1)).toBe(false);
            expect(bigInt(-2).lesser(3)).toBe(true);
            expect(bigInt(-2).lesser(1)).toBe(true);

            expect(bigInt(2).lesserOrEquals(-2)).toBe(false);
            expect(bigInt(-2).lesserOrEquals(2)).toBe(true);
            expect(bigInt(2).lesserOrEquals(-3)).toBe(false);
            expect(bigInt(2).lesserOrEquals(-1)).toBe(false);
            expect(bigInt(-2).lesserOrEquals(3)).toBe(true);
            expect(bigInt(-2).lesserOrEquals(1)).toBe(true);
        });

        it("treats 0 and -0 the same", function () {
            expect(0).toEqual("-0");
            expect(bigInt.zero).toEqual("-0");
        });

        it("ignores leading zeros", function () {
            expect("0000000000").toEqual("0");
            expect("000000000000023").toEqual(23);
        });

        it("treats numbers constructed different ways the same", function () {
            expect("12e5").toEqual(12e5);
            expect(12e5).toEqual("1200000");
            expect("1").toEqual(1);
            expect(bigInt(12345)).toEqual("12345");
            expect(bigInt("9876543210")).toEqual(bigInt(9876543210));
        });
    });

    describe("Addition and subtraction", function () {
        it("by 0 is the identity", function () {
            expect(bigInt(1).add(0)).toEqual(1);
            expect(bigInt(-1).add(0)).toEqual(-1);
            expect(bigInt(0).add(-1)).toEqual(-1);
            expect(bigInt(0).add(153)).toEqual(153);
            expect(bigInt(153).add(0)).toEqual(153);
            expect(bigInt(0).add(-153)).toEqual(-153);
            expect(bigInt(-153).add(0)).toEqual(-153);
            expect(bigInt(0).add("9844190321790980841789")).toEqual("9844190321790980841789");
            expect(bigInt("9844190321790980841789").add(0)).toEqual("9844190321790980841789");
            expect(bigInt(0).add("-9844190321790980841789")).toEqual("-9844190321790980841789");
            expect(bigInt("-9844190321790980841789").add(0)).toEqual("-9844190321790980841789");

            expect(bigInt(1).minus(0)).toEqual(1);
            expect(bigInt(-1).minus(0)).toEqual(-1);
            expect(bigInt(153).minus(0)).toEqual(153);
            expect(bigInt(-153).minus(0)).toEqual(-153);
            expect(bigInt("9844190321790980841789").minus(0)).toEqual("9844190321790980841789");
            expect(bigInt("-9844190321790980841789").minus(0)).toEqual("-9844190321790980841789");
        });

        it("handles signs correctly", function () {
            expect(bigInt(1).add(1)).toEqual(2);
            expect(bigInt(1).add(-5)).toEqual(-4);
            expect(bigInt(-1).add(5)).toEqual(4);
            expect(bigInt(-1).add(-5)).toEqual(-6);
            expect(bigInt(5).add(1)).toEqual(6);
            expect(bigInt(5).add(-1)).toEqual(4);
            expect(bigInt(-5).add(1)).toEqual(-4);
            expect(bigInt(-5).add(-1)).toEqual(-6);

            expect(bigInt(1).minus(1)).toEqual(0);
            expect(bigInt(1).minus(-5)).toEqual(6);
            expect(bigInt(-1).minus(5)).toEqual(-6);
            expect(bigInt(-1).minus(-5)).toEqual(4);
            expect(bigInt(5).minus(1)).toEqual(4);
            expect(bigInt(5).minus(-1)).toEqual(6);
            expect(bigInt(-5).minus(1)).toEqual(-6);
            expect(bigInt(-5).minus(-1)).toEqual(-4);

            expect(bigInt("1234698764971301").add(5)).toEqual("1234698764971306");
            expect(bigInt("1234698764971301").add(-5)).toEqual("1234698764971296");
            expect(bigInt("-1234698764971301").add(5)).toEqual("-1234698764971296");
            expect(bigInt("-1234698764971301").add(-5)).toEqual("-1234698764971306");
            expect(bigInt(5).add("1234698764971301")).toEqual("1234698764971306");
            expect(bigInt(5).add("-1234698764971301")).toEqual("-1234698764971296");
            expect(bigInt(-5).add("1234698764971301")).toEqual("1234698764971296");
            expect(bigInt(-5).add("-1234698764971301")).toEqual("-1234698764971306");

            expect(bigInt("1234698764971301").minus(5)).toEqual("1234698764971296");
            expect(bigInt("1234698764971301").minus(-5)).toEqual("1234698764971306");
            expect(bigInt("-1234698764971301").minus(5)).toEqual("-1234698764971306");
            expect(bigInt("-1234698764971301").minus(-5)).toEqual("-1234698764971296");
            expect(bigInt(5).minus("1234698764971301")).toEqual("-1234698764971296");
            expect(bigInt(5).minus("-1234698764971301")).toEqual("1234698764971306");
            expect(bigInt(-5).minus("1234698764971301")).toEqual("-1234698764971306");
            expect(bigInt(-5).minus("-1234698764971301")).toEqual("1234698764971296");

            expect(bigInt("1234567890987654321").plus("9876543210123456789")).toEqual("11111111101111111110");
            expect(bigInt("1234567890987654321").plus("-9876543210123456789")).toEqual("-8641975319135802468");
            expect(bigInt("-1234567890987654321").plus("9876543210123456789")).toEqual("8641975319135802468");
            expect(bigInt("-1234567890987654321").plus("-9876543210123456789")).toEqual("-11111111101111111110");
            expect(bigInt("9876543210123456789").plus("1234567890987654321")).toEqual("11111111101111111110");
            expect(bigInt("9876543210123456789").plus("-1234567890987654321")).toEqual("8641975319135802468");
            expect(bigInt("-9876543210123456789").plus("1234567890987654321")).toEqual("-8641975319135802468");
            expect(bigInt("-9876543210123456789").plus("-1234567890987654321")).toEqual("-11111111101111111110");

            expect(bigInt("1234567890987654321").minus("9876543210123456789")).toEqual("-8641975319135802468");
            expect(bigInt("1234567890987654321").minus("-9876543210123456789")).toEqual("11111111101111111110");
            expect(bigInt("-1234567890987654321").minus("9876543210123456789")).toEqual("-11111111101111111110");
            expect(bigInt("-1234567890987654321").minus("-9876543210123456789")).toEqual("8641975319135802468");
            expect(bigInt("9876543210123456789").minus("1234567890987654321")).toEqual("8641975319135802468");
            expect(bigInt("9876543210123456789").minus("-1234567890987654321")).toEqual("11111111101111111110");
            expect(bigInt("-9876543210123456789").minus("1234567890987654321")).toEqual("-11111111101111111110");
            expect(bigInt("-9876543210123456789").minus("-1234567890987654321")).toEqual("-8641975319135802468");
        });

        it("carries over correctly", function () {
            expect(bigInt(9999999).add(1)).toEqual(10000000);
            expect(bigInt(10000000).minus(1)).toEqual(9999999);

            // Fibonacci; see issue #9
            //   https://github.com/peterolson/BigInteger.js/issues/9
            var fibs = ["1", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89", "144", "233", "377", "610", "987", "1597", "2584", "4181", "6765", "10946", "17711", "28657", "46368", "75025", "121393", "196418", "317811", "514229", "832040", "1346269", "2178309", "3524578", "5702887", "9227465", "14930352", "24157817", "39088169", "63245986", "102334155", "165580141", "267914296", "433494437", "701408733", "1134903170", "1836311903", "2971215073", "4807526976", "7778742049", "12586269025"];
            var number = bigInt(1);
            var last = bigInt(1);

            for (i = 2; i < 50; i++) {
                number = number.add(last);
                last = number.minus(last);
                expect(number).toEqual(fibs[i]);
            }
        });
    });

    describe("Multiplication", function () {
        it("by 0 equals 0", function () {
            expect(bigInt(0).times(0)).toEqual(0);
            expect(bigInt(0).times("-0")).toEqual(0);
            expect(bigInt(1).times(0)).toEqual("-0");
            expect(bigInt(-0).times(1)).toEqual(0);
            expect(bigInt("1234567890987654321").times(0)).toEqual("-0");
            expect(bigInt(-0).times("1234567890987654321")).toEqual(0);
            expect(bigInt(0).times("-1234567890987654321")).toEqual(0);
        });

        it("by 1 is the identity", function () {
            expect(bigInt(1).times(1)).toEqual(1);
            expect(bigInt(-1).times(1)).toEqual(-1);
            expect(bigInt(1).times(-1)).toEqual(-1);
            expect(bigInt(1).times(153)).toEqual(153);
            expect(bigInt(153).times(1)).toEqual(153);
            expect(bigInt(1).times(-153)).toEqual(-153);
            expect(bigInt(-153).times(1)).toEqual(-153);
            expect(bigInt(1).times("9844190321790980841789")).toEqual("9844190321790980841789");
            expect(bigInt("9844190321790980841789").times(1)).toEqual("9844190321790980841789");
            expect(bigInt(1).times("-9844190321790980841789")).toEqual("-9844190321790980841789");
            expect(bigInt("-9844190321790980841789").times(1)).toEqual("-9844190321790980841789");
        });

        it("handles signs correctly", function () {
            expect(bigInt(100).times(100)).toEqual(10000);
            expect(bigInt(100).times(-100)).toEqual(-10000);
            expect(bigInt(-100).times(100)).toEqual(-10000);
            expect(bigInt(-100).times(-100)).toEqual(10000);

            expect(bigInt(13579).times("163500573666152634716420931676158")).toEqual("2220174289812686626814279831230549482");
            expect(bigInt(13579).times("-163500573666152634716420931676158")).toEqual("-2220174289812686626814279831230549482");
            expect(bigInt(-13579).times("163500573666152634716420931676158")).toEqual("-2220174289812686626814279831230549482");
            expect(bigInt(-13579).times("-163500573666152634716420931676158")).toEqual("2220174289812686626814279831230549482");
            expect(bigInt("163500573666152634716420931676158").times(13579)).toEqual("2220174289812686626814279831230549482");
            expect(bigInt("163500573666152634716420931676158").times(-13579)).toEqual("-2220174289812686626814279831230549482");
            expect(bigInt("-163500573666152634716420931676158").times(13579)).toEqual("-2220174289812686626814279831230549482");
            expect(bigInt("-163500573666152634716420931676158").times(-13579)).toEqual("2220174289812686626814279831230549482");

            expect(bigInt("1234567890987654321").times("132435465768798")).toEqual("163500573666152634716420931676158");
            expect(bigInt("1234567890987654321").times("-132435465768798")).toEqual("-163500573666152634716420931676158");
            expect(bigInt("-1234567890987654321").times("132435465768798")).toEqual("-163500573666152634716420931676158");
            expect(bigInt("-1234567890987654321").times("-132435465768798")).toEqual("163500573666152634716420931676158");
        });

        it("carries over correctly", function () {
            expect(bigInt("50000005000000").times("10000001")).toEqual("500000100000005000000")

            // See pull request #21
            //   https://github.com/peterolson/BigInteger.js/pull/21
            expect(bigInt("50000005000000").times("10000001")).toEqual("500000100000005000000");
        });
    });

    describe("Division", function () {
        it("by 1 is the identity", function () {
            expect(bigInt(1).over(1)).toEqual(1);
            expect(bigInt(-1).over(1)).toEqual(-1);
            expect(bigInt(1).over(-1)).toEqual(-1);
            expect(bigInt(153).over(1)).toEqual(153);
            expect(bigInt(-153).over(1)).toEqual(-153);
            expect(bigInt("9844190321790980841789").over(1)).toEqual("9844190321790980841789");
            expect(bigInt("-9844190321790980841789").over(1)).toEqual("-9844190321790980841789");
        });

        it("by self is 1", function () {
            expect(bigInt(5).over(5)).toEqual(1);
            expect(bigInt(-5).over(-5)).toEqual(1);
            expect(bigInt("20194965098495006574").over("20194965098495006574")).toEqual(1);
            expect(bigInt("-20194965098495006574").over("-20194965098495006574")).toEqual(1);
        });

        it("by 0 throws an error", function () {
            expect(function () {
                bigInt(0).over(0);
            }).toThrow();
            expect(function () {
                bigInt(-0).over(0);
            }).toThrow();
            expect(function () {
                bigInt(5).over(0);
            }).toThrow();
            expect(function () {
                bigInt(-5).over(0);
            }).toThrow();
            expect(function () {
                bigInt("9549841598749874951041").over(0);
            }).toThrow();
            expect(function () {
                bigInt("-20964918940987496110974948").over(0);
            }).toThrow();
        });

        it("of 0 equals 0", function () {
            expect(bigInt(0).over(1)).toEqual(0);
            expect(bigInt(-0).over(1)).toEqual(0);
            expect(bigInt(-0).over("1234567890987654321")).toEqual(0);
            expect(bigInt(0).over("-1234567890987654321")).toEqual(0);
        });

        it("handles signs correctly", function () {
            expect(bigInt(10000).over(100)).toEqual(100);
            expect(bigInt(10000).over(-100)).toEqual(-100);
            expect(bigInt(-10000).over(100)).toEqual(-100);
            expect(bigInt(-10000).over(-100)).toEqual(100);
            expect(bigInt(100).over(-1000)).toEqual(0);

            expect(bigInt("163500573666152634716420931676158").over(13579)).toEqual("12040693251797086288859336598");
            expect(bigInt("163500573666152634716420931676158").over(-13579)).toEqual("-12040693251797086288859336598");
            expect(bigInt("-163500573666152634716420931676158").over(13579)).toEqual("-12040693251797086288859336598");
            expect(bigInt("-163500573666152634716420931676158").over(-13579)).toEqual("12040693251797086288859336598");

            expect(bigInt("1234567890987654321").over("132435465768798")).toEqual("9322");
            expect(bigInt("1234567890987654321").over("-132435465768798")).toEqual("-9322");
            expect(bigInt("-1234567890987654321").over("132435465768798")).toEqual("-9322");
            expect(bigInt("-1234567890987654321").over("-132435465768798")).toEqual("9322");

            expect(bigInt("786456456335437356436").over("-5423424653")).toEqual("-145011041298");
            expect(bigInt("-93453764643534523").over("-2342")).toEqual("39903400787162");
        });
    });

    describe("Modulo", function () {
        it("0 throws error", function () {
            expect(function () {
                bigInt(0).mod(0);
            }).toThrow();
            expect(function () {
                bigInt(-0).mod(0);
            }).toThrow();
            expect(function () {
                bigInt(5).mod(0);
            }).toThrow();
            expect(function () {
                bigInt(-5).mod(0);
            }).toThrow();
            expect(function () {
                bigInt("9549841598749874951041").mod(0);
            }).toThrow();
            expect(function () {
                bigInt("-20964918940987496110974948").mod(0);
            }).toThrow();
        });

        it("handles signs correctly", function () {
            expect(bigInt(124234233).mod(2)).toEqual(1);
            expect(bigInt(124234233).mod(-2)).toEqual(1);
            expect(bigInt(-124234233).mod(2)).toEqual(-1);
            expect(bigInt(-124234233).mod(-2)).toEqual(-1);
            expect(bigInt(2).mod(-1243233)).toEqual(2);
            expect(bigInt(-2).mod(-1243233)).toEqual(-2);

            expect(bigInt("786456456335437356436").mod("-5423424653")).toEqual("2663036842");
            expect(bigInt("93453764643534523").mod(-2342)).toEqual(1119);
            expect(bigInt(-32542543).mod(100000000)).toEqual(-32542543);
        });
    });

    describe("Power", function () {
        it("of 0 to 0 is 1 (mathematically debatable, but matches JavaScript behavior)", function () {
            expect(bigInt(0).pow(0)).toEqual(1);
            expect(bigInt(0).pow("-0")).toEqual(1);
            expect(bigInt("-0").pow(0)).toEqual(1);
            expect(bigInt("-0").pow("-0")).toEqual(1);
        });

        it("to negative numbers is 0", function () {
            expect(bigInt(0).pow(-298)).toEqual(0);
            expect(bigInt(543).pow(-2)).toEqual(0);
            expect(bigInt("323434643534523").pow(-1)).toEqual(0);
            expect(bigInt(-54302).pow("-543624724341214223562")).toEqual(0);
            expect(bigInt("-20199605604968").pow(-99)).toEqual(0);
        });

        it("handles signs correctly", function () {
            expect(bigInt(2).pow(3)).toEqual(8);
            expect(bigInt(-2).pow(3)).toEqual(-8);
            expect(bigInt("1036350201654").pow(4)).toEqual("1153522698998527286707879497611725813209153232656");
            expect(bigInt("-1036350201654").pow(4)).toEqual("1153522698998527286707879497611725813209153232656");
        });

        it("carries over correctly", function () {
            // See issue #5
            //   https://github.com/peterolson/BigInteger.js/issues/5
            expect(bigInt(100).pow(56).toString()).not.toEqual("0");
        });
    });

    describe("Power modulo", function () {
        it("works", function () {
            expect(bigInt(4).modPow(13, 497)).toEqual(445);

            // See Project Euler problem #97
            //   https://projecteuler.net/problem=97
            expect(bigInt(28433).times(bigInt(2).modPow(7830457, "1e10")).plus(1).mod("1e10")).toEqual(8739992577);
        });
    });

    describe("Square", function () {
        it("works", function () {
            expect(bigInt(0).square()).toEqual(0);
            expect(bigInt(16).square()).toEqual(256);
            expect(bigInt(-16).square()).toEqual(256);
            expect(bigInt("65536").square()).toEqual("4294967296");
        });
    });

    describe("min and max", function () {
        it("work", function () {
            expect(bigInt.max(6, 6)).toEqual(6);
            expect(bigInt.max(77, 432)).toEqual(432);
            expect(bigInt.max(432, 77)).toEqual(432);
            expect(bigInt.max(77, -432)).toEqual(77);
            expect(bigInt.max(432, -77)).toEqual(432);
            expect(bigInt.max(-77, 432)).toEqual(432);
            expect(bigInt.max(-432, 77)).toEqual(77);
            expect(bigInt.max(-77, -432)).toEqual(-77);
            expect(bigInt.max(-432, -77)).toEqual(-77);

            expect(bigInt.min(6, 6)).toEqual(6);
            expect(bigInt.min(77, 432)).toEqual(77);
            expect(bigInt.min(432, 77)).toEqual(77);
            expect(bigInt.min(77, -432)).toEqual(-432);
            expect(bigInt.min(432, -77)).toEqual(-77);
            expect(bigInt.min(-77, 432)).toEqual(-77);
            expect(bigInt.min(-432, 77)).toEqual(-432);
            expect(bigInt.min(-77, -432)).toEqual(-432);
            expect(bigInt.min(-432, -77)).toEqual(-432);
        });
    });

    describe("lcm and gcd", function () {
        it("work", function () {
            expect(bigInt.lcm(21, 6)).toEqual(42);
            expect(bigInt.gcd(42, 56)).toEqual(14);
            expect(bigInt.gcd(17, 103)).toEqual(1);
        });
    });

    describe("Increment and decrement", function () {
        it("works for small values", function () {
            expect(bigInt(546).prev()).toEqual(545);
            expect(bigInt(1).prev()).toEqual(0);
            expect(bigInt(0).prev()).toEqual(-1);
            expect(bigInt(-1).prev()).toEqual(-2);
            expect(bigInt(-1987).prev()).toEqual(-1988);

            expect(bigInt(546).next()).toEqual(547);
            expect(bigInt(1).next()).toEqual(2);
            expect(bigInt(0).next()).toEqual(1);
            expect(bigInt(-1).next()).toEqual(0);
            expect(bigInt(-1987).next()).toEqual(-1986);
        });
        it("works for large values", function () {
            expect(bigInt("109874981950949849811049").prev()).toEqual("109874981950949849811048");
            expect(bigInt("109874981950949849811049").next()).toEqual("109874981950949849811050");
            expect(bigInt("-109874981950949849811049").prev()).toEqual("-109874981950949849811050");
            expect(bigInt("-109874981950949849811049").next()).toEqual("-109874981950949849811048");
        });
        it("carries over correctly", function () {
            expect(bigInt(9999999).next()).toEqual(10000000);
            expect(bigInt(10000000).prev()).toEqual(9999999);
        });
    });

    describe("Absolute value", function () {
        it("works", function () {
            expect(bigInt(0).abs()).toEqual(0);
            expect(bigInt("-0").abs()).toEqual(0);
            expect(bigInt(54).abs()).toEqual(54);
            expect(bigInt(-54).abs()).toEqual(54);
            expect(bigInt("13412564654613034984065434").abs()).toEqual("13412564654613034984065434");
            expect(bigInt("-13412564654613034984065434").abs()).toEqual("13412564654613034984065434");
        });
    });

    describe("isPositive and isNegative", function () {
        it("return `false` for 0 and -0", function () {
            expect(bigInt(0).isPositive()).toBe(false);
            expect(bigInt(0).isNegative()).toBe(false);
            expect(bigInt(-0).isPositive()).toBe(false);
            expect(bigInt(-0).isNegative()).toBe(false);
        });

        it("work for small numbers", function () {
            expect(bigInt(1).isPositive()).toBe(true);
            expect(bigInt(543).isNegative()).toBe(false);
            expect(bigInt(-1).isPositive()).toBe(false);
            expect(bigInt(-765).isNegative()).toBe(true);
        });

        it("work for big numbers", function () {
            expect(bigInt("651987498619879841").isPositive()).toBe(true);
            expect(bigInt("0054984980098460").isNegative()).toBe(false);
            expect(bigInt("-1961987984109078496").isPositive()).toBe(false);
            expect(bigInt("-98800984196109540984").isNegative()).toBe(true);
        });
    });

    describe("isEven and isOdd", function () {
        it("work correctly", function () {
            expect(bigInt(0).isEven()).toBe(true);
            expect(bigInt(0).isOdd()).toBe(false);

            expect(bigInt(654).isEven()).toBe(true);
            expect(bigInt(654).isOdd()).toBe(false);

            expect(bigInt(653).isOdd()).toBe(true);
            expect(bigInt(653).isEven()).toBe(false);

            expect(bigInt(-984).isEven()).toBe(true);
            expect(bigInt(-984).isOdd()).toBe(false);

            expect(bigInt(-987).isOdd()).toBe(true);
            expect(bigInt(-987).isEven()).toBe(false);

            expect(bigInt("9888651888888888").isEven()).toBe(true);
            expect(bigInt("9888651888888888").isOdd()).toBe(false);

            expect(bigInt("1026377777777777").isOdd()).toBe(true);
            expect(bigInt("1026377777777777").isEven()).toBe(false);

            expect(bigInt("-9888651888888888").isEven()).toBe(true);
            expect(bigInt("-9888651888888888").isOdd()).toBe(false);

            expect(bigInt("-1026377777777777").isOdd()).toBe(true);
            expect(bigInt("-1026377777777777").isEven()).toBe(false);
        });
    });

    describe("isDivisibleBy", function () {
        it("works", function () {
            expect(bigInt(999).isDivisibleBy(333)).toBe(true);
            expect(bigInt(999).isDivisibleBy(331)).toBe(false);
            expect(bigInt(999).isDivisibleBy(0)).toBe(false);
        });
    });

    describe("isPrime", function () {
        it("correctly identifies prime numbers", function () {
            var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997, 1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091, 1093, 1097, 1103, 1109, 1117, 1123, 1129, 1151, 1153, 1163, 1171, 1181, 1187, 1193, 1201, 1213, 1217, 1223, 1229, 1231, 1237, 1249, 1259, 1277, 1279, 1283, 1289, 1291, 1297, 1301, 1303, 1307, 1319, 1321, 1327, 1361, 1367, 1373, 1381, 1399, 1409, 1423, 1427, 1429, 1433, 1439, 1447, 1451, 1453, 1459, 1471, 1481, 1483, 1487, 1489, 1493, 1499, 1511, 1523, 1531, 1543, 1549, 1553, 1559, 1567, 1571, 1579, 1583, 1597, 1601, 1607, 1609, 1613, 1619, 1621, 1627, 1637, 1657, 1663, 1667, 1669, 1693, 1697, 1699, 1709, 1721, 1723, 1733, 1741, 1747, 1753, 1759, 1777, 1783, 1787, 1789, 1801, 1811, 1823, 1831, 1847, 1861, 1867, 1871, 1873, 1877, 1879, 1889, 1901, 1907, 1913, 1931, 1933, 1949, 1951, 1973, 1979, 1987, 1993, 1997, 1999, 2003, 2011, 2017, 2027, 2029, 2039, 2053, 2063, 2069, 2081, 2083, 2087, 2089, 2099, 2111, 2113, 2129, 2131, 2137, 2141, 2143, 2153, 2161, 2179, 2203, 2207, 2213, 2221, 2237, 2239, 2243, 2251, 2267, 2269, 2273, 2281, 2287, 2293, 2297, 2309, 2311, 2333, 2339, 2341, 2347, 2351, 2357, 2371, 2377, 2381, 2383, 2389, 2393, 2399, 2411, 2417, 2423, 2437, 2441, 2447, 2459, 2467, 2473, 2477, 2503, 2521, 2531, 2539, 2543, 2549, 2551, 2557, 2579, 2591, 2593, 2609, 2617, 2621, 2633, 2647, 2657, 2659, 2663, 2671, 2677, 2683, 2687, 2689, 2693, 2699, 2707, 2711, 2713, 2719, 2729, 2731, 2741, 2749, 2753, 2767, 2777, 2789, 2791, 2797, 2801, 2803, 2819, 2833, 2837, 2843, 2851, 2857, 2861, 2879, 2887, 2897, 2903, 2909, 2917, 2927, 2939, 2953, 2957, 2963, 2969, 2971, 2999, 3001, 3011, 3019, 3023, 3037, 3041, 3049, 3061, 3067, 3079, 3083, 3089, 3109, 3119, 3121, 3137, 3163, 3167, 3169, 3181, 3187, 3191, 3203, 3209, 3217, 3221, 3229, 3251, 3253, 3257, 3259, 3271, 3299, 3301, 3307, 3313, 3319, 3323, 3329, 3331, 3343, 3347, 3359, 3361, 3371, 3373, 3389, 3391, 3407, 3413, 3433, 3449, 3457, 3461, 3463, 3467, 3469, 3491, 3499, 3511, 3517, 3527, 3529, 3533, 3539, 3541, 3547, 3557, 3559, 3571];
            for (var i = 0; i < primes.length; i++) {
                expect(bigInt(primes[i]).isPrime()).toBe(true);
            }
        });
        it("correctly rejects nonprime numbers", function () {
            var nonPrimes = [1, 4, 3 * 5, 4 * 7, 7 * 17, 3 * 103, 17 * 97, 7917];
            for (var i = 0; i < nonPrimes.length; i++) {
                expect(bigInt(nonPrimes[i]).isPrime()).toBe(false);
            }
        });
    });

    describe("isUnit", function () {
        it("works", function () {
            expect(bigInt.one.isUnit()).toBe(true);
            expect(bigInt.minusOne.isUnit()).toBe(true);
            expect(bigInt.zero.isUnit()).toBe(false);
            expect(bigInt(5).isUnit()).toBe(false);
            expect(bigInt(-5).isUnit()).toBe(false);
            expect(bigInt("654609649089416160").isUnit()).toBe(false);
            expect(bigInt("-98410980984981094").isUnit()).toBe(false);
        });
    });

    describe("isZero", function () {
        it("works", function () {
            expect(bigInt.zero.isZero()).toBe(true);
            expect(bigInt(0).isZero()).toBe(true);
            expect(bigInt("-0").isZero()).toBe(true);
            expect(bigInt(15).isZero()).toBe(false);
            expect(bigInt(-15).isZero()).toBe(false);
            expect(bigInt("63213098189462109840").isZero()).toBe(false);
            expect(bigInt("-64343745644564564563").isZero()).toBe(false);
        });
    });

    describe("Throw error in input with", function () {
        function test(input) {
            expect(function () {
                bigInt(input);
            }).toThrow();
        }
        it("multiple minus signs at the beginning", function () {
            test("--123");
            test("---1423423");
        });

        it("non-numeric symbols", function () {
            test("43a34");
            test("4+7=11");
        })

        it("multiple exponents", function () {
            test("43e4e6");
            test("234234e43523e4354");
        });

        it("decimal point when exponent is too small", function () {
            test("1.24595e3");
        })

        describe("but not with", function () {
            it("e or E for the exponent", function () {
                expect(bigInt("2e7").equals("2E7")).toBe(true);
            });

            it("e+ or E+ for the exponent", function () {
                expect(bigInt("2e7").equals("2E+7")).toBe(true);
                expect(bigInt("1.7976931348623157e+308").equals("17976931348623157000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")).toBe(true);
            });

            it("decimal point when exponent is large enough", function () {
                expect(bigInt("1.32e2").equals("132")).toBe(true);
            });
        });
    });

    describe("toString", function () {
        it("works for leading and trailing zeroes", function () {
            expect(bigInt("10000000").toString() === "10000000").toBe(true);
            expect(bigInt("100001010000000").toString() === "100001010000000").toBe(true);
            expect(bigInt("00000000010000000").toString() === "10000000").toBe(true);
            expect(bigInt("00000000100001010000000").toString() === "100001010000000").toBe(true);
        });

        // See issue #13
        //   https://github.com/peterolson/BigInteger.js/issues/13
        it("of 0*-1 is '0'", function () {
            expect(bigInt(0).multiply(-1).toString() === "0").toBe(true);
        });

        // See pull request #16
        //  https://github.com/peterolson/BigInteger.js/pull/16
        it("of (0/1)-100 is '-100'", function () {
            expect((bigInt("0")).divide(bigInt("1")).add(bigInt("-100")).toString() === "-100").toBe(true);
        });
    });

    describe("Base conversion", function () {
        it("parses numbers correctly", function () {
            expect(bigInt("FF", 16)).toEqual(255);
            expect(bigInt("111100001111", -2)).toEqual(-1285);
            expect(bigInt("<5><10>35<75><44><88><145735>", "-154654987")).toEqual("-10580775516023906041313915824083789618333601575504631498551");

            // See pull request 16
            //   https://github.com/peterolson/BigInteger.js/pull/15
            expect(bigInt("-1", 16)).toEqual(-1);
        });

        it("outputs numbers correctly", function () {
            expect(bigInt("366900685503779409298642816707647664013657589336").toString(16) === "4044654fce69424a651af2825b37124c25094658").toBe(true);
            expect(bigInt("secretmessage000", -36).toString(-36) === "secretmessage000").toBe(true);
            expect(bigInt(-256).toString(16) === "-100").toBe(true);
            expect(bigInt(256).toString(1).length === 256).toBe(true);
        });
    });

    describe("Bitwise operations", function () {
        it("shifting left and right work", function () {
        	expect(bigInt(-5).shiftRight(2)).toEqual(-2);
            expect(bigInt(1024).shiftLeft(100)).toEqual("1298074214633706907132624082305024");
            expect(bigInt("2596148429267413814265248164610049").shiftRight(100)).toEqual(2048);
            expect(bigInt("8589934592").shiftRight(-50)).toEqual("9671406556917033397649408");
            expect(bigInt("38685626227668133590597632").shiftLeft(-50)).toEqual("34359738368");
        });

        it("and, or, xor, and not work", function () {
            expect(bigInt("435783453").and("902345074")).toEqual("298352912");
            expect(bigInt("435783453").or("902345074")).toEqual("1039775615");
            expect(bigInt("435783453").xor("902345074")).toEqual("741422703");
            expect(bigInt("94981987261387596").not()).toEqual("-94981987261387597");
            expect(bigInt("-6931047708307681506").xor("25214903917")).toEqual("-6931047723896018573");
            expect(bigInt("-6931047723896018573").and("281474976710655")).toEqual("273577603885427");
            expect(bigInt("-65").xor("-42")).toEqual("105");
            expect(bigInt("6").and("-3")).toEqual("4");
            expect(bigInt("0").not()).toEqual("-1");
            expect(bigInt("13").or(-8)).toEqual("-3");
            expect(bigInt("12").xor(-5)).toEqual("-9");
        });
    });
    
    describe("isInstance", function () {
        it("works", function () {
            expect(bigInt.isInstance(bigInt(14))).toBe(true);
            expect(bigInt.isInstance(14)).toBe(false);
        });
    });

    describe("Aliases", function () {
        it("add, plus are the same", function () {
            expect(bigInt.one.add === bigInt.one.plus).toBe(true);
        });
        it("compare, compareTo are the same", function () {
            expect(bigInt.one.compare === bigInt.one.compareTo).toBe(true);
        });
        it("divide, over are the same", function () {
            expect(bigInt.one.divide === bigInt.one.over).toBe(true);
        });
        it("equals, eq are the same", function () {
            expect(bigInt.one.equals === bigInt.one.eq).toBe(true);
        });
        it("greater, gt are the same", function () {
            expect(bigInt.one.greater === bigInt.one.gt).toBe(true);
        });
        it("greaterOrEquals, geq are the same", function () {
            expect(bigInt.one.greaterOrEquals === bigInt.one.geq).toBe(true);
        });
        it("lesser, lt are the same", function () {
            expect(bigInt.one.lesser === bigInt.one.lt).toBe(true);
        });
        it("lesserOrEquals, leq are the same", function () {
            expect(bigInt.one.lesserOrEquals === bigInt.one.leq).toBe(true);
        });
        it("notEquals, neq are the same", function () {
            expect(bigInt.one.notEquals === bigInt.one.neq).toBe(true);
        });
        it("subtract, minus are the same", function () {
            expect(bigInt.one.subtract === bigInt.one.minus).toBe(true);
        });     
        it("mod, remainder are the same", function () {
            expect(bigInt.one.mod === bigInt.one.remainder).toBe(true);
        });
        it("multiply, times are the same", function () {
            expect(bigInt.one.multiply === bigInt.one.times).toBe(true);
        });
    });
});