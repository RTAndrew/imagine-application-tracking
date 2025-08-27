console.log("Imagine Job Tracking script loaded");

class JobBoardInterface {
	constructor(url) {
		this.url = url;
	}

	async getJobDetails() {
		throw new Error("Not implemented");
	}

	async sendJobDetailsToFormPage(details) {
		chrome.runtime.sendMessage({ action: "fillJobDetails", content: details });
	}
}

class Xing extends JobBoardInterface {
	constructor(url) {
		super(url);
	}

	async getJobDetails() {
		try {
			const jobTitle = document.querySelector('h1[data-xds="Hero"]');
			const companyName = document.querySelector(
				'p[data-testid="job-details-company-info-name"]'
			);

			const details = {
				jobTitle: jobTitle ? jobTitle.textContent.trim() : "",
				companyName: companyName ? companyName.textContent.trim() : "",
				url: window.location.href,
			};

			this.sendJobDetailsToFormPage(details);

			return details;
		} catch (error) {
			console.error("Error getting job details:", error);
			return { error: error.message };
		}
	}

	async sendJobDetailsToFormPage(details) {
		super.sendJobDetailsToFormPage(details);
	}
}

class StepStone extends JobBoardInterface {
	constructor(url) {
		super(url);
	}

	async getJobDetails() {
		try {
			const jobTitle = document.querySelector("h1[data-at='header-job-title']");
			const companyName = document.querySelector(
				"span[data-at='metadata-company-name']"
			).childNodes[1];

			const details = {
				jobTitle: jobTitle ? jobTitle.textContent.trim() : "",
				companyName: companyName ? companyName.textContent.trim() : "",
				url: window.location.href,
				recruiter: "",
			};

			this.sendJobDetailsToFormPage(details);

			return details;
		} catch (error) {
			console.error("Error getting job details:", error);
			return { error: error.message };
		}
	}

	async sendJobDetailsToFormPage(details) {
		super.sendJobDetailsToFormPage(details);
	}
}

class Join extends JobBoardInterface {
	constructor(url) {
		super(url);
	}

	getJobTitle() {
		// Join.com does not have a stable ID for the job title,
		// but it has for the job description,
		// 1. Get the element with the stable ID
		const aboutJobDiv = document.getElementById("about-job");

		// 2. Get its parent element
		const parentDiv = aboutJobDiv.parentElement;

		// 3. From the parent, get the H1
		const heading = parentDiv.querySelector("h1");
		return heading.textContent.trim();
	}

	async getJobDetails() {
		try {
			const jobTitle = this.getJobTitle();
			const companyName = document
				.querySelector("div[data-testid='CompanyInfo']")
				.querySelector("h2");

			const details = {
				jobTitle: jobTitle ? jobTitle : "",
				companyName: companyName ? companyName.textContent.trim() : "",
				url: window.location.href,
				recruiter: "",
			};

			this.sendJobDetailsToFormPage(details);

			return details;
		} catch (error) {
			console.error("Error getting job details:", error);
			return { error: error.message };
		}
	}

	async sendJobDetailsToFormPage(details) {
		super.sendJobDetailsToFormPage(details);
	}
}

const JobBoardFactory = (url) => {
	if (url.includes("xing.com")) return new Xing(url);
	if (url.includes("stepstone.de")) return new StepStone(url);
	if (url.includes("join.com")) return new Join(url);

	return null;
};

// Listen for messages from background script
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
	if (request.action === "getJobDetails") {
		console.log("Getting job details...");

		// 1. check the URL and create the appropriate instance of the JobBoardInterface
		const extractJobBoardUrl = window.location.href;
		const jobBoardInstance = JobBoardFactory(extractJobBoardUrl);

		console.log("jobBoardInstance", jobBoardInstance);

		// 2. get the job details
		const jobDetails = await jobBoardInstance.getJobDetails();

		// 3. create the job details modal
		const jobModal = new JobDetailsModal({
			jobTitle: jobDetails.jobTitle,
			companyName: jobDetails.companyName,
			hrRecruiter: jobDetails?.hrRecruiter ?? "",
			jobUrl: jobDetails?.url ?? "",
		});

		await jobModal.createModal();

		sendResponse(jobDetails);

		return true; // Keep message channel open for async response
	}
});
