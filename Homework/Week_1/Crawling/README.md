# Week_1: Crawling

 - Scrape the IMDB top 250 movie index page 
 for urls that lead to the individual 
 movie pages.
 - And then scrape the individual 
 IMDB movie pages for movie info.
 
## 1. Code

Implement imdb-crawler.py file.

### 1.1 imdb-crawler.py

 - Make a copy of index page.
 - Scrape the urls.
 - Scrape movie info through urls.
 - Make a copy of 083 movie page.
 - Save the movie info in a csv file.

#### scrape_top_250(soup)

 - Scrape the urls off the index page.

#### scrape_movie_page(dom)

 - Scrape movie info through a url.
 - Save info in order in a string list.

#### get_names(staff)

 - Pass in a staff dom.
 - Find all the names in the dom.
 - Combine the names in the name list 
 into a string.
 - Return the string name

#### get_minutes(duration)

 - Pass in a string time, 
 e.g. "2h", "2h 40min"
 - Get all the numbers out.
 - Calculate the total minutes.
 
## 2. Data

### 2.1 top250movies.csv

The info of top 250 IMDB movies in a csv file.

### 2.2 index.html

A copy of the top 250 IMDB movies index page.

### 2.3 movie-083.html

A copy of the 083 movie individual page.

## 3. README.md

This is the README.md file.
