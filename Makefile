do=publish

test:
	./node_modules/lowkick/bin/lowkick $(do) test/config.json

.PHONY: test
