#!/usr/bin/env python
# Name: Zhongyu Chen
# Student number: 12455822
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt
import numpy as np

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

if __name__ == "__main__":

    # variables
    avg = {str(key): 0.0 for key in range(START_YEAR, END_YEAR)}
    cnt = {str(key): 0 for key in range(START_YEAR, END_YEAR)}

    # read file
    with open(INPUT_CSV, newline = '') as file:
        reader = csv.DictReader(file)
        for row in reader:
            cnt[row['Year']] += 1
            avg[row['Year']] += float(row['Rating'])

    # average rating
    for key in avg:
        avg[key] /= cnt[key]

    # plot
    # x and y data
    x = list(range(START_YEAR, END_YEAR))
    y_avg = list(avg.values())
    y_cnt = list(cnt.values())

    # figure
    figure, axis_cnt = plt.subplots()
    axis_avg = axis_cnt.twinx()

    # title and x lable
    plt.title('Average ratings of movies among top 50 (2008 ~ 2017)')
    axis_cnt.set_xlabel('Year')

    # cnt axis
    axis_cnt.bar(x, y_cnt, color = '#00cc00')  # blue
    axis_cnt.set_ylabel('Amount of movies among top 50', color = '#00cc00')

    # avg axis
    axis_avg.plot(x, y_avg, 'ro-')
    axis_avg.set_ylabel('Average rating', color = 'r')

    # save the figure
    plt.savefig("Average ratings.jpg")