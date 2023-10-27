chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status !== "complete") {
		return;
	}

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: contentScriptFunc,
	});
});

async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

function contentScriptFunc() {
	let block = true;

	document.addEventListener("paste", async (e) => {
		if (block) {
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();
			block = false;

			const items = [];

			const records = {};
			for (let type of e.clipboardData.types) {
				if (type === "Files") {
					continue;
				}
				switch (type) {
					case "text/html":
						const data = e.clipboardData.getData(type);
						const result = data.replace(
							/((background\-color)|(color)):\s#[0-9a-f]{6};*/g,
							""
						);
						records[type] = new Blob([result], { type });
						break;
					case "text/plain":
					case "image/png":
						records[type] = new Blob([e.clipboardData.getData(type)], { type });
						break;
					default:
						const startType = type;
						type = `web ${type}`;
						records[type] = new Blob([e.clipboardData.getData(startType)], {
							type,
						});
				}
			}

			if (Object.keys(records).length !== 0) {
				items.push(new ClipboardItem(records));
			}

			if (items.length > 0) {
				await navigator.clipboard.write(items);
			}
			document.execCommand("paste", false);
		} else {
			block = true;
		}
	});
}
