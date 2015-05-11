#Run Javascript in your ServiceNow instance directly from Sublime Text#
At the moment only the public demo instances are supported.

##Installation##
1. Copy the SncEval.py into <Sublime Text 2>\Data\Packages\SncEval\
2. Add SncEval.sublime_build as a custom build system to your project
3. Create a custom processor in a ServiceNow demo instance with a name eval.do (see http://wiki.servicenow.com/index.php?title=Tutorial_4_Creating_a_Custom_Processor for details)
4. Create a public page (sys_public) in the ServiceNow instance to open eval.do for anyone without a need to login (this is only OK for public demo instances)

##Usage##
0. edit SncEval.py to modify the ServiceNow instance and proxy settings
1. open a Javascript file
2. select SncEval as the build system
3. press F7 / Ctrl+B to trigger Build


##TODO##
* move settings to a configuration file
* add support for authentication
* package as a PackageControl plugin