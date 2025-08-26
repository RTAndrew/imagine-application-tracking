console.log("Imagine background script loaded");

chrome.contextMenus.create(
	{
		id: "imagine-job-email-insert",
		title: "Log job details",
		contexts: ["page"],
	},
	() => {
		console.log("Context menu created successfully");
	}
);

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log("Background received message:", request);

	if (request.action === "fillJobDetails") {
		console.log("Forwarding job details to Google Forms page");

		// Find the Google Forms tab and send the job details
		chrome.tabs.query({ url: "https://docs.google.com/forms/*" }, (tabs) => {
			if (tabs.length > 0) {
				chrome.tabs.sendMessage(tabs[0].id, {
					action: "fillJobDetails",
					content: request.content
				}, (response) => {
					if (chrome.runtime.lastError) {
						console.error("Error forwarding to Google Forms:", chrome.runtime.lastError);
					} else {
						console.log("Job details forwarded successfully");
					}
				});
			} else {
				console.log("No Google Forms tab found to forward job details");
			}
		});

		return true; // Keep message channel open
	}
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
	console.log("Context menu clicked:", info, tab);

	// Send message to content script to get job details
	if (tab && tab.url && tab.url.includes("xing.com/jobs")) {
		console.log("Sending message to Xing content script");

		chrome.tabs.sendMessage(tab.id, { action: "getJobDetails" }, (response) => {
			if (chrome.runtime.lastError) {
				console.error("Error sending message:", chrome.runtime.lastError);
			} else {
				console.log("Job details received:", response);
			}
		});
	} else {
		console.log("Not a Xing jobs page, skipping");
	}
});
