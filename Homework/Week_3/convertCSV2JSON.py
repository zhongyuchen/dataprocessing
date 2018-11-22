import csv
import json


CSV_FILE = "KNMI_20171231.csv"
JSON_FILE = "temperature.json"


def csv2json(csvname, jsonname):
    # convert csv to json file
    with open(csvname, "r") as csvfile:
        reader = csv.DictReader(csvfile)
        rows = list(reader)
    with open(jsonname, "w") as jsonfile:
        json.dump(rows, jsonfile, indent=4)


if __name__ == "__main__":
    csv2json(CSV_FILE, JSON_FILE)
