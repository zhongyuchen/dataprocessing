# Week_1: Scraping

Use BeautifulSoup4 to scrape data off IMDB top 50 movies
 (2008 ~ 2018) in order to find out if there were better 
 years between 2007 and 2018.
 
 - We can conclude from the results that
 in 2016 and 2017, movies among 
 IMDB top 50 scored significantly higher.

## 1. code

Implement moviescraper.py and visualizer.py files.

### 1.1 moviescraper.py

Make a copy of the website and scrape data
 off into a csv file.

#### extract_movies(dom)

 - Extract and process Title, Rating, Year of release,
 Actors/actresses and Runtime of the movies
 to store the data in a dictionary.
 
 - Usage of encode() and decode() can ignore unicode
 characters.
 
#### save_csv(outfile, movies)

 - Use csv to write information of each movie
 into a csv file row by row.

### 1.2 visualizer.py

Read data from a csv file and make a chart.

 - Use csv.DictReader() to read the file as a dictionary
 and store average rating and amount of movies each
 year into dictionaries.
 
 - Use matplotlib.pyplot to draw a chart
 showing the average rating and the amount
 of movies among top 50 each year.

## 2. data

### 2.1 movies.html

A copy of the website copied by moviescraper.py file.

### 2.2 movies.csv

A csv file with Title, Rating, Year of release,
 Actors/actresses and Runtime of the top 50 
 IMDB movies.

### 2.3 Average ratings.jpg

Visualization of the average rating and the amount
 of movies among top 50 each year.
 
 - Average rating (red line):
 shows that among those top 50 movies,
 movies released in 2008, 2016 and 2017 
 scored significantly higher.
 
 - Amount of movies among top 50 (green bar):
 shows that there are more movies which
 successfully made their way in top 50 
 in 2014, 2016 and 2017.
 
 - To sum up, in 2016 and 2017, movies among 
 IMDB top 50 scored significantly higher.
 
## 3. README.md

This is the README.md file.
