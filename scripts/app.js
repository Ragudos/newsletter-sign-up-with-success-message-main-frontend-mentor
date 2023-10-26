import { mobileArt, desktopArt } from "./art.js";

/** Since there's a bug which I don't know
 *  that happens when I place two of the svg arts and
 *  the color tomato on the desktop version disappears, I will just render them conditionally
 */

const isDesktopQuery = window.matchMedia("(min-width: 1440px)");

const artContainer = document.getElementById("art-container");


function renderArt(matches) {
    if (!artContainer) {
        return;
    }

    if (matches) {
        artContainer.innerHTML = desktopArt;
    } else {
        artContainer.innerHTML = mobileArt;
    }
}

isDesktopQuery.addEventListener("change", (e) => {
    renderArt(e.matches);
});

renderArt(isDesktopQuery.matches);

const submitForm = document.getElementById("submit-form");
const allInput = document.querySelectorAll("#submit-form input");
const labelContainer = document.querySelectorAll(".label");
const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

if (submitForm) {
    submitForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let isInvalid = false;

        const formData = new FormData(e.target);
        const dataInObject = {};

        for (const label of labelContainer) {
            const labels = label.getAttribute("data-labels");
            const email = formData.get(labels);

            dataInObject[labels] = email;

            if (email) {
                const isValid = validEmailRegex.test(email);

                console.log(isValid);

                if (!isValid) {
                    const id = `error-${labels}`;
                    const existingErrorDiv = document.getElementById(id);

                    if (!existingErrorDiv) {
                        const errorDiv = document.createElement("div");

                        errorDiv.textContent = `Valid ${labels} is required.`
                        errorDiv.classList.add("error");
                        errorDiv.id = id
                        label.appendChild(errorDiv);
                    }

                    isInvalid = true;
                }
            }
        }

        if (!isInvalid) {
            submitFormData(dataInObject);
        }
    });

    allInput.forEach((input) => {
        input.addEventListener("keydown", (e) => {
            const name = e.target.getAttribute("name");
            const label = document.querySelector(`[data-labels=${name}]`);
            const errorDiv = document.getElementById(`error-${name}`);

            if (errorDiv && label) {
                label.removeChild(errorDiv);
            }
        });
    });
}

const emailNewsletter = document.getElementById("email-newsletter");
const successMsg = document.getElementById("success-msg");
const emailContainer = document.getElementById("email-submitted");
const dismissMsg = document.getElementById("dismiss-success-msg");

function submitFormData(data) {
    const email = data.email;

    if (emailContainer) {
        emailContainer.textContent = email;
    }

    if (successMsg) {
        successMsg.removeAttribute("hidden");
    }

    emailNewsletter.setAttribute("hidden", "true");

    allInput.forEach((input) => {
        input.value = null;
    });

    if (dismissMsg) {
        dismissMsg.addEventListener("click", () => {
            successMsg.setAttribute("hidden", "true");
            emailNewsletter.removeAttribute("hidden");
        }, {
            once: true,
        });
    }
}
