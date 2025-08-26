// TODO: initialize the modal with ID so it can be removed
class JobDetailsModal {
	constructor(parameters) {
		this.jobTitle = parameters.jobTitle;
		this.companyName = parameters.companyName;
		this.hrRecruiter = parameters.hrRecruiter;
		this.jobUrl = parameters.jobUrl;
	}

	async createModal() {
		// Ensure CSS is injected before creating the modal
		if (window.imagineJobCSSInjector) {
			await window.imagineJobCSSInjector.injectCSS();
		}

		const modal = `
      <modal class="imaginejob-modal">
        <div class="imaginejob-modalContent">
          <p class="imaginejob-modalTitle">Imagine - Application Tracking</p>

          <form method="dialog" id="modal-form-1" class="imaginejob-form">
            <span class="imaginejob-formGroup">
              <label for="imaginejob-jobTitle" class="imaginejob-label">Job Title</label>
              <input id="imaginejob-jobTitle" class="imaginejob-input" type="text" placeholder="Job Title" value="${this.jobTitle}">
            </span>

            <span class="imaginejob-formGroup">
              <label for="imaginejob-companyName" class="imaginejob-label">Company Name</label>
              <input class="imaginejob-input" type="text" id="imaginejob-companyName" placeholder="Company Name" value="${this.companyName}">
            </span>

            <span class="imaginejob-formGroup">
              <label for="imaginejob-hrRecruiter" class="imaginejob-label">HR Recruiter</label>
              <input class="imaginejob-input" type="text" id="imaginejob-hrRecruiter" placeholder="HR Recruiter" value="${this.hrRecruiter}">
            </span>

            <span class="imaginejob-formGroup">
              <label for="imaginejob-jobUrl" class="imaginejob-label">Job URL</label>
              <input class="imaginejob-input" type="text" id="imaginejob-jobUrl" placeholder="Job URL" value="${this.jobUrl}">
            </span>
          </form>

          <div class="imaginejob-footer">
            <button class="imaginejob-button imaginejob-button-cancel">Cancel</button>
            <button class="imaginejob-button imaginejob-button-save">Save</button>
          </div>
        </div>
      </modal>
    `;

		document.body.insertAdjacentHTML("beforeend", modal);

		// Close the modal
		const cancelButton = document.querySelector(".imaginejob-button-cancel");
		cancelButton.addEventListener("click", (e) => {
			e.preventDefault();
			document.body.removeChild(document.querySelector(".imaginejob-modal"));
		});

		// Save the job details
		const saveButton = document.querySelector(".imaginejob-button-save");
		saveButton.addEventListener("click", (e) => {
			e.preventDefault();
			console.log(
				"saveButton",
				this.jobTitle,
				this.companyName,
				this.hrRecruiter,
				this.jobUrl
			);

			chrome.runtime.sendMessage({
				action: "fillJobDetails",
				content: {
					jobTitle: this.jobTitle,
					companyName: this.companyName,
					recruiter: this.hrRecruiter,
					url: this.jobUrl,
				},
			});
		});

		const input = document.querySelectorAll(".imaginejob-input");
		input.forEach((input) => {
			input.addEventListener("input", (e) => {
				if (e.target.id === "imaginejob-jobTitle") {
					this.jobTitle = e.target.value;
				} else if (e.target.id === "imaginejob-companyName") {
					this.companyName = e.target.value;
				} else if (e.target.id === "imaginejob-hrRecruiter") {
					this.hrRecruiter = e.target.value;
				} else if (e.target.id === "imaginejob-jobUrl") {
					this.jobUrl = e.target.value;
				}
			});
		});
	}
}
