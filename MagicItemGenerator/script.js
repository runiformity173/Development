(async () => {
	const allData = {};
	for (let iter = 0;iter < 1000;iter++) {
		if (iter%50 == 0) console.log(iter);
		const rawResponse = await fetch('https://www.kassoon.com/dnd/magic-item-generator');
		const content = await rawResponse.text();
		const matches = [...content.matchAll('<table class="noMobile">[^<]+(?:<[^<]+<[^<]+<[^<]+<[^<]+){2,4}</table>')];
		const data = [];
		for (const t of matches) {
			const match = t[0];
			const subMatches = [...match.matchAll('(?<=<th>)[^<]+(?=</th>)')];
			const subMatches2 = [...match.matchAll('(?<=<td[^>]*>)[^<]+(?=</td>)')];
			data.push([subMatches[0][0],...subMatches2.map(o=>o[0])]);
		}
		if (data.length == 3) {
			for (const i of data) {
				for (let j = 1;j < i.length;j++) {
					const k = i[j];
					if (k in allData) allData[k].push(i[0]);
					else allData[k] = [i[0]];
				}
			}
		}
	}
	console.log(allData);
	return allData;
})();