console.log("Xing content script loaded");

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "getJobDetails") {
		console.log("Getting job details...");

		getJobDetails().then((details) => {
			console.log("Job details:", details);
			const Job = new JobDetailsModal({
				jobTitle: details.jobTitle,
				companyName: details.companyName,
				hrRecruiter: details?.hrRecruiter ?? "",
				jobUrl: details?.url ?? "",
			});

			Job.createModal();

			return;
			sendResponse(details);
		});
		return true; // Keep message channel open for async response
	}
});

const sendJobDetailsToFormPage = (details) => {
	chrome.runtime.sendMessage({ action: "fillJobDetails", content: details });
};

async function getJobDetails() {
	try {
		const jobTitle = document.querySelector('h1[data-xds="Hero"]');
		const companyName = document.querySelector(
			'p[data-testid="job-details-company-info-name"]'
		);

		sendJobDetailsToFormPage({
			jobTitle: jobTitle ? jobTitle.textContent.trim() : "",
			companyName: companyName ? companyName.textContent.trim() : "",
			url: window.location.href,
		});

		return {
			jobTitle: jobTitle ? jobTitle.textContent.trim() : "",
			companyName: companyName ? companyName.textContent.trim() : "",
			url: window.location.href,
		};
	} catch (error) {
		console.error("Error getting job details:", error);
		return { error: error.message };
	}
}
