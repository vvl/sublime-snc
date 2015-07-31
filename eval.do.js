var script =
	"var _log_buf = '';" + "\n" +
	"_gs_log = function(message, source) {" + "\n" +
		"_log_buf += '[' + source + '] ' + message + \"\\n\";" + "\n" +
		"gs.log(message, source);" + "\n" +
	"};" + "\n" +
	g_request.getParameter('script') + "\n" +
	"gs.log(_log_buf, 'JSncEval-Output');";
gs.log("Executed script:\n" + script, 'JSncEval-History');
GlideEvaluator.evaluateString(script);
gs.sleep(1);
var loggr = new GlideRecord('syslog');
loggr.addQuery('source', 'JSncEval-Output');
loggr.orderByDesc('sys_created_on');
loggr.setLimit(1);
loggr.query();
loggr.next();
g_processor.writeOutput("text/plain", loggr.message);

/*
(function() {
	GlideEvaluator.evaluateString(g_request.getParameter('script'));
})();

var __output_bufer = '';
(function() {
	var globals = new Packages.java.util.HashMap();
	globals.put('__output_bufer', '');
	var script =
		"function _gs_log(message, source) {" + "\n" +
		"	__output_bufer += '[' + source + '] ' + message + \"\\n\";" + "\n" +
		"	//gs.log(message, source);" + "\n" +
		"};" + "\n" +
		g_request.getParameter('script');
	gs.log(script, '_log_buf');
	var rc = GlideEvaluator.evaluateStringWithGlobals(script, globals);
	if (typeof rc === 'undefined') {
		g_processor.writeOutput("text/plain", __output_bufer);
	} else {
		g_response.setStatus(400);
		g_processor.writeOutput("text/plain", 'error');
	}
})();
*/