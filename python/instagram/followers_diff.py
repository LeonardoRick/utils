import json


def loadJson(filePrefix):
    accounts = []
    count = 0
    while True:
        try:
            # if the number is 0, consider following.json, if its more than 0, consider
            # following_1.json, following_2.json and so on
            fileName = f'{filePrefix}{"_" + str(count) if count > 0 else ""}.json'
            with open(fileName) as f:
                accounts.append(json.load(f))
                count += 1
        except FileNotFoundError:
            break
        except Exception as e:
            print(e)
            break
    return accounts


def createListFromJson(data, key=None):
    value = data[key] if key else data
    return list(map(lambda f: f['string_list_data'][0]['value'], value))


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
