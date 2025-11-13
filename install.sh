#!/bin/bash

echo "Installing Hermes dependencies"

npm install

echo "Linking Hermes globally"

npm link

echo "Congrats! You can now use Hermes by calling 'hermes' command from anywhere in your terminal"