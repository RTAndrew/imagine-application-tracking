const emailInput = document.querySelector('input[type="email"][jsname="YPqjbf"]');

if (emailInput) {
  emailInput.value = "insanityrodax@gmail.com";
  emailInput.dispatchEvent(new Event('input', { bubbles: true  }));
}