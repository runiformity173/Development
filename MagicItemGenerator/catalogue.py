from json import load,dump
data = {}
for k in range(1,7):
	with open("data"+str(k)+".json","r") as fl:
		for i,j in load(fl).items():
			if i in data:
				data[i].extend(j)
			else:
				data[i] = j
with open("data.json","w") as fl:
	dump(data,fl)
with open("done.json","r") as fl:
	done = load(fl)
for i in data:
	if i in done and done[i] != "skip1":
		continue
	print()
	[print(j) for j in data[i]]
	print()
	print(i)
	print()
	found = False
	words = data[i]
	if len(words) > 9:
		words = [j.split()[:-1] for j in words]
		maxLength = max(map(len,words))
		front = [{} for j in range(maxLength)]
		end = [{} for j in range(maxLength)]
		for j in range(1):
			for k in words:
				if j >= len(k):continue
				if k[j] in front[j]:
					front[j][k[j]].append(" ".join(k))
				else:
					front[j][k[j]] = [" ".join(k)]
				if k[~j] in end[j]:
					end[j][k[~j]].append(" ".join(k)[::-1])
				else:
					end[j][k[~j]] = [" ".join(k)[::-1]]
		prefixGroup = list(front[0].values())[0]
		for j in front[0]:
			if len(front[0][j]) > len(prefixGroup):
				prefixGroup = front[0][j]
		suffixGroup = list(end[0].values())[0]
		for j in end[0]:
			if len(end[0][j]) > len(suffixGroup):
				suffixGroup = end[0][j]
		prefix = ""
		suffix = ""
		j = 0
		while True:
			k = prefixGroup[0][j]
			t = True
			for item in prefixGroup:
				if item[j] != k:
					t = False
					break
			if not t:
				break
			j += 1
			prefix += k
		j = 0
		while True:
			k = suffixGroup[0][j]
			t = True
			for item in suffixGroup:
				if item[j] != k:
					t = False
					break
			if not t:
				break
			j += 1
			suffix = k + suffix
		prefix = prefix.strip()
		suffix = suffix.strip()
		found = True
	if found:
		k = input(prefix+": ")
		l = input(suffix+": ")
		if k == "":k = prefix
		if l == "":l = suffix
	else:
		k = input("Before: ")
		l = input("After: ")
	if k == "skip" or l == "skip":
		done[i] = "skip1"
	elif k == "ASI":
		done[i] = "ASI"
	elif k == "" or l == "":
		break
	else:
		done[i] = [k.split(","),l.split(",")]
	with open("done.json","w") as fl:
		dump(done,fl,indent=2)