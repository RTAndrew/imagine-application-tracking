console.log("Imagine Job Tracking background script loaded");

const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeDBBvxuso7eWPZhAM0DEPPaH1N_BxeH-8UWcSJBFTtUd8tCA/viewform"

const initializeForm = () => {
	const emailInput = document.querySelector(
		"input[type='email'][jsname='YPqjbf']"
	);

	if (emailInput) {
		emailInput.value = "insanityrodax@gmail.com";
		emailInput.dispatchEvent(new Event("input", { bubbles: true }));
	}
};

/**
 * Fills the job form with the details.
 *
 * The form is located in the following URL:
 * @link {@link FORM_URL}
 *
 * @param {Object} details - The details of the job
 * @param {string} details.jobTitle - The title of the job
 * @param {string} details.url - The URL/link to the job posting
 * @param {string} details.companyName - The name of the company
 * @param {string} details.recruiter - The name of the recruiter
 */
const fillJobForm = (details) => {
	const jobTitle = document.querySelector(
		"input[type='text'][aria-labelledby='i6 i9']"
	);

	const jobLink = document.querySelector(
		"input[type='text'][aria-labelledby='i11 i14']"
	);

	const companyName = document.querySelector(
		"input[type='text'][aria-labelledby='i16 i19']"
	);

	const recruiter = document.querySelector(
		"input[type='text'][aria-labelledby='i21 i24']"
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

	if (recruiter) {
		recruiter.value = details?.recruiter ?? "";
		recruiter.dispatchEvent(new Event("input", { bubbles: true }));
	}

	const submitButton = document.querySelector("div[aria-label='Submit']");

	if (submitButton) {
		submitButton.click();
		submitButton.dispatchEvent(new Event("click", { bubbles: true }));
	}
};

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log("request", request);

	if (request.action === "fillJobDetails") {
		console.log("Getting job details...");

		fillJobForm(request.content);

		sendResponse({
			success: true,
			message: "Job form filled successfully",
		});

		return true; // Keep message channel open for async response
	}
});

initializeForm();
