export let main = () => {
    let message: string = "Hello world, from TypeScript :)";
    console.log(message);

    let mobileNav = window.document.getElementById("mobileNav");
    let openButton = window.document.getElementById("openButton");

    openButton.addEventListener('click', function () {
        if (openButton.classList.contains("menu-click")) {
            openButton.classList.remove("menu-click");
            mobileNav.style.width = "0%";
        } else {
            openButton.classList.add("menu-click");
            mobileNav.style.width = "100%";
        }
    });
};

window.addEventListener("load", main);