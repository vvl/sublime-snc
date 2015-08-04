var session_id = gs.getSessionID();
var timestamp = gs.nowNoTZ();
var response = { status: 'ERROR', output: '', error: '' };

var script =
	"function jsnc_eval_print(message, source) {" + "\n" +
		"gs.log(new Date().getTime() + '|' + message, 'JSnc-" + session_id + "');" + "\n" +
	"};" + "\n" +
	g_request.getParameter('script') + "\n" +
	"gs.log('[" + session_id + "] execution completed normally', 'JSncEval-History');";
gs.log("[" + session_id + "] executing script:\n" + script, 'JSncEval-History');
GlideEvaluator.evaluateString(script);
gs.sleep(1);
	
var loggr = new GlideRecord('syslog');
loggr.addQuery('source', 'JSncEval-History');
loggr.addQuery('message', 'STARTSWITH', '[' + session_id + '] execution completed normally');
loggr.addQuery('sys_created_on', '>=', timestamp);
loggr.orderByDesc('sys_created_on');
loggr.setLimit(1);
loggr.query();
if (loggr.next()) {
	response.status = 'OK';
}

loggr = new GlideRecord('syslog');
loggr.addQuery('source', 'JSnc-' + session_id);
loggr.addQuery('sys_created_on', '>=', timestamp);
loggr.orderBy('message');
loggr.query();
while (loggr.next()) {
	// skip the first 14 characters (i.e. the timestamp)
	// e.g. '1438690572880|Started' -> 'Started'
	response.output += loggr.message.toString().substring(14);
}

if (response.status == 'ERROR') {
	loggr = new GlideRecord('syslog');
	loggr.addQuery('source', 'Evaluator');
	loggr.addQuery('sys_created_on', '>=', timestamp);
	loggr.orderByDesc('sys_created_on');
	loggr.query();
	while (loggr.next()) {
		response.error += loggr.message.toString() + "\n";
	}
}

g_processor.writeOutput("text/json", new JSON().encode(response));