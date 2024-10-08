const resumeform = document.getElementById("resumeform") as HTMLFormElement;
const resumeOutputElement = document.getElementById("resumeOutput") as HTMLDivElement | null;

resumeform.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = (document.getElementById("name") as HTMLInputElement).value;
    const address = (document.getElementById("address") as HTMLInputElement).value;
    const phone = (document.getElementById("phone") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const education = (document.getElementById("education") as HTMLTextAreaElement).value;
    const experience = (document.getElementById("experience") as HTMLTextAreaElement).value;
    const skills = (document.getElementById("skills") as HTMLTextAreaElement).value.split(',').map(skill => `<li>${skill.trim()}</li>`).join('');

    const profilePicture = (document.getElementById("profilePicture") as HTMLInputElement).files?.[0];
    let profilePictureURL = '';

    if (profilePicture) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profilePictureURL = e.target?.result as string;
            generateResume(profilePictureURL);
        };
        reader.readAsDataURL(profilePicture);
    } else {
        generateResume();
    }

    function generateResume(profilePic: string = '') {
        const profilePicHTML = profilePic ? `<img src="${profilePic}" alt="Profile Picture" style="width:150px;height:150px;object-fit:cover;border-radius:50%;">` : '';

        const resumeOutput = `
            <div style="text-align: center;">
                ${profilePicHTML}
                <h1 id="nameDisplay">${name}</h1>
            </div> 
            <h2>Personal Info</h2>
            <p><strong>Email:</strong> <span id="emailDisplay">${email}</span></p>
            <p><strong>Phone #:</strong> <span id="phoneDisplay">${phone}</span></p>
            <p><strong>Address:</strong> <span id="addressDisplay">${address}</span></p>

            <h2 id="educationHeader">Education</h2>
            <p id="educationDisplay">${education.split(',').map(item => item.trim()).join('<br>')}</p>

            <h2>Experience</h2>
            <p id="experienceDisplay">${experience}</p>

            <h2>Skills</h2>
            <ul id="skillsDisplay">${skills}</ul>
        `;

        if (resumeOutputElement) {
            resumeOutputElement.innerHTML = resumeOutput;
            makeEditable();
        }
    }

    function makeEditable() {
        const editableSections = [
            { id: "educationDisplay", type: "textarea" },
            { id: "emailDisplay", type: "input" },
            { id: "phoneDisplay", type: "input" },
            { id: "addressDisplay", type: "input" },
            { id: "experienceDisplay", type: "textarea" },
            { id: "skillsDisplay", type: "textarea", isList: true }, // Added isList flag for skills
        ];

        editableSections.forEach(section => {
            const field = document.getElementById(section.id);
            if (field) {
                field.addEventListener("click", () => {
                    let currentValue: string;
                    if (section.isList) {
                        currentValue = field.innerHTML.replace(/<\/?li>/g, '').replace(/<br>/g, ', ').trim(); // Convert list items to commas for textarea
                    } else {
                        currentValue = field.innerText.trim(); // Use innerText for other inputs
                    }

                    const inputField = section.type === "textarea"
                        ? document.createElement("textarea")
                        : document.createElement("input");

                    inputField.value = currentValue;

                    // Handle the blur event to save changes
                    inputField.addEventListener("blur", () => {
                        if (section.isList) {
                            const newSkills = inputField.value.split(',').map(skill => `<li>${skill.trim()}</li>`).join('');
                            field.innerHTML = newSkills; // Update list content for skills
                        } else if (section.type === "textarea") {
                            field.innerHTML = inputField.value.split(',').map(item => item.trim()).join('<br>'); // Convert commas back to new lines for other sections
                        } else {
                            field.innerText = inputField.value; // Update text content for input fields
                        }
                    });

                    field.innerHTML = ''; // Clear the current HTML
                    field.appendChild(inputField);
                    inputField.focus();
                });
            }
        });
    }
});
