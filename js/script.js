$(document).ready(function () {
    //=================== Маска номера телефона ============

    $("input[type='tel']").inputmask({
        mask: "+7 (999) 999-99-99",
        placeholder: "+7 (XXX) XXX-XX-XX",
        showMaskOnHover: false,
        showMaskOnFocus: true,
    });

    //=================== Подключение fancybox ============

    Fancybox.bind("[data-fancybox]", {
        // Your custom options
    });

    //=================== Появление хедера ============

    const header = $("header");

    $(window).on("scroll", function () {
        if ($(window).scrollTop() >= 300) {
            header.addClass("animated");
        } else {
            header.removeClass("animated");
        }

        if ($(window).scrollTop() >= $(window).height()) {
            header.css({ top: "0px" }).addClass("shown");
        } else {
            header.css({ top: -$(window).scrollTop() + "px" }).removeClass("shown");
        }
    });

    //=================== Кнопка в оффере ============

    function getTransformData($el) {
        const transform = $el.css("transform");

        if (transform === "none") {
            return { rotate: 0, scale: 1 };
        }

        const values = transform
            .match(/matrix\(([^)]+)\)/)[1]
            .split(", ")
            .map(parseFloat);

        const [a, b, c, d] = values;

        const scale = Math.sqrt(a * a + b * b);
        const radians = Math.atan2(b, a);
        const rotate = radians * (180 / Math.PI); // convert to degrees

        return { rotate, scale };
    }

    $(".offer__img a").hover(function (e) {
        const btn = $(this);
        const { rotate, scale } = getTransformData(btn);

        btn.css({ transform: `rotate(${rotate}deg) scale(${scale})`, animation: "none", rotate: "0deg", scale: "1" }).animate(
            {
                rotate: -rotate + "deg",
                scale: 1 + (1.04 - scale),
            },
            200,
            function () {
                btn.css({ transform: ``, rotate: "0deg", scale: "1.04" });
            }
        );
    });

    $(".offer__img a").on("mouseleave", function (e) {
        const btn = $(this);
        btn.css({ transform: "", animation: "" }).animate(
            {
                rotate: "0deg",
                scale: 1,
            },
            200
        );
    });

    //=================== Слайдер в оффере ============

    const offerSlider = new Swiper(".offer__slider", {
        loop: true,
        spaceBetween: 20,
        speed: 800,
        grabCursor: true,
        effect: "fade",
        fadeEffect: {
            crossFade: true,
        },
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".offer__pagination",
            clickable: true,
            renderBullet: function (index, className) {
                const slides = $(".offer__slide");
                const slide = slides.eq(index);
                return `<div class="${className}">
                            <strong>${index + 1}</strong>
                            <p>${slide.data("pagination-title").replace("\\n", "<br/>")}</p>
                        </div>`;
            },
        },

        on: {
            afterInit: function (swiper) {
                $(".offer__pagination .swiper-pagination-bullet").eq(0).removeClass("swiper-pagination-bullet-active").addClass("initial");

                setTimeout(function () {
                    $(".offer__pagination .swiper-pagination-bullet").eq(0).removeClass("initial");
                }, 6000);
            },
        },
    });

    //=================== Слайдер блока О нас ============

    const aboutThumbsSlider = new Swiper(".about__thumbs-slider", {
        loop: true,
        slidesPerView: 4,
        spaceBetween: 16,
        freeMode: false,
        watchSlidesProgress: true,
    });
    const aboutSlider = new Swiper(".about__slider", {
        loop: true,
        slidesPerView: 1,
        effect: "fade",
        fadeEffect: {
            crossFade: true,
        },
        thumbs: {
            swiper: aboutThumbsSlider,
        },
        navigation: {
            nextEl: ".about__slider-next",
            prevEl: ".about__slider-prev",
        },
    });

    $(".about__slider").matchHeight({
        byRow: true,
        property: "height",
        target: $(".about__description"),
        remove: false,
    });

    //=================== Слайдер тренеров ============

    const trainersSlider = new Swiper(".trainers__slider", {
        loop: true,
        speed: 600,
        grabCursor: true,
        slidesPerView: "auto",
        navigation: {
            nextEl: ".trainers__slider-next",
            prevEl: ".trainers__slider-prev",
        },
    });

    //=================== Слайдер отзывов ============

    const reviewsSlider = new Swiper(".reviews__slider", {
        loop: true,
        speed: 600,
        grabCursor: true,
        slidesPerView: "auto",
        navigation: {
            nextEl: ".reviews__slider-next",
            prevEl: ".reviews__slider-prev",
        },
    });

    // Обработка кастомного инпута молитики конфиденциальности

    $(".check-label").on("click", function () {
        let isChecked = $(this).children("input").prop("checked");
        if (isChecked) {
            $(this).find(".fakecheck").addClass("checked");
        } else {
            $(this).find(".fakecheck").removeClass("checked");
        }
    });

    // Обработка кастомного селекта
    function initCustomSelect(jqSelector) {
        $(jqSelector).each(function () {
            const select = $(this).hide();
            const wrap = select.closest(".custom-select");
            const selected = wrap.find(".custom-select-input");
            const options = wrap.find(".custom-select-options");

            select.find("option").each(function (i) {
                const opt = $('<li class="custom-option"></li>').text($(this).text()).attr("data-value", $(this).val());

                opt.on("click", () => {
                    select.prop("selectedIndex", i).trigger("change");
                    selected.find("span").text($(this).text());
                    wrap.removeClass("initial").removeClass("active");
                    options.slideUp(200).find(".custom-option").removeClass("selected");
                    opt.addClass("selected");
                });

                options.append(opt);
            });

            selected.on("click", function () {
                wrap.toggleClass("active");
                options.slideToggle(200);
            });

            $(document).on("click", function (e) {
                if (!$(e.target).closest(wrap).length) {
                    wrap.removeClass("active");
                    options.slideUp(200);
                }
            });
        });
    }

    initCustomSelect(".custom-select select");

    //=================== Модальное окно ============

    function openModal(modal) {
        modal.addClass("active").attr("aria-hidden", "false");
        $("html").addClass("no-scroll");
    }

    function closeModal(modal) {
        modal.removeClass("active").attr("aria-hidden", "true");
        $("html").removeClass("no-scroll");
    }

    $("[data-modal-open]").on("click", function (e) {
        e.preventDefault();
        openModal($("#" + $(this).attr("data-modal-open")));
    });

    $(".modal__close, .modal__overlay").on("click", function (e) {
        e.preventDefault();
        closeModal($(this).closest(".modal"));
    });

    //=================== Клик на ESC ============
    $(document).on("keydown", function (event) {
        if (event.key === "Escape" || event.keyCode === 27) {
            closeModal($(".modal.active"));
        }
    });

    //=================== Temporary ============
    $("[data-trainer]").click(function (e) {
        e.preventDefault();
        $("#modal-1")
            .find("select#trainer")
            .val($(this).attr("data-trainer"))
            .closest(".custom-select")
            .find(".custom-option[data-value='" + $(this).attr("data-trainer") + "']")
            .click();
    });
});
