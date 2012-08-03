
# Configuration
APP = client_errors
COMPILER = ~/local/closure/compiler.jar
JS_DIR = ./client_errors/media/client_errors

# Combine and minify all JS scripts
# http://code.google.com/closure/compiler/
js:
	java -jar ${COMPILER} \
		--js ${JS_DIR}/client-errors.js \
		--js_output_file ${JS_DIR}/client-errors.min.js

# Install locally
install:
	sudo python setup.py install

# Upload to PyPi
upload:
	sudo python setup.py upload

# Clean up directories
clean:
	find . -name "*.pyc" -print0 | xargs -0 rm -rf

# Create automatic schema migrations
migration:
	python ./manage.py schemamigration ${APP} --auto

# Migrate the app to the current schema
migrate:
	python ./manage.py migrate ${APP} --noinput

.PHONY: js install upload clean migration migrate
