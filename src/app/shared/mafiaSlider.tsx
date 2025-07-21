"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRef, useState } from "react";

export default function MafiaSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef(null);

  const slides = [
    {
      title: "Mafia DeflationCoin",
      list: [
        "Выдающиеся гении со всей Солнечной системы.",
        "Миссия – создать криптовалюту, капитализация которой превзойдёт государственный долг США",
        "Серьёзная мафия, а не мальчики из PayPal Мафии.",
      ],
    },
    {
      title: "Следующий слайд",
      list: ["Новый пункт", "И ещё один", "И финальный"],
    },
    {
      title: "Следующий слайд 2",
      list: ["Новый пункт", "И ещё один", "И финальный"],
    },
  ];

  return (
    <div className="max-w-[1520] relative  w-full  flex flex-col justify-between">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".swiper-next",
          prevEl: ".swiper-prev",
        }}
        onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        pagination={{
          el: ".swiper-pagination",
          clickable: true,
        }}
        spaceBetween={30}
        slidesPerView={1}
        className="h-full  w-full  "
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="flex flex-col gap-[10px] md:gap-[30px] lg:flex-row">
              <div className="flex max-w-[100%] lg:max-w-[745px] w-full">
                <img
                  className="rounded-[30px] w-full object-cover"
                  src="/peopleAnonymous.png"
                  alt=""
                />
              </div>

              <div className="flex min-h-[508px] md:min-h-[600px] rounded-[30px] w-full max-w-[100%] lg:max-w-[745px] bg-[#EFF2FB] p-[30px] md:p-[60px] flex-col justify-between h-full">
                <div>
                  <div className="w-[60px] cursor-pointer  h-[60px] rounded-[100px] bg-white3 flex items-center justify-center">
                    <i className="icon icon-arrow text-[32px] bg-white"></i>
                  </div>
                  <h2 className="text-[24px] md:text-[36px] mt-[30px] leading-[50px] font-medium text-black mb-[30px]">
                    {slide.title}
                  </h2>
                  <ul className="flex flex-col gap-[0] pl-2 md:gap-[20px]">
                    {slide.list.map((text, index) => (
                      <li
                        key={index}
                        className="relative pl-4 text-[16px] md:text-[20px] text-gray font-[Stem] font-normal leading-[26px] md:leading-[40px] before:content-[''] 
                      before:absolute before:top-[17px] before:left-0 before:w-[4px] before:h-[4px] before:rounded-full before:bg-gray"
                      >
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex max-w-[300px] md:max-w-[625px]  w-full absolute right-[unset] left-[30px] md:left-[unset] md:right-[60px] bottom-[30px] md:bottom-[60px]  z-[2] items-center gap-[65px]">
        <div className="flex justify-start items-center gap-[20px] ">
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => swiperRef.current?.slideTo(index)}
              className={`w-[14px] cursor-pointer h-[14px] rounded-full transition-all duration-300 ${
                currentIndex === index ? "bg-black" : "bg-white3"
              }`}
            ></div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-4 ml-auto">
          <button className="swiper-prev w-[70px] md:w-[110px] h-[50px] md:h-[70px] group rounded-[60px] border-2 border-black flex items-center justify-center  hover:bg-black hover:text-white transition">
            <i className="icon icon-arrow transition rotate-[180deg] group-hover:bg-white text-[20px] md:text-[30px] bg-black"></i>
          </button>
          <button className="swiper-next w-[70px] md:w-[110px] h-[50px] md:h-[70px] group rounded-[60px] border-2 border-black flex items-center justify-center  hover:bg-black hover:text-white transition">
            <i className="icon icon-arrow transition group-hover:bg-white text-[20px] md:text-[30px] bg-black"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
