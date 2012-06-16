
COMPILER = ~/local/closure/compiler.jar
JS_DIR = ./client_errors/media/client_errors

# Combine and minify all JS scripts
# http://code.google.com/closure/compiler/
js:
	java -jar ${COMPILER} \
		--js ${JS_DIR}/client-errors.js \
		--js_output_file ${JS_DIR}/client-errors.min.js

install:
	python setup.py install

clean:
	find . -name "*.pyc" -print0 | xargs -0 rm -rf

.PHONY: js install clean
