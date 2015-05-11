import sublime
import sublime_plugin
import urllib
import urllib2
import threading

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
            proxy = urllib2.ProxyHandler({'https': '193.34.40.30:8080'})
            opener = urllib2.build_opener(proxy)
            urllib2.install_opener(opener)

            uri = 'https://%s.service-now.com/eval.do' % self.instance
            params = urllib.urlencode({'script': self.script})
            full_url = uri + '?' + params
            http_file = urllib2.urlopen(full_url, timeout=self.timeout)
            self.result = http_file.read().decode('utf-8')
            return

        except (urllib2.HTTPError) as (e):
            err = '%s: HTTP error %s contacting API' % (__name__, str(e.code))
        except (urllib2.URLError) as (e):
            err = '%s: URL error %s contacting API' % (__name__, str(e.reason))

        sublime.error_message(err)
        self.result = False


class SncEvalCommand(sublime_plugin.WindowCommand):
    def run(self, cmd, **kwargs):
        self.output_view = self.window.get_output_panel("snc_eval")
        self.window.run_command("show_panel", {"panel": "output.snc_eval"})

        view = self.window.active_view()
        script = view.substr(sublime.Region(0, view.size()))
        thread = SncEvalHttpCall('demo019', script, 5)
        thread.start()

        self.await_thread(thread)


    def await_thread(self, thread):
        if thread.is_alive():
            sublime.set_timeout(lambda: self.await_thread(thread), 100)
            return        
        if thread.result == False:
            return

        self.append_text(thread.result)


    def append_text(self, text):
        # Normalize newlines, Sublime Text always uses a single \n separator
        # in memory.
        str = text.replace('\r\n', '\n').replace('\r', '\n')

        selection_was_at_end = (len(self.output_view.sel()) == 1
            and self.output_view.sel()[0]
                == sublime.Region(self.output_view.size()))
        self.output_view.set_read_only(False)
        edit = self.output_view.begin_edit()
        self.output_view.insert(edit, self.output_view.size(), str)
        if selection_was_at_end:
            self.output_view.show(self.output_view.size())
        self.output_view.end_edit(edit)
        self.output_view.set_read_only(True)
