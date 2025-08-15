/////////////////////////// SCROLL ///////////////////////////////
$(document).ready(function () {
  let header = $(".header"),
    subHeader = $(".sub-header"),
    screen = {
      mobile: 734,
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
      subHeader.addClass("--bg-scroll2");
    } else {
      header.removeClass("--bg-scroll");
      subHeader.removeClass("--bg-scroll2");
    }

    locoScroll?.on("scroll", (args) => {
      let scrollY = args.scroll.y;
      if (scrollY > header.height()) {
        header.addClass("--bg-scroll");
        subHeader.addClass("--bg-scroll");
      } else {
        header.removeClass("--bg-scroll");
        subHeader.removeClass("--bg-scroll");
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

  // Handle Search Overlay
  function handleSearchOverlay() {
    const searchBtn = $(".header__search-btn");
    const searchOverlay = $(".search-overlay");
    const searchContent = $(".search-overlay__content");
    const searchInput = $(".search-overlay__input");
    const searchBack = $(".search-overlay__back");

    function closeSearch() {
      searchOverlay.removeClass("active");
      $("body").removeClass("search-open");
    }

    searchBtn.on("click", function () {
      searchOverlay.addClass("active");
      searchInput.focus();
      $("body").addClass("search-open");
    });

    searchBack.on("click", function () {
      closeSearch();
    });

    // Close search on escape key
    $(document).on("keydown", function (e) {
      if (e.key === "Escape" && searchOverlay.hasClass("active")) {
        closeSearch();
      }
    });

    // Close search when clicking outside content
    searchOverlay.on("click", function (e) {
      if (
        !$(e.target).closest(searchContent).length &&
        !$(e.target).closest(searchBtn).length
      ) {
        closeSearch();
      }
    });

    // Prevent clicks inside content from closing
    searchContent.on("click", function (e) {
      e.stopPropagation();
    });
  }
  handleSearchOverlay();

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
    if ($(".tv-slider__wrapper").length && $(window).width() > screen.mobile) {
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
      let flkty = $slider.data("flickity");
      let isPaused = false;
      let $pauseBtn = $(".pause-button");
      let $pauseImg = $pauseBtn.find(".pause-button__img");
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
          let $prevSlide = $(".tv-slider__item").eq(prevIndex),
            $prevContent = $prevSlide.find(".tv-slider__content");
          gsap.to($prevContent, {
            opacity: 0,
            y: -30,
            duration: 0.4, // slower
            ease: "cubic-bezier(.77,0,.18,1)",
          });
          prevIndex = index;

          // Animate only the outgoing slide's content opacity to 0 and move up
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
    }
  }
  // TV+ Slider Mobile
  function tvSliderMobile() {
    if ($(".tv-slider__wrapper").length && $(window).width() <= screen.mobile) {
      let $slider = $(".tv-slider__wrapper"),
        itemContent = $(".tv-slider__content"),
        opt = {
          cellAlign: "center",
          autoPlay: 3000,
          dragThreshold: 0,
          prevNextButtons: false,
          wrapAround: true,
          pageDots: true,
          on: {
            change: function (index) {
              itemContent
                .eq(index)
                .addClass("active")
                .siblings()
                .removeClass("active");
            },
          },
        };
      $slider.flickity(opt);
      // Allow clicking on a tv-slider__item to activate it
      $(document)
        .off("click.tvSliderItem")
        .on("click.tvSliderItem", ".tv-slider__item", function () {
          var index = $(this).index();
          $slider.flickity("select", index);
        });
      // Pause/Play Button
      let flkty = $slider.data("flickity");
      let isPaused = false;
      let $pauseBtn = $(".pause-button");
      let $pauseImg = $pauseBtn.find(".pause-button__img").eq(0);
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

  function initAnimate() {
    // Set initial opacity:0 for all fade-section elements (for safety)
    document.querySelectorAll(".fade-section").forEach(function (section) {
      section.style.opacity = 0;
    });

    // Register ScrollTrigger
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // LocomotiveScroll + ScrollTrigger integration
    if (window.gsap && window.ScrollTrigger && locoScroll) {
      ScrollTrigger.scrollerProxy(".scrollmain", {
        scrollTop(value) {
          return arguments.length
            ? locoScroll.scrollTo(value, 0, 0)
            : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: document.querySelector(".scrollmain").style.transform
          ? "transform"
          : "fixed",
      });
      locoScroll.on("scroll", ScrollTrigger.update);
      ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }

    // FADE-IN ANIMATION FOR SECTIONS (with correct scroller)
    if (window.gsap && window.ScrollTrigger) {
      // General fade-in animation
      gsap.utils.toArray(".fade-section").forEach(function (section) {
        gsap.fromTo(
          section,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              scroller: ".scrollmain",
              start: "top 80%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      });
    }
  }

  // SLIDER IPHONE

  // SLIDER NEWS
  function sliderIphone() {
    if ($(".slider-iphone").length) {
      let $slider = $(".slider-iphone"),
        $sliderParent = $slider.parent(),
        opt = {
          cellAlign: "left",
          pageDots: false,
          pauseAutoPlayOnHover: true,
          dragThreshold: 10,
          freeScroll: true,
          prevNextButtons: false,
          contain: true,
          selectedAttraction: 0.02,
          imagesLoaded: true,
        };
      $slider.flickity(opt);

      // previous | next
      let $prevBtn = $(".slider-iphone__prev", $sliderParent),
        $nextBtn = $(".slider-iphone__next", $sliderParent);
      $prevBtn.on("click", function () {
        $slider.flickity("previous", true);
      });
      $nextBtn.on("click", function () {
        $slider.flickity("next", true);
      });
      $slider.on("change.flickity", function (slide, index) {});
    }
  }

  // INIT
  function init() {
    $("body")
      .imagesLoaded()
      .progress({ background: true }, function (instance, image) {})
      .always(function (instance) {
        tvSlider();
        tvSliderMobile();
        backToTop();
        autoScrollMediaSlider();
        introATC();
        modalVideoInit();
        locoScroll.update();
        initAnimate();
        sliderIphone();
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
