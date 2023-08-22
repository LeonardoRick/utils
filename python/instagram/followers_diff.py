import json

following = None
followers = None

with open('following.json') as f:
    following = json.load(f)
with open('followers.json') as f:
    followers = json.load(f)


followingList = list(
    map(
        lambda f: f['string_list_data'][0]['value'],
        following['relationships_following'],
    )
)

followersList = list(map(lambda f: f['string_list_data'][0]['value'], followers))

for f in followingList:
    if f not in followersList:
        print(f)
