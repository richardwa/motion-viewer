#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
BASE=$(basename $DIR)
rsync -a --exclude='.git' $DIR/* rich@pluto:~/$BASE --delete