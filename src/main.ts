export let main = () => {
    let message: string = "Hello world, from TypeScript :)";
    console.log(message);

    let mobileNav = window.document.getElementById("mobileNav");
    let openButton = window.document.getElementById("openButton");
    let closeButton = window.document.getElementById("closeButton");

    openButton.addEventListener('click', function () {
        mobileNav.style.width = "100%";
    });    
    
    closeButton.addEventListener('click', function () {
        mobileNav.style.width = "0%";
    });
};

window.addEventListener("load", main);
