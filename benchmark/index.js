(function () {
    var benchmarks = libraries["Peter Olson BigInteger.js"].tests,
        _benchmarks = document.getElementById("benchmarks");
    var group;
    for (var i in benchmarks) {
        var split = i.split(": "), thisGroup = split[0], title = split[1], html = "";
        if (thisGroup != group) {
            html += "<h2 id='" + thisGroup + "'>" + thisGroup + "<br><button class='btnBenchmarkGroup' title='" + thisGroup + "'>Run '" + thisGroup + "' benchmarks</button></h2>";
            group = thisGroup;
        }
        html += "<div class='indent'><h3 title='" + i + "'>" + i + "<br><button class='btnBenchmark'>Run benchmark</button></h2>";
        html += "<table><tr><th>Library</th><th>Code</th><th>Performance</th></tr>";
        for (var j in libraries) {
            var lib = libraries[j];
            if (!lib.tests[i]) continue;
            html += "<tr><td><a href='" + lib.projectURL + "'>" + j + "</a></td><td><pre>" + lib.tests[i] + "</pre></td><td>-</td></tr>";
        }
        html += "</table></div>";
        _benchmarks.innerHTML += html;
    }
    var buttons = document.getElementsByClassName("btnBenchmark");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = btnBenchmark_click;
    }
    buttons = document.getElementsByClassName("btnBenchmarkGroup");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = btnBenchmarkGroup_click;
    }

    function btnBenchmark_click() {
        var test = this.parentElement.title;
        runTest(test);
    }

    function btnBenchmarkGroup_click() {
        var group = this.title;
        var tests = [];
        for (var i in benchmarks) {
            if (i.split(": ")[0] === group) tests.push(i);
        }
        runTests(tests);
    }

    document.getElementById("btnRunAll").onclick = function () {
        var tests = [];
        for (var i in benchmarks) tests.push(i);
        runTests(tests);
    }

    function runTest(test, callback) {
        var libs = [];
        for (var i in libraries) {
            if (libraries[i].tests[test]) libs.push(libraries[i]);
            displayPerformance(libraries[i], {
                name: test,
                desc: "<img class='wait' src='wait.gif'>"
            });
        }
        var i = 0;
        (function f() {
            if (i >= libs.length) {
                if (callback) callback();
                return;
            }
            testLibrary(libs[i++], [test], f);
        })();
    }

    function runTests(tests) {
        var i = 0;
        (function f() {
            if (i < tests.length) {
                runTest(tests[i++], f);
            }
        })();
    }

    function displayPerformance(library, data) {
        var test = data.name;
        var h3s = document.getElementsByTagName("h3"), div;
        for (var i = 0; i < h3s.length; i++) {
            if (h3s[i].title === test) div = h3s[i].parentElement;
        }
        var table = div.getElementsByTagName("table")[0];
        var trs = table.rows;
        for (var i = 0; i < trs.length; i++) {
            if (trs[i].innerHTML.indexOf(library.projectURL) !== -1) break;
        }
        if (i >= trs.length) return;
        var td = trs[i].cells[2];
        td.innerHTML = data.desc;
        if (data.stats) {
            td.innerHTML += "<div class='graph'></div>";
            trs[i].stats = data.stats;
            sortRows(table);
        }
    }

    function sortRows(table) {
        var rows = table.rows;
        var newRows = [];
        for (var i = 1; i < rows.length; i++) newRows.push({
            stats: rows[i].stats,
            HTML: rows[i].innerHTML
        });
        newRows.sort(function (a, b) {
            if (a.stats && !b.stats) return -1;
            if (b.stats && !a.stats) return 1;
            if (!a.stats) return 0;
            if (!a.stats.mean) return 1;
            if (!b.stats.mean) return -1;
            return a.stats.mean - b.stats.mean;
        });
        if (!newRows[0].stats) return;
        var mean = 1 / newRows[0].stats.mean,
            rme = newRows[0].stats.rme;
        var max = mean;
        for (var i = 1; i < rows.length; i++) {
            rows[i].innerHTML = newRows[i - 1].HTML;
            rows[i].stats = newRows[i - 1].stats;
        }
        for (var i = 1; i < rows.length; i++) {
            showGraph(rows[i], max);
        }
    }

    function showGraph(row, max) {
        var cell = row.cells[2],
            stats = row.stats,
            div = cell.getElementsByTagName("div")[0];
        if (!stats || !div || !stats.mean) return;
        var mean = 1 / stats.mean,
            rme = stats.rme;
        var variance = (mean * rme / 100);
        var left = Math.round(100 * (mean - variance) / max),
            rme = Math.round(100 * variance / max);
        left = left < 1 ? "1px" : left + "%";
        div.innerHTML = "<span class='left' style='width:" + left + "'></span>" +
            "<span class='rme' style='width:" + rme + "%'></span>";
    }

    var workers = {};
    var loaded = 0, total = 0;
    for (i in libraries) {
        initWorker(libraries[i]);
        total++;
    }

    function testLibrary(library, tests, fn) {
        var url = library.projectURL, timeout;
        var worker = workers[url];
        library.testsToRun = tests;
        library.timeout = 10000;
        worker.postMessage(library);
        worker.onmessage = function (e) {
            clearTimeout(timeout);
            var type = e.data.type;
            if (type === "complete") {
                fn();
                return;
            }
            if (type === "cycle") {
                displayPerformance(library, e.data);
            }
        };
        timeout = setTimeout(function () {
            worker.terminate();
            library.testsToRun = null;
            initWorker(library);
            for (var i = 0; i < tests.length; i++) {
                fn();
                displayPerformance(library, {
                    name: tests[i],
                    stats: {
                        mean: 0
                    },
                    desc: "Test timed out."
                });
            }
        }, library.timeout * 1.5);
    }
    
    function initWorker(library) {
        var url = library.projectURL;
        var worker = new Worker("testWorker.js?" + encodeURIComponent(url));
        worker.postMessage(library);
        worker.onmessage = function (e) {
            if (e.data.type === "loaded") {
                loaded++;
                showLoaded();
            }
        }
        workers[url] = worker;
    }

    function showLoaded() {
        document.getElementById("loaded").innerHTML = loaded;
        document.getElementById("total").innerHTML = total;
        if (loaded === total) {
            document.getElementById("loading").style.display = "none";
        }
    }
    showLoaded();
})();