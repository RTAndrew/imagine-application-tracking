class JobDetailsModal {
	constructor(parameters) {
		this.jobTitle = parameters.jobTitle;
		this.companyName = parameters.companyName;
		this.hrRecruiter = parameters.hrRecruiter;
		this.jobUrl = parameters.jobUrl;
		this.modalId = this.generateUniqueId();
	}

	generateUniqueId() {
		return (
			"imaginejob-modal-" +
			Date.now() +
			"-" +
			Math.random().toString(36).substr(2, 9)
		);
	}

	async createModal() {
		// Ensure CSS is injected before creating the modal
		if (window.imagineJobCSSInjector) {
			await window.imagineJobCSSInjector.injectCSS();
		}

		const modal = `
      <modal class="imaginejob-modal" id="${this.modalId}">
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
			const modal = document.getElementById(this.modalId);
			if (modal) {
				document.body.removeChild(modal);
			}
		});

		// Save the job details
		const saveButton = document.querySelector(".imaginejob-button-save");
		saveButton.addEventListener("click", (e) => {
			e.preventDefault();

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
