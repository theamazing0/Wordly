import json

dataset1 = open(r"<500.txt", "r")
dataset2 = open(r"501<>600.txt", "r")
dataset3 = open(r"601<.txt", "r")

fulldataset = {}

for line in dataset1:
    values = line.split()
    word = values[0]
    level = values[1]
    fulldataset[word] = level

for line in dataset2:
    values = line.split()
    word = values[0]
    level = values[1]
    fulldataset[word] = level

for line in dataset3:
    values = line.split()
    word = values[0]
    level = values[1]
    fulldataset[word] = level

print(fulldataset)

dataset1.close()
dataset2.close()
dataset3.close()

with open('fam.json', 'w') as fp:
    json.dump(fulldataset, fp, sort_keys=True, indent=4)
