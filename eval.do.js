var timestamp = gs.nowNoTZ();
var response = { status: 'ERROR', output: '', error: '' };

var script =
	"var __output_buffer = '';" + "\n" +
	"function jsnc_eval_print(message, source) {" + "\n" +
		"__output_buffer += message;" + "\n" +
		"gs.log(new Date().getTime() + ' ' + message, source);" + "\n" +
	"};" + "\n" +
	g_request.getParameter('script') + "\n" +
	"gs.log(__output_buffer, 'JSncEval-Output');";
gs.log("Executed script:\n" + script, 'JSncEval-History');
var eval_result = GlideEvaluator.evaluateString(script);
gs.sleep(1);
	
if (typeof eval_result === 'undefined') {
	response.status = 'OK'
}

var loggr = new GlideRecord('syslog');
loggr.addQuery('source', 'JSncEval-Output');
loggr.addQuery('sys_created_on', '>=', timestamp);
loggr.orderByDesc('sys_created_on');
loggr.setLimit(1);
loggr.query();
if (loggr.next()) {
	response.output = loggr.message.toString();
}

loggr = new GlideRecord('syslog');
loggr.addQuery('source', 'Evaluator');
loggr.addQuery('sys_created_on', '>=', timestamp);
loggr.orderByDesc('sys_created_on');
loggr.query();
while (loggr.next()) {
	response.error += loggr.message.toString() + "\n";
}

g_processor.writeOutput("text/json", new JSON().encode(response));

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