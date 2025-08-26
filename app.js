const initializeForm = () => {
	const emailInput = document.querySelector(
		"input[type='email'][jsname='YPqjbf']"
	);

	if (emailInput) {
		emailInput.value = "insanityrodax@gmail.com";
		emailInput.dispatchEvent(new Event("input", { bubbles: true }));
	}
};

const fillJobDetails = (details) => {
	const jobTitle = document.querySelector(
		"input[type='text'][aria-labelledby='i6 i9']"
	);

	const jobLink = document.querySelector(
		"input[type='text'][aria-labelledby='i11 i14']"
	);

	const companyName = document.querySelector(
		"input[type='text'][aria-labelledby='i16 i19']"
	);

	if (jobTitle) {
		jobTitle.value = details.jobTitle;
		jobTitle.dispatchEvent(new Event("input", { bubbles: true }));
	}

	if (jobLink) {
		jobLink.value = details.url;
		jobLink.dispatchEvent(new Event("input", { bubbles: true }));
	}

	if (companyName) {
		companyName.value = details.companyName;
		companyName.dispatchEvent(new Event("input", { bubbles: true }));
	}

	const submitButton = document.querySelector("div[aria-label='Submit']");

	if (submitButton) {
		submitButton.click();
		submitButton.dispatchEvent(new Event("click", { bubbles: true }));
	}

	// TODO: Click on the submit other button
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log("request", request);

	if (request.action === "fillJobDetails") {
		console.log("Getting job details...");

		fillJobDetails(request.content);

		return true; // Keep message channel open for async response
	}
});

initializeForm();
