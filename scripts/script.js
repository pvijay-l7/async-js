"use strict";

const content = document.querySelector(".list");
const a_tags = document.querySelectorAll("a")
const modal = document.querySelector(".modal");
const req = new XMLHttpRequest();
const crumbs = document.querySelector(".crumbs"); // The page numbers - could refactor it to be just crumbs and not a_tags and crumbs - but why

// TODO: check fixme's

// User template
const User = function (first_name, last_name, avatar, email) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.avatar = avatar;
    this.email = email;
    this.get_name = () => {
        return `${this.first_name} ${this.last_name}`
    }
}

// generate profiles
const create_html_elem = (user) => {
    return `
    <div class="profile">
            <p>${user.get_name()}</p>
            <p>${user.email}</p>
            <img src="${user.avatar}" alt="profile-image">
    </div>
    `
}

// FIXME: to dynamically generate crumbs
const generate_crumb = (page) => {
    return `<div class="crumb">
    <a href="" page=${page}>${page}</a>
</div>`
}

// load content handler
function reqListener() {
    // FIXME: crumb dynamic loading issue
    const pages = JSON.parse(this.responseText).total_pages;
    const req_data = JSON.parse(this.responseText).data;
    req_data.forEach((item) => {
        const { first_name, last_name, avatar, email } = item;
        const user = new User(first_name, last_name, avatar, email)
        content.insertAdjacentHTML("beforeend", create_html_elem(user))
    });


    // for (let i = 0; i < pages; i++) {
    //     crumbs.insertAdjacentText('beforeend', generate_crumb(i + 1));
    // }

}

// loading content based on page
const request_data = (page) => {
    req.addEventListener("load", reqListener);
    req.open("GET", `https://reqres.in/api/users?page=${page}`)

    req.send();
}

// FIXME: why no work? 
req.addEventListener("error", () => {
    console.log("hre");
})

// hiding error modal before dom loaded
window.onload = () => {
    modal.classList.add("hidden");
}

// to check if the network connection was lost after loading the page
window.addEventListener("DOMContentLoaded", () => {
    if (!navigator.onLine) {
        modal.style.visibility = "Visible";
        crumbs.classList.add("hidden");
    } else {
        a_tags[0].classList.add("selected");
        request_data(1);
        crumbs.classList.remove("hidden");
    }
})

// removing the error modal after the data has been loaded
req.addEventListener("loadend", () => {
    modal.classList.add("hidden");
})

// Event listeners

document.querySelector("#reload").addEventListener("click", () => {
    location.reload();
})

// load content change based on page

a_tags.forEach(crumb => {
    crumb.addEventListener("click", (e) => {
        e.preventDefault();

        // deleting previously loaded data
        content.innerHTML = "";

        // getting chosen page
        const page = crumb.getAttribute("page");

        for (let i = 0; i < a_tags.length; i++) {
            if (i + 1 == page) {
                console.log(page, i + 1, i);
                a_tags[i].classList.add("selected");
            } else {
                a_tags[i].classList.remove("selected");
            }
        }

        // loading data based on the page number
        request_data(page)

    })
})