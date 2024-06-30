let title;
let results;
let input;
let token;
let isSelected;
let addressContainer;
let suggestedPlaces = [];
document.getElementById("register-form").requestSubmit();
function handleSubmit(e) {
    // validate is input value  one of suggested places
    let isIncludes = suggestedPlaces.some((place) => place === input.value);
    if (!isIncludes) {
        p.innerText = "The address needs to be selected from the list.";
        p.style.color = "red";
        p.style.fontSize = "0.8rem";
        p.style.marginTop = "0.5rem";
        addressContainer.appendChild(p);
        return;
    }

    // const email = document.getElementById("email").value;
    // const password = document.getElementById("password").value;
    // const confirmPassword =
    //     document.getElementById("confirmPassword").value;
    // if (password !== confirmPassword) {
    //     alert("Passwords do not match");
    // } else {
    //     fetch("https://reqres.in/api/register", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             email,
    //             password
    //         })
    //     })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             if (data.error) {
    //                 alert(data.error);
    //             } else {
    //                 alert("User registered successfully");
    //             }
    //         });
    // }
}

let request = {
    input: "",
    locationRestriction: {
        west: -122.44,
        north: 37.8,
        east: -122.39,
        south: 37.78
    },
    origin: { lat: 37.7893, lng: -122.4039 },
    includedPrimaryTypes: ["restaurant"],
    language: "en-US",
    region: "us"
};

async function init() {
    token = new google.maps.places.AutocompleteSessionToken();
    title = document.getElementById("address-title");
    results = document.getElementById("address-results");
    input = document.getElementById("business-address");
    addressContainer = document.getElementById("address-container");
    input.addEventListener("input", makeAcRequest);
    request = refreshToken(request);
}

async function makeAcRequest(input) {
    if (input.target.value == "") {
        title.innerText = "";
        results.replaceChildren();
        return;
    }
    results.style.display = "block";
    request.input = input.target.value;

    const { suggestions } =
        await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
            request
        );

    results.replaceChildren();

    for (const suggestion of suggestions) {
        const placePrediction = suggestion.placePrediction;

        suggestedPlaces.push(placePrediction.text.toString());
        const a = document.createElement("a");
        const li = document.createElement("li");
        li.addEventListener("click", () => {
            onPlaceSelected(placePrediction.text.toString());
        });
        a.innerText = placePrediction.text.toString();
        li.appendChild(a);
        results.appendChild(li);
    }
}

async function onPlaceSelected(place) {
    // await place.fetchFields({
    //     fields: ["displayName", "formattedAddress"]
    // });

    input.value = place;
    results.style.display = "none";
    isSelected = true;

    addressContainer.innerHTML = "";
    results.innerHTML = "";

    refreshToken(request);
}

async function refreshToken(request) {
    token = new google.maps.places.AutocompleteSessionToken();
    request.sessionToken = token;
    return request;
}
input = document.getElementById("business-address");
async function handleInputBlur() {
    setTimeout(function () {
        let isIncludes = suggestedPlaces.some((place) => place === input.value);

        if (!isSelected && !isIncludes) {
            if (addressContainer.children.length > 0) return;
            const p = document.createElement("p");
            p.innerText = "The address needs to be selected from the list.";
            p.style.color = "red";
            p.style.fontSize = "0.8rem";
            p.style.marginTop = "0.5rem";
            addressContainer.appendChild(p);
            isSelected = false;
            return;
        } else {
            addressContainer.innerHTML = "";
            isSelected = false;
        }
    }, 100);
}

input.addEventListener("blur", handleInputBlur);
window.init = init;

document
    .getElementById("register-form")
    .addEventListener("submit", function (event) {
        if (!document.getElementById("cookieConsent").checked) {
            alert("You must accept the use of cookies to submit the form.");
            event.preventDefault();
        }
    });
