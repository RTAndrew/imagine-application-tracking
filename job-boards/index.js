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

class Greenhouse extends JobBoardInterface {
	constructor(url) {
		super(url);
	}

	getJobTitle() {
		const aboutJobDiv = document
			.querySelector("div[class=job__title]")
			.querySelector("h1");

		return aboutJobDiv.textContent.trim();
	}

	async getJobDetails() {
		try {
			const jobTitle = this.getJobTitle();

			const details = {
				jobTitle: jobTitle ? jobTitle : "",
				companyName: "",
				url: window.location.href,
				recruiter: "",
			};

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
class LinkedIn extends JobBoardInterface {
	constructor(url) {
		super(url);
	}

	async getJobDetails() {
		try {
			let jobTitle = "";
			let companyName = "";
			let recruiter =
				document
					.getElementsByClassName("hirer-card__hirer-information")?.[0]
					?.querySelectorAll("a")?.[0]
					?.textContent.trim() ?? "";

			// 1. Check if the job is on double panel
			const doublePanel = document.getElementsByClassName(
				"job-details-jobs-unified-top-card__container--two-pane"
			);

			// 2. If the job is on double panel,
			// get the title
			if (doublePanel.length > 0) {
				jobTitle = doublePanel[0].querySelectorAll("a")[2].textContent.trim();

				companyName = doublePanel[0]
					.querySelectorAll("a")[1]
					.textContent.trim();
			} else {
				jobTitle = document
					.querySelector("h1[class='t-24 t-bold inline']")
					.textContent.trim();
				companyName = document
					.getElementsByClassName(
						"job-details-jobs-unified-top-card__company-name"
					)[0]
					.textContent.trim();
			}

			const details = {
				recruiter,
				jobTitle,
				companyName,
				url: window.location.href,
			};

			console.log("details", details);

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
	if (url.includes("greenhouse.io")) return new Greenhouse(url);
	if (url.includes("linkedin.com")) return new LinkedIn(url);

	return null;
};

// Listen for messages from background script
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
	try {
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
				recruiter: jobDetails?.recruiter ?? "",
				jobUrl: jobDetails?.url ?? "",
			});

			await jobModal.createModal();

			sendResponse(jobDetails);

			return true; // Keep message channel open for async response
		}
	} catch (error) {
		console.error("Error getting job details:", error);
		return { error: error.message };
	}
});
