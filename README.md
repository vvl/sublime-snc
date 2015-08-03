#Run Javascript in your ServiceNow instance directly from Sublime Text#
At the moment only the public demo instances are supported.

##Installation##
###Part 1: Prepare the ServiceNow instance (public demo)###
1. Login to a public ServiceNow demo instance of your choice as **admin**
2. Import XML file update_set_xml/01_sys_user_jasmine.xml into sys_user table (creates a new user jasmine-snc with the password jasmine-snc)
3. Grant the 'admin' role to the imported jasmine-snc user
4. Import XML file update_set_xml/02_sys_processor_eval.xml into sys_processor table (creates a processor for /eval.do)
5. _(optional)_ Import XML file update_set_xml/03_sys_ui_bookmark.xml into sys_ui_bookmark table (creates bookmarks for the jasmine-snc user)

###Part 2: Intall SncEval as a new Build System in Sublime Text###
1. Copy the SncEval.py into <Sublime Text 2>\Data\Packages\SncEval\
2. Modify the SncEval.py and update the instance URL and proxy settings (if needed)
3. Add SncEval.sublime_build as a custom build system to your project

##Usage##
1. open a Javascript file
2. select SncEval as the build system
3. press F7 / Ctrl+B to trigger Build


##TODO##
* move settings to a configuration file
* ~~add support for authentication~~
* add access controll checks to the eval.do processor
* automate the part 1 of the installation process (the ServiceNow part)
* package as a PackageControl plugin