#!/bin/bash
cd /home/kavia/workspace/code-generation/react-tetris-classic-177451-177460/tetris_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

