var resumeform = document.getElementById("resumeform");
var resumeOutputElement = document.getElementById("resumeOutput");
resumeform.addEventListener("submit", function (event) {
    var _a;
    event.preventDefault();
    var name = document.getElementById("name").value;
    var address = document.getElementById("address").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("email").value;
    var education = document.getElementById("education").value;
    var experience = document.getElementById("experience").value;
    var skills = document.getElementById("skills").value.split(',').map(function (skill) { return "<li>".concat(skill.trim(), "</li>"); }).join('');
    var profilePicture = (_a = document.getElementById("profilePicture").files) === null || _a === void 0 ? void 0 : _a[0];
    var profilePictureURL = '';
    if (profilePicture) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var _a;
            profilePictureURL = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            generateResume(profilePictureURL);
        };
        reader.readAsDataURL(profilePicture);
    }
    else {
        generateResume();
    }
    function generateResume(profilePic) {
        if (profilePic === void 0) { profilePic = ''; }
        var profilePicHTML = profilePic ? "<img src=\"".concat(profilePic, "\" alt=\"Profile Picture\" style=\"width:150px;height:150px;object-fit:cover;border-radius:50%;\">") : '';
        var resumeOutput = "\n            <div style=\"text-align: center;\">\n                ".concat(profilePicHTML, "\n                <h1 id=\"nameDisplay\">").concat(name, "</h1>\n            </div> \n            <h2>Personal Info</h2>\n            <p><strong>Email:</strong> <span id=\"emailDisplay\">").concat(email, "</span></p>\n            <p><strong>Phone #:</strong> <span id=\"phoneDisplay\">").concat(phone, "</span></p>\n            <p><strong>Address:</strong> <span id=\"addressDisplay\">").concat(address, "</span></p>\n\n            <h2 id=\"educationHeader\">Education</h2>\n            <p id=\"educationDisplay\">").concat(education.split(',').map(function (item) { return item.trim(); }).join('<br>'), "</p>\n\n            <h2>Experience</h2>\n            <p id=\"experienceDisplay\">").concat(experience, "</p>\n\n            <h2>Skills</h2>\n            <ul id=\"skillsDisplay\">").concat(skills, "</ul>\n        ");
        if (resumeOutputElement) {
            resumeOutputElement.innerHTML = resumeOutput;
            makeEditable();
        }
    }
    function makeEditable() {
        var editableSections = [
            { id: "educationDisplay", type: "textarea" },
            { id: "emailDisplay", type: "input" },
            { id: "phoneDisplay", type: "input" },
            { id: "addressDisplay", type: "input" },
            { id: "experienceDisplay", type: "textarea" },
            { id: "skillsDisplay", type: "textarea", isList: true }, // Added isList flag for skills
        ];
        editableSections.forEach(function (section) {
            var field = document.getElementById(section.id);
            if (field) {
                field.addEventListener("click", function () {
                    var currentValue;
                    if (section.isList) {
                        currentValue = field.innerHTML.replace(/<\/?li>/g, '').replace(/<br>/g, ', ').trim(); // Convert list items to commas for textarea
                    }
                    else {
                        currentValue = field.innerText.trim(); // Use innerText for other inputs
                    }
                    var inputField = section.type === "textarea"
                        ? document.createElement("textarea")
                        : document.createElement("input");
                    inputField.value = currentValue;
                    // Handle the blur event to save changes
                    inputField.addEventListener("blur", function () {
                        if (section.isList) {
                            var newSkills = inputField.value.split(',').map(function (skill) { return "<li>".concat(skill.trim(), "</li>"); }).join('');
                            field.innerHTML = newSkills; // Update list content for skills
                        }
                        else if (section.type === "textarea") {
                            field.innerHTML = inputField.value.split(',').map(function (item) { return item.trim(); }).join('<br>'); // Convert commas back to new lines for other sections
                        }
                        else {
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
