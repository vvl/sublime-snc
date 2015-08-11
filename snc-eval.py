#!/usr/bin/env python

import sys
import urllib
import urllib2
import base64
import threading
import json

# based on http://code.tutsplus.com/tutorials/how-to-create-a-sublime-text-2-plugin--net-22685
# http://sublime-text-unofficial-documentation.readthedocs.org/en/latest/reference/build_systems/configuration.html#build-arbitrary-options
class SncEvalHttpCall(threading.Thread):
    def __init__(self, instance, script, timeout):
        self.instance = instance
        self.script = script
        self.timeout = timeout
        self.result = None
        threading.Thread.__init__(self)

    def run(self):
        try:
            """
            proxy = urllib2.ProxyHandler({'https': '193.34.40.30:8080'})
            opener = urllib2.build_opener(proxy)
            urllib2.install_opener(opener)
            """

            username = 'jasmine-snc'
            password = 'jasmine-snc'
            uri = 'https://%s.service-now.com/eval.do' % self.instance
            params = urllib.urlencode({ 'script': self.script })

            request = urllib2.Request(uri, params)
            base64string = base64.encodestring('%s:%s' % (username, password)).replace('\n', '')
            request.add_header("Authorization", "Basic %s" % base64string)

            http_file = urllib2.urlopen(request, timeout=self.timeout)
            self.result = http_file.read().decode('utf-8')
            return

        except (urllib2.HTTPError) as (e):
            err = '%s: HTTP error %s contacting API' % (__name__, str(e.code))
        except (urllib2.URLError) as (e):
            err = '%s: URL error %s contacting API' % (__name__, str(e.reason))

        self.error_message = err
        self.result = False


def main():
    print "snc-eval - run Javascript code in a ServiceNow backend"
    if len(sys.argv) < 2:
        print "no input file is specified -> exiting"
        return
    
    script = open(sys.argv[1], 'r').read()
    
    thread = SncEvalHttpCall('demo022', script, 60)
    thread.start()
    thread.join()
    
    if thread.result == False:
        print "error:\n%s" % thread.error_message
        return
    
    response = json.loads(thread.result)
    if response['status'] == 'OK':
        print response['output']
    else:
        print "%s:\n%s" % (response['status'], response['error'])
        print "Output:\n%s" % (response['output'])


if __name__ == "__main__":
    main()
