document.addEventListener("DOMContentLoaded", function () {
  initMethodExplorer();
  initCopyBibtex();
  initLazyVideos();
});

function initCopyBibtex() {
  var copyBtn = document.getElementById("copy-bibtex");
  var bibtex = document.getElementById("bibtex-text");
  if (!copyBtn || !bibtex) return;
  copyBtn.addEventListener("click", function () {
    navigator.clipboard.writeText(bibtex.textContent).then(function () {
      copyBtn.textContent = "Copied";
      copyBtn.classList.add("copied");
      setTimeout(function () {
        copyBtn.textContent = "Copy";
        copyBtn.classList.remove("copied");
      }, 1600);
    });
  });
}

function initLazyVideos() {
  if (!("IntersectionObserver" in window)) return;
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting) video.play().catch(function () {});
        else video.pause();
      });
    },
    { rootMargin: "200px 0px" }
  );
  document.querySelectorAll("video").forEach(function (video) {
    observer.observe(video);
  });
}

function initMethodExplorer() {
  var caption = document.getElementById("method-caption");
  var hotspots = document.getElementById("method-hotspots");
  if (!caption || !hotspots) return;

  var fullView = [-6, 6, 408.74, 155.11];
  var fallback = {
    _1_input: [-4, 14, 66, 134],
    _2_layout: [66, 12, 156, 66],
    _2a_model: [66, 70, 220, 80],
    _3_upscaling: [228, 12, 56, 66],
    _5_rendering: [292, 12, 102, 66],
    _4_output: [278, 88, 124, 50]
  };
  var copy = {
    full: {
      title: "Full pipeline",
      text: "The frozen backbone never changes. Only the latents are optimized, then refined."
    },
    _1_input: {
      title: "Input",
      text: "A text prompt and coarse bounding boxes specify which objects should appear, where they sit, and how they move."
    },
    _2_layout: {
      title: "Layout generation",
      text: "A frozen text-to-video model synthesizes a coarse guide: low visual quality, high layout fidelity."
    },
    _2a_model: {
      title: "Latent optimization",
      text: "We optimize the noisy latents so selected cross-attention maps match the user boxes, via a KL layout loss."
    },
    _3_upscaling: {
      title: "Upscaling",
      text: "The guide can be upsampled spatially and/or temporally before the second diffusion pass."
    },
    _5_rendering: {
      title: "Video refinement",
      text: "The guide is injected at an early timestep. The same backbone (or LTX’s refiner) restores appearance while keeping the layout."
    },
    _4_output: {
      title: "Output",
      text: "The final video follows the specified composition and motion at the visual quality of the pretrained model."
    }
  };

  function setCaption(id) {
    var item = copy[id] || copy.full;
    caption.innerHTML = "<strong>" + item.title + ".</strong> " + item.text;
  }

  Object.keys(fallback).forEach(function (gid) {
    var box = fallback[gid];
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "method-hotspot";
    btn.setAttribute("aria-label", copy[gid].title);
    btn.style.left = ((box[0] - fullView[0]) / fullView[2]) * 100 + "%";
    btn.style.top = ((box[1] - fullView[1]) / fullView[3]) * 100 + "%";
    btn.style.width = (box[2] / fullView[2]) * 100 + "%";
    btn.style.height = (box[3] / fullView[3]) * 100 + "%";
    btn.addEventListener("mouseenter", function () {
      setCaption(gid);
    });
    btn.addEventListener("mouseleave", function () {
      setCaption("full");
    });
    btn.addEventListener("focus", function () {
      setCaption(gid);
    });
    btn.addEventListener("blur", function () {
      setCaption("full");
    });
    hotspots.appendChild(btn);
  });

  setCaption("full");
}
