#!/usr/bin/env python
# Name:
# Student number:
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED MOVIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    movie_list = dom.find_all("div", class_ = "lister-item-content")
    movies = []
    for movie in movie_list:
        # title
        title = movie.find("a", href = re.compile("title")).text
        # ignore unicode characters
        title_name = title.encode('ascii', 'ignore').decode('ascii')

        # rating
        rating = movie.find("strong").text

        # year
        year = movie.find("span", class_ = "lister-item-year text-muted unbold").text
        year_number = re.findall(r"\d+", year)[0]

        # actors
        staff_1st = movie.find("a", href=re.compile("name"))
        if staff_1st:
            bar = staff_1st.find_next("span")
            actor_p = bar.find_next("a")
            actors = actor_p.text
            actor_p = actor_p.find_next()
            while actor_p.name == "a":
                actors = actors + ", " + actor_p.text
                actor_p = actor_p.find_next()
            # ignore unicode characters
            actors = actors.encode('ascii', 'ignore').decode('ascii')
        else:
            actors = ""

        # runtime
        runtime = movie.find("span", class_ = "runtime").text
        runtime_number = re.findall(r"\d+", runtime)[0]

        # movie
        movies.append({'title': title,
                       'rating': rating,
                       'year': year_number,
                       'actors': actors,
                       'runtime': runtime_number})

    return movies   # REPLACE THIS LINE AS WELL IF APPROPRIATE


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE MOVIES TO DISK
    for movie in movies:
        writer.writerow([movie['title'],
                         movie['rating'],
                         movie['year'],
                         movie['actors'],
                         movie['runtime']])


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)