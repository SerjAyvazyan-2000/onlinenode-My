"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import Link from "next/link";
import BlockTitle from "./blockTitle";
import BlockText from "./blockText";
import BorderButton from "./borderButton";

export default function LegalSlider() {
  const legalCards = [
    {
      title: "Company Official Licence",
      text: "Компания имеет официальную лицензию, входит в реестр ИТ компаний Сингапура",
      link: "https://defcoin.app/ru/company",
    },
    {
      title: "Smart Contract Audit & KYC",
      text: "Официальный аудит смарт-контракта от SolidProof и верификация основателей процедурой KYC.",
      link: "https://app.solidproof.io/projects/deflation-coin",
    },
    {
      title: "Binance Smart Chain Verification",
      text: "Смарт-контракт успешно прошел проверку и верификацию в сети Binance Smart Chain",
      link: "https://bscscan.com/token/0xb0869a6727b513d9160caaee446d7cd97ecfbb07",
    },
    {
      title: "Github Code Published",
      text: "Код проекта былопубликован на площадке Github",
      link: "https://github.com/deflation-coin/contract",
    },

    {
      title: "Binance Smart Chain Verification",
      text: "Смарт-контракт успешно прошел проверку и верификацию в сети Binance Smart Chain",
      link: "https://bscscan.com/token/0xb0869a6727b513d9160caaee446d7cd97ecfbb07",
    },
    {
      title: "Github Code Published",
      text: "Код проекта былопубликован на площадке Github",
      link: "https://github.com/deflation-coin/contract",
    },
  ];

  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={3.2}
        breakpoints={{
          320: { slidesPerView: 1.5 ,spaceBetween:10},
          700: { slidesPerView: 1.5, spaceBetween:10} ,
          900: { slidesPerView: 2 },
          1100: { slidesPerView: 2.5 },
          1300: { slidesPerView: 3 },
          1400: { slidesPerView: 3.3 },
        }}
        className="w-full"
      >
        {legalCards.map((card, index) => (
          <SwiperSlide key={index}>
            <Link
              target="_blank"
              href={card.link}
              className={`h-full relative z-[3] min-h-[400px] md:min-h-[600px] rounded-[30px] p-[30px] md:p-[60px] flex flex-col justify-between group`}
            >
              <div className="absolute  rounded-[30px] inset-0 z-0 bg-[linear-gradient(344.69deg,_#000000_22.16%,_#293651_78.78%)] transition-opacity duration-500 opacity-100 group-hover:opacity-0"></div>

              <div className="absolute rounded-[30px] inset-0 z-0 bg-[linear-gradient(140.82deg,_#2A86FF_3.2%,_#003172_47.46%,_#7D34D7_91.71%)] transition-opacity duration-500 opacity-0 group-hover:opacity-100"></div>
              <div className="relative z-[2] ">
                <BlockTitle className="text-white mt-0">{card.title}</BlockTitle>

                <BlockText className="text-white mt-[40px]">
                  {card.text}
                </BlockText>
              </div>

              <button className="relative z-[2] mt-auto w-fit border-2 border-white text-white px-[30px] md:px-[40px] py-[15px] md:py-[22px] rounded-full text-[16px] md:text-[20px] rounded-[60px] font-medium transition hover:bg-white hover:text-black">
                Перейти
              </button>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
