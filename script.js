const   body = document.querySelector('body'),
        toggle = body.querySelector('.sidebar-toggle'),
        sidebar = body.querySelector('.sidebar'), 
        purpleButton = body.querySelector('.purple-button'),
        logo = document.getElementById('logo-image');
        content = body.querySelector('.content');

// Toggle sidebar visibility
let isClosed = false;
sidebar.classList.toggle('close');
toggle.addEventListener('click', () => {
    sidebar.classList.toggle('close');
    isClosed = !isClosed;
    if(isClosed) {
        logo.src = "./assets/images/logo(no text).png";
        content.style.marginLeft = "80px";
    }
    else{
        logo.src = "./assets/images/logo.png";
        content.style.marginLeft = "250px";
    }
});

