document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".home-clients-track");

  if (!track) return;

  const imgs = track.querySelectorAll("img");
  let loaded = 0;

  function startAnimation() {
    track.style.animationPlayState = "running";
  }

  // Pause initially until images load
  track.style.animationPlayState = "paused";

  imgs.forEach(img => {
    if (img.complete) {
      if (++loaded === imgs.length) startAnimation();
    } else {
      img.addEventListener("load", () => {
        if (++loaded === imgs.length) startAnimation();
      });
    }
  });

  // Safety: start anyway after 1 second
  setTimeout(startAnimation, 1000);
});
