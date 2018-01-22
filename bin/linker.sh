#!/bin/bash

#Creates symbolic Link to workflows in Alfred

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
WORKFLOW_DIR=/Users/tthanhdang/Dropbox/app_backup/Alfred.alfredpreferences/workflows
DOMAIN=info.tungbb

cd "$WORKFLOW_DIR"
IFS=$'\n';for f in $(ls -d $DIR/workflows/*)
do
    ln -fs $f $DOMAIN.`basename $f`
done
