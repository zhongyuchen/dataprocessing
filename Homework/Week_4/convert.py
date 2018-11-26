import sys
sys.path.append('../')
from Week_3.convertCSV2JSON import csv2json


CSV_FILE = "data.csv"
JSON_FILE = "data.json"


if __name__ == "__main__":
    csv2json(CSV_FILE, JSON_FILE)
