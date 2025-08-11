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

  // HOMEPAGE
  function sliderHero() {
    if ($(".scherohome .slider__inner").length) {
      let $slider = $(".scherohome .slider__inner"),
        $sliderParent = $slider.parent(),
        opt = {
          cellAlign: "center",
          initialIndex: 2,
          pageDots: true,
          autoPlay: false,
          draggable: ">1",
          pauseAutoPlayOnHover: false,
          dragThreshold: 0,
          prevNextButtons: false,
          selectedAttraction: 0.008,
          friction: 0.168,
          wrapAround: true,
          // autoPlay: 4500,
        };
      $slider.flickity(opt);

      // parallax
      var flkty = $slider.data("flickity");
      var $imgs = $(".scherohome .slider__inner .slide img");

      $slider.on("scroll.flickity", function (event, progress) {
        flkty.slides.forEach(function (slide, i) {
          var img = $imgs[i];
          var x = ((slide.target + flkty.x) * -1) / 1.5;
          img.style.transform = "translateX( " + x + "px)";
        });
      });

      // previous | next
      let $prevBtn = $(".btncontrols.--prev", $sliderParent),
        $nextBtn = $(".btncontrols.--next", $sliderParent);
      $prevBtn.on("click", function () {
        $slider.flickity("previous", true);
      });
      $nextBtn.on("click", function () {
        $slider.flickity("next", true);
      });
    }
  }

  // TV+ Slider
  function tvSlider() {
    if ($(".tv-slider__wrapper").length) {
      let $slider = $(".tv-slider__wrapper"),
        $sliderParent = $slider.parent(),
        opt = {
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

  function sliderHeroProjectDetail() {
    if ($(".scprojectdetail .slider__inner").length) {
      let $slider = $(".scprojectdetail .slider__inner"),
        $sliderParent = $slider.parent();
      opt = {
        cellAlign: "center",
        pageDots: true,
        autoPlay: false,
        draggable: ">1",
        pauseAutoPlayOnHover: false,
        dragThreshold: 0,
        prevNextButtons: false,
        selectedAttraction: 0.008,
        friction: 0.168,
        fullscreen: true,
        wrapAround: true,
      };
      $slider.flickity(opt);

      // GET FULLSCREEN
      $slider.on("fullscreenChange.flickity", function (event, isFullscreen) {
        if (isFullscreen) {
          let $sliderFullscreen = $(".--afterFull .container");
          $sliderFullscreen.after("").appendTo(".sliderfullscreen");
        } else {
          let $sliderFullscreenAfter = $(".sliderfullscreen .container");
          $sliderFullscreenAfter.after("").appendTo(".--afterFull");
          $slider.flickity("resize");
        }
      });

      // previous | next
      let $prevBtn = $(".btncontrols.--prev", $sliderParent),
        $nextBtn = $(".btncontrols.--next", $sliderParent);
      $prevBtn.on("click", function () {
        $slider.flickity("previous", true);
      });
      $nextBtn.on("click", function () {
        $slider.flickity("next", true);
      });
    }
  }

  // HOVER SERVICES
  function hoverServices() {
    let item = $(".scserviceshome__list .item"),
      itemContent = $(".scserviceshome__content .content");
    item.hover(
      function () {
        let index = $(this).index();
        $(this).removeClass("--dim").siblings().addClass("--dim");
        itemContent
          .eq(index)
          .addClass("active")
          .siblings()
          .removeClass("active");
      },
      function () {
        item.removeClass("--dim");
        itemContent.eq(1).addClass("active").siblings().removeClass("active");
      }
    );
  }
  hoverServices();

  // SET HEIGHT SERVICE ITEMS
  function setHeightServieItems() {
    if ($(".servicepage").length) {
      let serviceItems = $(".service__item");
      setTimeout(() => {
        serviceItems.each(function (i, item) {
          let h = $(item).outerHeight();
          $(item).css({
            height: h + "px",
          });
        });
      }, 200);
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

  // SLIDER SERVICES MOBILE
  function sliderProjectsMobile() {
    if (
      $(".scserviceshome__list").length &&
      $(window).width() <= screen.mobile
    ) {
      let $slider = $(".scserviceshome__list"),
        itemContent = $(".scserviceshome__content .content"),
        opt = {
          cellAlign: "center",
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
      $slider.flickity("select", 1);
    }
  }

  // SLIDER PROJECTS
  function sliderProjects() {
    if ($(".scprojects__slider").length) {
      let $slider = $(".scprojects__slider"),
        $sliderParent = $slider.parent(),
        opt = {
          cellAlign: "center",
          dragThreshold: 0,
          prevNextButtons: false,
          imagesLoaded: true,
          lazyLoad: 4,
          wrapAround: true,
          freeScroll: true,
          pageDots: false,
        };
      $slider.flickity(opt);

      // previous | next
      let $prevBtn = $(".btncontrols.--prev", $sliderParent),
        $nextBtn = $(".btncontrols.--next", $sliderParent);
      $prevBtn.on("click", function () {
        $slider.flickity("previous", true);
      });
      $nextBtn.on("click", function () {
        $slider.flickity("next", true);
      });
      $slider.on("change.flickity", function (slide, index) {});
    }
  }

  // SLIDER NEWS
  function sliderNews() {
    if ($(".scnews__slider").length) {
      let $slider = $(".scnews__slider"),
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
      let $prevBtn = $(".btncontrols.--prev", $sliderParent),
        $nextBtn = $(".btncontrols.--next", $sliderParent);
      $prevBtn.on("click", function () {
        $slider.flickity("previous", true);
      });
      $nextBtn.on("click", function () {
        $slider.flickity("next", true);
      });
      $slider.on("change.flickity", function (slide, index) {});
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
    setHeightAutoServieItems();
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
    let localStorageIntro = localStorage.getItem("intro"),
      intro = $(".introloading"),
      logoIntro = $(".introloading .introloading__logo");
    if (localStorageIntro != 1) {
      tlIntro
        .to(logoIntro, 0.8, { autoAlpha: 1 })
        .to(logoIntro, 0.5, { autoAlpha: 0, delay: 1.5 })
        .to(intro, 0.2, { autoAlpha: 0 });
      tlIntro.play();
      localStorage.setItem("intro", "1");
    } else {
      intro.addClass("--hide");
    }
  }

  function handleGallerySlider() {
    const slider = $(".scgallery__slider");
    if (!slider?.length) return;

    slider?.flickity({
      cellAlign: "center",
      pageDots: false,
      dragThreshold: 10,
      freeScroll: true,
      prevNextButtons: false,
      contain: true,
      selectedAttraction: 0.02,
      imagesLoaded: true,
      wrapAround: true,
    });
  }

  // IMAGE TRAIL EFFECT
  const body = document.body;

  // helper functions
  const MathUtils = {
    lerp: (a, b, n) => (1 - n) * a + n * b,
    distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
  };

  // get the mouse position
  const getMousePos = (ev) => {
    let posx = 0;
    let posy = 0;
    if (!ev) ev = window.event;
    if (ev.pageX || ev.pageY) {
      posx = ev.pageX;
      posy = ev.pageY;
    } else if (ev.clientX || ev.clientY) {
      posx = ev.clientX + body.scrollLeft + docEl.scrollLeft;
      posy = ev.clientY + body.scrollTop + docEl.scrollTop;
    }
    return { x: posx, y: posy };
  };

  let mousePos = (lastMousePos = cacheMousePos = { x: 0, y: 0 });

  // update the mouse position
  window.addEventListener("mousemove", (ev) => (mousePos = getMousePos(ev)));

  const getMouseDistance = () =>
    MathUtils.distance(mousePos.x, mousePos.y, lastMousePos.x, lastMousePos.y);

  class Image {
    constructor(el) {
      this.DOM = { el: el };
      this.defaultStyle = {
        scale: 1,
        x: 0,
        y: 0,
        opacity: 0,
      };
      this.getRect();
    }

    getRect() {
      this.rect = this.DOM.el.getBoundingClientRect();
    }
    isActive() {
      return gsap.isTweening(this.DOM.el) || this.DOM.el.style.opacity != 0;
    }
  }

  class ImageTrail {
    constructor() {
      this.DOM = { content: document.querySelector(".trailimg") };
      this.images = [];
      [...this.DOM.content.querySelectorAll("img")].forEach((img) =>
        this.images.push(new Image(img))
      );
      this.imagesTotal = this.images.length;
      this.imgPosition = 0;
      this.zIndexVal = 1;
      this.threshold = 100;
      requestAnimationFrame(() => this.render());
    }
    render() {
      let distance = getMouseDistance();
      cacheMousePos.x = MathUtils.lerp(
        cacheMousePos.x || mousePos.x,
        mousePos.x,
        0.1
      );
      cacheMousePos.y = MathUtils.lerp(
        cacheMousePos.y || mousePos.y,
        mousePos.y,
        0.1
      );

      if (distance > this.threshold) {
        this.showNextImage();

        ++this.zIndexVal;
        this.imgPosition =
          this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;

        lastMousePos = mousePos;
      }

      let isIdle = true;
      for (let img of this.images) {
        if (img.isActive()) {
          isIdle = false;
          break;
        }
      }
      if (isIdle && this.zIndexVal !== 1) {
        this.zIndexVal = 1;
      }

      requestAnimationFrame(() => this.render());
    }
    showNextImage() {
      const img = this.images[this.imgPosition];
      gsap.killTweensOf(img.DOM.el);

      new TimelineMax()
        .set(
          img.DOM.el,
          {
            startAt: { opacity: 0, scale: 1 },
            opacity: 1,
            scale: 1,
            zIndex: this.zIndexVal,
            x: cacheMousePos.x - img.rect.width / 2,
            y: cacheMousePos.y - img.rect.height / 2,
          },
          0
        )
        .to(
          img.DOM.el,
          0.9,
          {
            ease: Expo.easeOut,
            x: mousePos.x - img.rect.width / 2,
            y: mousePos.y - img.rect.height / 2,
          },
          0
        )
        .to(
          img.DOM.el,
          1,
          {
            ease: Power1.easeOut,
            opacity: 0,
          },
          0.4
        )
        .to(
          img.DOM.el,
          1,
          {
            ease: Quint.easeOut,
            scale: 0.2,
          },
          0.4
        );
    }
  }

  // preload images
  const preloadImages = () => {
    return new Promise((resolve, reject) => {
      imagesLoaded(document.querySelectorAll(".content__img"), resolve);
    });
  };

  preloadImages().then(() => {
    const $isTrail = document.querySelector(".trailimg");
    if ($isTrail) {
      new ImageTrail();
    }
  });

  // Improved seamless infinite scroll for media-slider-section using GSAP
  function autoScrollMediaSlider() {
    const wrapper = document.querySelector(".media-slider-wrapper");
    if (!wrapper) return;

    // Only duplicate once
    if (!wrapper.dataset.duplicated) {
      const items = Array.from(wrapper.children);
      items.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('media-slider-item--clone');
        wrapper.appendChild(clone);
      });
      wrapper.dataset.duplicated = 'true';
    }

    // Calculate the width of the original content (not including clones)
    const items = Array.from(wrapper.children).slice(0, wrapper.children.length / 2);
    const originalContentWidth = items.reduce((acc, el) => acc + el.offsetWidth + parseInt(getComputedStyle(el).marginRight || 0), 0);

    let x = 0;
    const speed = 1; // px per frame

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

  // INIT
  function init() {
    $("body")
      .imagesLoaded()
      .progress({ background: true }, function (instance, image) {})
      .always(function (instance) {
        sliderHero();
        tvSlider();
        setHeightServieItems();
        scrollToService();
        sliderHeroProjectDetail();
        sliderProjects();
        sliderProjectsMobile();
        sliderNews();
        backToTop();
        handleGallerySlider();
        autoScrollMediaSlider();
        locoScroll.update();
        introATC();
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
