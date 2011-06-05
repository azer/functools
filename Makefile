docs:
	cd man; \
	ronn functools.1.ron -r -5 --markdown

.PHONY: test
test:
	cd test; \
	node node.js
