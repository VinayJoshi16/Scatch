setTimeout(() => {
    const flash = document.getElementById("flash-style");
    if(flash){
        flash.style.transition = "opacity 0.5s";
        flash.style.opacity = "0";
        setTimeout(() => flash.remove(), 500);
    }
}, 2000);

