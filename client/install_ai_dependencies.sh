#!/bin/bash

echo "Installing VeriLeaf AI Pipeline Dependencies..."
echo

cd ai_pipeline
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo
    echo "Dependencies installed successfully!"
    echo
    echo "To start the AI server, run:"
    echo "  python3 start_ai_server.py"
    echo
    echo "Or use the shell script:"
    echo "  ./start_ai_server.sh"
else
    echo
    echo "Installation failed. Please check the error messages above."
    exit 1
fi
