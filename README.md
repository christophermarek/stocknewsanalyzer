# If app is not working on first load

- Refresh the page because the server goes idle after 30 minutes of inactivity

Frontend hosted on Netlify:

https://stock-news-analyzer.netlify.app/

# FRONTEND

## Market Overview 

- Displays current index/certain ticker's prices for today and % change.

## Real Time

- This gets data from a scraper running 24/7 fetching the latest comments on reddit's cryptocurrency and WSB.

### Single Ticker and Sentiment Analysis

- When a valid ticker is entered it will display in a chart:
    - Frequency per minute and the average comment sentiment relating to that ticker.

### Multiple Ticker View

- In this section you select from the dropdown the tickers you want to view realtime frequency data for. Multiple tickers can be selected. 

## Frequency Charts

- This gets data from a scraper running every day parsing historical data from the day prior and long before.

### All Data

- View Historical frequency data for all tickers at that data source for the specific date selected in the list.
- Word filter box included to remove tickers from the chart that are unwanted.
- Minimum Frequency to display as a filter to control how many tickers to view in the chart.

### Single Ticker Queries

- Enter a specific ticker to view the frequency data over time for that ticker aswell as the share price and volume during the duration of the frequency data available.


# BACKEND

Backend hosted on Heroku:
https://stock-news-analyze.herokuapp.com/

Api routes:
- /bnnmarketcall
- /yahoofinance/current-data/:id"
- /yahoofinance/current-price/:id
- /yahoofinance/historical-prices/:startMonth/:startDay/:startYear/:endMonth/:endDay/:endYear/:ticker/:frequency
- /wsb/allFrequencyLists
- /wsb/singleFrequencyList/:date
- /cryptocurrency/allFrequencyLists
- /cryptocurrency/singleFrequencyList/:date
- /realtime/crypto
- /realtime/wsb
<br>

# Scrapers

For info on how to run them alone check the Readme in that dir.

Notes:
- In simulator dir, the news section has been removed from the project.