import csv
import json

def csv_to_json(csv_file_path, json_file_path, num_rows=5000):
    # Initialize an empty list to store the parsed data
    data = []

    # Read the CSV file and parse its contents for a limited number of rows
    with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for idx, row in enumerate(csv_reader):
            if idx < num_rows:
                data.append(row)
            else:
                break  # Stop parsing after 5000 rows

    # Write the parsed data into a JSON file
    with open(json_file_path, 'w') as json_file:
        json.dump(data, json_file, indent=4)

# Replace 'input.csv' with the path to your CSV file
# Replace 'output.json' with the desired name/path for your JSON file
csv_to_json('spotify_songs.csv', 'spotify_songs.json', num_rows=30000)
