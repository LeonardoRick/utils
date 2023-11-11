import json
from glob import glob
from os import path


def loadJson(filePrefix):
    accounts = []
    # filter json files by prefix so we can load them separately as followers and following
    files = [fileName for fileName in jsonFiles if filePrefix in fileName]
    for jfile in files:
        try:
            with open(jfile) as f:
                accounts.append(json.load(f))
        except FileNotFoundError:
            continue
        except Exception as e:
            print(e)
            break
    return accounts


def createListFromJson(data, key=None):
    value = data[key] if key else data
    return list(map(lambda f: f['string_list_data'][0]['value'], value))


# Use glob to match JSON files in the current folder
jsonFiles = glob(path.join(path.curdir, '*.json'))
followingFileName = 'following'
followersFileName = 'followers'
followingList = []
followersList = []
# list of jsons considering multiple files (index 0 will
#  be relative to following.json, index 1 will be relative
# to following_1.json and so on)
following = loadJson('following')
followers = loadJson('followers')

for f in following:
    followingList.extend(createListFromJson(f, 'relationships_following'))

for r in followers:
    followersList.extend(createListFromJson(r))

for f in followingList:
    if f not in followersList:
        print(f)
