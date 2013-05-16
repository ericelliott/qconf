#!/bin/bash

source common.env
node ./test/test-qconf.js --command-line foo --arg-override true
