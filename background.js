chrome.commands.onCommand.addListener(async (command) => {
	console.log(`Command: ${command}`);
	// document.execCommand("insertText", false, "true");

	const tab = await getCurrentTab();
	if (!tab) return;
	// console.log(document);
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

function contentScriptFunc(name) {
	document.addEventListener("paste", (e) => {
		e.preventDefault();
		navigator.clipboard.writeText("test");
		navigator.clipboard.dispatchEvent("paste");
		// const data = e.clipboardData.getData("text/plain");
		// console.log(data);
		// const modifiedData = "new value";
		// document.execCommand("paste");
	});
	// document.addEventListener("paste", )
	console.log("test", navigator);
}

// chrome.action.onClicked.addListener(function (tab) {
// 	chrome.scripting.executeScript({
// 		target: { tabId: tab.id },
// 		function: enableClipboardModification,
// 	});
// });

// function enableClipboardModification() {
// 	console.log("enabled");
// 	document.addEventListener("paste", function (event) {
// 		console.log("paste", data);
// 		event.preventDefault();
// 		const clipboardData = event.clipboardData.getData("text/plain");
// 		console.log(" data", clipboardData);
// 		// Modify the clipboard data as needed
// 		const modifiedData = clipboardData.replace(/old_value/g, "new_value");
// 		document.execCommand("insertText", false, modifiedData);
// 	});
// }
