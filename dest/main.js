/////////////////////////// SCROLL ///////////////////////////////
$(document).ready(function () {
  let header = $(".header"),
    screen = {
      mobile: 992,
      tablet: 1024,
      desktop: 1199,
    },
    locoScroll;

  //DETECT DEVICE
  let md = new MobileDetect(window.navigator.userAgent);
  function mobileDetect() {
    if (md.mobile() != null || md.tablet() != null) {
      mobile = true;
      tablet = true;
    } else {
      mobile = false;
      tablet = false;
    }
  }
  mobileDetect();

  // SCROLL SMOOTH

  function scrollSmooth() {
    if (!document.querySelector(".scrollmain")) return;
    locoScroll = new LocomotiveScroll({
      el: document.querySelector(".scrollmain"),
      smooth: true,
      lerp: 0.12,
      getSpeed: true,
      getDirection: true,
      reloadOnContextChange: true,
      resetNativeScroll: true,
      tablet: { smooth: false },
      smartphone: { smooth: false },
    });
  }
  scrollSmooth();

  // WINDOW RESIZE

  function setStorageDevice() {
    let windowsize = $(window).width();
    if (windowsize <= screen.mobile) {
      localStorage.setItem("device", "mobile");
    } else if (windowsize <= screen.tablet) {
      localStorage.setItem("device", "tablet");
    } else {
      localStorage.setItem("device", "desktop");
    }
  }
  setStorageDevice();

  function reloadOnResize() {
    let windowsize = $(window).width(),
      divice = localStorage.getItem("device");
    if (windowsize <= screen.mobile && divice != "mobile") {
      location.reload();
      setStorageDevice();
    } else if (
      windowsize <= screen.tablet &&
      windowsize > screen.mobile &&
      divice != "tablet"
    ) {
      location.reload();
      setStorageDevice();
    } else if (windowsize > screen.tablet && divice != "desktop") {
      location.reload();
      setStorageDevice();
    }
  }

  // HANDLE SCROLL HEADER BACKGROUND
  function handleHeaderScroll() {
    let scrollY = $(window).scrollTop();
    if (scrollY > header.height()) {
      header.addClass("--bg-scroll");
    } else {
      header.removeClass("--bg-scroll");
    }

    locoScroll?.on("scroll", (args) => {
      let scrollY = args.scroll.y;
      if (scrollY > header.height()) {
        header.addClass("--bg-scroll");
      } else {
        header.removeClass("--bg-scroll");
      }
    });
  }
  handleHeaderScroll();

  // HANDLE MOBILE MENU
  function handleMobileMenu() {
    const menuBtn = $(".header__menu-btn");
    const mobileNav = $(".header__mobile-nav");

    menuBtn.on("click", function () {
      $(this).toggleClass("active");
      mobileNav.toggleClass("active");
      $("body").toggleClass("menu-open");
    });
  }
  handleMobileMenu();

  // CHANGE BACKGROUND HEADER SCROLLING
  $(window).on("scroll", function () {
    handleHeaderScroll();
  });

  // NAVIGATOR
  let tlNav = new gsap.timeline({ pause: true });
  function handleShowMenu() {
    let stagger1 = $(".--stagger1"),
      stagger2 = $(".--stagger2");
    tlNav.staggerFrom([stagger1, stagger2], 0.7, {
      y: 60,
      autoAlpha: 0,
      stagger: 0.1,
      delay: 0.4,
    });
    tlNav.reverse();
  }
  handleShowMenu();

  function clickBtnMenu() {
    let btnMenu = $(".header__btnmenu"),
      nav = $(".nav");
    btnMenu.on("click", function () {
      $(this).toggleClass("active");
      nav.toggleClass("active");
      tlNav.reversed()
        ? tlNav.timeScale(1.1).restart()
        : tlNav.timeScale(2.5).reverse();
    });
  }
  clickBtnMenu();

  // CLICK SUBMENU
  function clickSubMenu() {
    $(document).on(
      "click",
      "body.servicepage .nav ul li ul li a",
      function (e) {
        e.preventDefault();
        window.location.href = $(this).attr("href");
        window.location.reload();
      }
    );
  }
  clickSubMenu();

  // TV+ Slider
  function tvSlider() {
    if ($(".tv-slider__wrapper").length) {
      let $slider = $(".tv-slider__wrapper"),
        $sliderParent = $slider.parent(),
        opt = {
          autoPlay: 3000,
          cellAlign: "center",
          dragThreshold: 0,
          prevNextButtons: false,
          wrapAround: true,
          pageDots: false,
          selectedAttraction: 0.008,
          friction: 0.168,
          lazyLoad: 2, // Enable lazy loading for 2 images ahead/behind
        };

      // Destroy existing instance if it exists
      if ($slider.hasClass("flickity-enabled")) {
        $slider.flickity("destroy");
      }

      $slider.flickity(opt);

      // --- PAUSE/PLAY BUTTON FUNCTIONALITY ---
      var flkty = $slider.data("flickity");
      var isPaused = false;
      var $pauseBtn = $(".pause-button");
      var $pauseImg = $pauseBtn.find(".pause-button__img");
      $pauseBtn
        .off("click.tvSliderPause")
        .on("click.tvSliderPause", function () {
          if (!isPaused) {
            flkty.options.autoPlay = false;
            flkty.stopPlayer();
            $pauseImg.attr("src", "img/play-icon.svg").attr("alt", "Play");
            isPaused = true;
          } else {
            flkty.options.autoPlay = 3000;
            flkty.playPlayer();
            $pauseImg.attr("src", "img/pause-icon.svg").attr("alt", "Pause");
            isPaused = false;
          }
        });

      // Navigation dots
      let $dots = $(".tv-slider__dot");

      // Update dots click functionality
      $dots.off("click").on("click", function () {
        let index = $(this).index();
        $slider.flickity("select", index);
      });

      // Allow clicking on a tv-slider__item to activate it
      $(document)
        .off("click.tvSliderItem")
        .on("click.tvSliderItem", ".tv-slider__item", function () {
          var index = $(this).index();
          $slider.flickity("select", index);
        });

      // Track previous index for animation
      let prevIndex = 0;

      // Update change event
      $slider
        .off("change.flickity")
        .on("change.flickity", function (event, index) {
          $dots.removeClass("active");
          $dots.eq(index).addClass("active");

          // Animate only the outgoing slide's content opacity to 0 and move up
          let $prevSlide = $(".tv-slider__item").eq(prevIndex),
            $prevContent = $prevSlide.find(".tv-slider__content");
          gsap.to($prevContent, {
            opacity: 0,
            y: -30,
            duration: 0.4, // slower
            ease: "cubic-bezier(.77,0,.18,1)",
          });

          prevIndex = index;
        });

      // Update select event
      $slider.off("select.flickity").on("select.flickity", function () {
        let $selectedSlide = $(".tv-slider__item.is-selected"),
          $content = $selectedSlide.find(".tv-slider__content");

        gsap.fromTo(
          $content,
          {
            y: 60,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8, // slower
            ease: "cubic-bezier(.77,0,.18,1)",
          }
        );
      });

      // Force refresh after initialization
      setTimeout(function () {
        $slider.flickity("resize");
      }, 100);

      // Get Flickity instance
      var flkty = $slider.data("flickity");

      // Real-time opacity transition on drag
      $slider.off("dragMove.flickity").on("dragMove.flickity", function () {
        var slides = flkty.slides;
        var viewportWidth = flkty.size.width;
        slides.forEach(function (slide) {
          var slideElem = slide.cells[0].element;
          var $content = $(slideElem).find(".tv-slider__content");
          var slideOffset = slide.target - flkty.x;
          var opacity = 1 - Math.abs(slideOffset / viewportWidth);
          opacity = Math.max(0, Math.min(1, opacity));
          $content.css("opacity", opacity);
        });
      });
    }
  }

  function setHeightAutoServieItems() {
    if ($(".servicepage").length) {
      $(".service__item").css({
        height: "auto",
      });
    }
  }

  // SCROLL TO SERVICE
  function scrollToService() {
    if ($(".servicepage").length) {
      let hash = window.location.hash;
      if (hash !== "") {
        setTimeout(() => {
          locoScroll.scrollTo(hash, {
            offset: -100,
            duration: 100,
          });
        }, 200);
      }
    }
  }

  // BACK TO TOP
  function backToTop() {
    const btn = $(".backtotop");
    if (!btn.length) return;
    btn.on("click", function () {
      locoScroll.scrollTo(0);
    });
  }

  $(window).resize(function () {
    setTimeout(function () {
      reloadOnResize();
      locoScroll.update();
    }, 200);
    setTimeout(function () {
      locoScroll.update();
    }, 300);
  });

  // INTRO
  let tlIntro = new gsap.timeline({ delay: 0.5 });
  function introATC() {
    let intro = $(".introloading"),
      logoIntro = $(".introloading .introloading__logo");
    tlIntro
      .to(logoIntro, 0.8, { autoAlpha: 1 })
      .to(logoIntro, 0.5, { autoAlpha: 0, delay: 1.5 })
      .to(intro, 0.2, { autoAlpha: 0 });
    tlIntro.play();
  }

  // Improved seamless infinite scroll for media-slider-section using GSAP
  function autoScrollMediaSlider() {
    const wrapper = document.querySelector(".media-slider-wrapper");
    if (!wrapper) return;

    // Only duplicate once
    if (!wrapper.dataset.duplicated) {
      const items = Array.from(wrapper.children);
      items.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.classList.add("media-slider-item--clone");
        wrapper.appendChild(clone);
      });
      wrapper.dataset.duplicated = "true";
    }

    // Calculate the width of the original content (not including clones)
    const items = Array.from(wrapper.children).slice(
      0,
      wrapper.children.length / 2
    );
    const originalContentWidth = items.reduce(
      (acc, el) =>
        acc + el.offsetWidth + parseInt(getComputedStyle(el).marginRight || 0),
      0
    );

    let x = 0;
    let speed = 1; // px per frame
    const normalSpeed = 1;
    const slowSpeed = 0.5;

    // Add hover event listeners to slow down on hover
    wrapper.addEventListener("mouseover", function (e) {
      if (e.target.closest(".media-slider-item")) {
        speed = slowSpeed;
      }
    });
    wrapper.addEventListener("mouseout", function (e) {
      if (e.target.closest(".media-slider-item")) {
        speed = normalSpeed;
      }
    });

    function animate() {
      x -= speed;
      // When the first set is fully out of view, reset instantly (no jump)
      if (Math.abs(x) >= originalContentWidth) {
        x += originalContentWidth;
      }
      gsap.set(wrapper, { x });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // --- MODAL VIDEO FUNCTIONALITY ---
  function modalVideoInit() {
    var $modal = $("#modal-video");
    var $openBtn = $(
      ".btn.btn-white:contains('Watch the film'), .btn.btn-primary:contains('Play now')"
    );
    var $closeBtn = $modal.find(".modal-video__close");
    var $overlay = $modal.find(".modal-video__overlay");
    var $video = $modal.find(".modal-video__player");

    $openBtn.on("click", function (e) {
      e.preventDefault();
      $modal.addClass("is-active");
      $video[0].currentTime = 0;
      $video[0].play();
    });
    function closeModal() {
      $modal.removeClass("is-active");
      setTimeout(function () {
        $video[0].pause();
      }, 400); // Wait for fadeout
    }
    $closeBtn.on("click", closeModal);
    $overlay.on("click", closeModal);
    $(document).on("keydown", function (e) {
      if ($modal.hasClass("is-active") && e.key === "Escape") closeModal();
    });
  }

  // INIT
  function init() {
    $("body")
      .imagesLoaded()
      .progress({ background: true }, function (instance, image) {})
      .always(function (instance) {
        tvSlider();
        scrollToService();
        backToTop();
        autoScrollMediaSlider();
        locoScroll.update();
        introATC();
        modalVideoInit();
      })
      .fail(function () {
        // console.log('all images loaded, at least one is broken');
      })
      .done(function (instance) {
        // console.log('all images successfully loaded');
      });
  }
  init();
});
