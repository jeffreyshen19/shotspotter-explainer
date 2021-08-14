# Many Kansas City records are located at same coordinates because of anonymization which makes assessing scale difficult on a map. This file aggregates counts of ShotSpotter activations at a coordinate

import csv

# Get counts
counts = {}
with open('../data/raw/kansas-city-shotspotter-activations.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile, delimiter=',', quotechar='|')

    for row in reader:
        lat = row["Latitude"]
        lng = row["Longitude"]

        if((lat, lng) not in counts): counts[(lat, lng)] = 0

        counts[(lat, lng)] += 1

# Write
with open('../data/raw/kansas-city-shotspotter-activations-grouped.csv', 'w', newline='') as csvfile:
    fieldnames = ['Latitude', 'Longitude', 'Activations']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()

    for (lat, lng), activations in counts.items():
        writer.writerow({'Latitude': lat, 'Longitude': lng, 'Activations': activations})
