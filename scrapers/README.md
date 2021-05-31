
Can either run with npm start for the executor.js if the scrapers added to the scraperConf.txt

<br>

or an individual scraper, might need tweaking to run solo but if the package.json has a start script for that dir then you can just run npm start

ex:

src/wsb/wsb.js

run npm start or node wsb.js


Theres a heroku branch inside the main one so make sure you are cd'd into the scrapers dir
git add *
git commit
git push heroku master