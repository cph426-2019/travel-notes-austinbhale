let countNodes = (aNode) => {

    if (aNode.childNodes.length === 0) {
        return 1;
    } else {
        let count = 1;

        for (let i = 0; i < aNode.childNodes.length; i++) {
            count += countNodes(aNode.childNodes[i]);
        }
        return count;
    }
};

let main = () => {
    document.body.style.border = "1px solid red";

    document.body.childNodes[1].childNodes[1].innerText = "test";
    console.log(countNodes(document.body));

    let firstItem = document.querySelector(".first-item");
    firstItem.style.border = "solid black 3px";

    let lis = document.querySelectorAll("li");
    console.log(lis);

    let fourthNode = document.createElement("li");
    fourthNode.innerText = "Fourth";
    firstItem.parentElement.appendChild(fourthNode);
}

alert("hello");
window.addEventListener("load", main);