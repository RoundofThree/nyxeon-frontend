#!/bin/bash 
yarn build 
cd dist/

git init 

git add .

git commit -m "Deploy"
git branch -M main 
git remote add origin https://github.com/RoundofThree/nyxeon-frontend.git
git push -f origin main:gh-pages
