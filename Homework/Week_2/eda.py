import pandas as pd
import csv
import re
import json
import seaborn as sns


# global variables
INPUT_CSV = "input.csv"
OUTPUT_JSON = "output.json"
COLS = ["Country",
        "Region",
        "Pop. Density (per sq. mi.)",
        "Infant mortality (per 1000 births)",
        "GDP ($ per capita) dollars"]
# the highest GDP is around 170000
GDP_MAX = 180000


def get_number(s):
    # extract numbers from a string s
    return float(re.findall(r"\d+\,?\d*", s)[0].replace(',', '.'))


def load(filename):
    # load csv file, parse and preprocess data
    data = []
    # load csv
    with open(filename, newline = '') as file:
        # parse data
        reader = csv.DictReader(file)
        for row in reader:
            # take out unusable rows
            flag = 1
            for col in COLS:
                # missing or unknown data
                if row[col] == "" or row[col] == "unknown":
                    flag = 0
                    break
            # preprocess data and store data into a list
            if flag:
                # strip() strips spaces on both ends
                # get_number() extracts number
                # take out rows with impossible GDP
                gdp = int(get_number(row[COLS[4]]))
                if gdp < GDP_MAX:
                    data.append([row[COLS[0]].strip(),
                                 row[COLS[1]].strip(),
                                 get_number(row[COLS[2]]),
                                 get_number(row[COLS[3]]),
                                 gdp])
    # return data list
    return data


def build(filename):
    # load csv file, parse and preprocess data
    data = load(filename)
    # build dataframe
    return pd.DataFrame(data, columns = COLS, index = range(len(data)))


if __name__ == "__main__":
    # main

    # dataframe
    dataframe = build(INPUT_CSV)

    # central tendency of GDP ($ per capita) dollars
    gdp_mean = dataframe.mean()[COLS[4]]
    gdp_median = dataframe.median()[COLS[4]]
    gdp_mode = dataframe.mode()[COLS[4]][0]
    print("central tendency of GDP ($ per capita) dollars")
    print(f"mean:   {gdp_mean}")
    print(f"median: {gdp_median}")
    print(f"mode:   {gdp_mode}")
    print()

    # stanard deviation of GDP ($ per capita) dollars
    gdp_std = dataframe.std()[COLS[4]]
    print(f"stanard deviation of GDP ($ per capita) dollars: {gdp_std}")
    print()

    # histogram of GDP ($ per capita) dollars
    gdp_hist = dataframe[COLS[4]].plot.hist().get_figure()
    gdp_hist.savefig("GDP histogram.jpg")

    # five number summary of Infant mortality (per 1000 births)
    infant_min = dataframe.min()[COLS[3]]
    infant_q1 = dataframe.quantile(q = 0.25)[COLS[3]]
    infant_median = dataframe.median()[COLS[3]]
    infant_q3 = dataframe.quantile(q = 0.75)[COLS[3]]
    infant_max = dataframe.max()[COLS[3]]
    print("five number summary of Infant mortality (per 1000 births)")
    print(f"min: {infant_min}")
    print(f"1st quantile: {infant_q1}")
    print(f"median: {infant_median}")
    print(f"3rd quantile: {infant_q3}")
    print(f"max: {infant_max}")


    # box plot of Infant mortality (per 1000 births)
    infant_box = dataframe[COLS[3]].plot.box().get_figure()
    infant_box.savefig("infant mortality box.jpg")

    # dataframe > dict
    dict = dataframe.set_index(COLS[0]).to_dict('index')

    # dict > .json file
    with open(OUTPUT_JSON, "w") as file:
        json.dump(dict, file, indent = 4)

    # a scatterplot incorporating both the GDP and Infant Mortality Data
    scatter = sns.relplot(x = COLS[4], y = COLS[3], hue = COLS[1], data = dataframe)
    scatter.savefig("scatter.jpg")

    # regression of GDP and Infant Mortality Data
    dataframe['1 / Infant Mortality'] = 1 / dataframe[COLS[3]]
    regression = sns.lmplot(x = COLS[4], y = "1 / Infant Mortality", data = dataframe)
    regression.savefig("regression.jpg")
