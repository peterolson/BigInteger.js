var haveScripts = false, timeout;
function getScripts(msg) {
    if (haveScripts) return;
    importScripts.apply(null, ["benchmark.js"].concat(msg.url));
    var start = new Function(msg.onStart);
    start();
    haveScripts = true;
}

onmessage = function (e) {
    var msg = e.data;
    getScripts(msg);
    if (!msg.testsToRun) {
        postMessage({
            type: "loaded"
        });
        return;
    }
    Benchmark.options.minTime = 1 / 64;
    Benchmark.options.maxTime = 1 / 2;
    Benchmark.options.minSamples = 5;
    var suite = new Benchmark.Suite();
    for (var i = 0; i < msg.testsToRun.length; i++) {
        var name = msg.testsToRun[i];
        suite.add(name, msg.tests[name], {
            onCycle: msg.onCycle ? new Function(msg.onCycle) : function () { }
        });
    }
    suite.on("cycle", function (e) {
        var target = e.target,
            name = target.name,
            stats = target.stats,
            desc = createDescription(stats);
        if (target.aborted) {
            if (!stats.mean)
                desc = "Test timed out.";
        }
        postMessage({
            type: "cycle",
            name: name,
            stats: stats,
            desc: desc
        });
        clearTimeout(timeout);
    })
    .on("complete", function (e) {
        postMessage({
            type: "complete"
        });
    }).run({
        async: true
    });
    timeout = setTimeout(function () { // abort tests after 10 seconds
        suite.abort();
    }, msg.timeout);
};

function createDescription(stats) {
    var runs = stats.sample.length;
    var rme = stats.rme.toFixed(2);
    var mean = 1 / stats.mean || 0;
    if (mean >= 100) mean = Math.round(mean) + "";
    else if (mean >= 10) mean = mean.toFixed(1);
    else if (mean >= 1) mean = mean.toFixed(2);
    else mean = mean.toFixed(3);
    while (/(\d+)(\d{3})/.test(mean)) {
        mean = mean.replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return mean + " ops/sec &pm;" + rme + "% (" + runs + " samples)";
}