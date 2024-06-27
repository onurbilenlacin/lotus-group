function handleSubmit() {
    console.log("asdasdasdasd");
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

let title;
let results;
let input;
let token;

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
    input.addEventListener("input", makeAcRequest);
    request = refreshToken(request);
}

async function makeAcRequest(input) {
    if (input.target.value == "") {
        title.innerText = "";
        results.replaceChildren();
        return;
    } else {
        results.style.display = "block";
    }

    request.input = input.target.value;

    const { suggestions } =
        await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
            request
        );

    results.replaceChildren();

    for (const suggestion of suggestions) {
        const placePrediction = suggestion.placePrediction;

        const a = document.createElement("a");
        const li = document.createElement("li");
        li.addEventListener("click", () => {
            onPlaceSelected(placePrediction.toPlace());
            results.style.display = "none";
        });
        a.innerText = placePrediction.text.toString();
        li.appendChild(a);
        results.appendChild(li);
    }
}

async function onPlaceSelected(place) {
    await place.fetchFields({
        fields: ["displayName", "formattedAddress"]
    });

    input.value = place.formattedAddress;
    refreshToken(request);
}

async function refreshToken(request) {
    token = new google.maps.places.AutocompleteSessionToken();
    request.sessionToken = token;
    return request;
}

window.init = init;
