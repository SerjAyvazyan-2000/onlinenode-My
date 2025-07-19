"use client";

import React from "react";
import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline";
// Подключаем хук для переводов
import { useTranslations } from "use-intl";
import Container from "../components/container";

export default function Landing() {
  // Хук переводов
  const t = useTranslations();

  // Массив фич, где название и описание берем из словаря
  const features = [
    {
      name: t("HOME_CARD1_TITLE"),
      description: t("HOME_CARD1_TEXT"),
      icon: CloudArrowUpIcon
    },
    {
      name: t("HOME_CARD2_TITLE"),
      description: t("HOME_CARD2_TEXT"),
      icon: LockClosedIcon
    },
    {
      name: t("HOME_CARD3_TITLE"),
      description: t("HOME_CARD3_TEXT"),
      icon: ArrowPathIcon
    },
    {
      name: t("HOME_CARD4_TITLE"),
      description: t("HOME_CARD4_TEXT"),
      icon: FingerPrintIcon
    }
  ];

  return <>

    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          {/* Основной заголовок c переносом строки */}
          <p
            className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
            {t("HOME_HERO_TITLE_LINE1")} <br />
            {t("HOME_HERO_TITLE_LINE2")}
          </p>

          {/* Подзаголовок */}
          <p className="mt-6 text-lg/8 text-gray-600">
            {t("HOME_HERO_SUBTITLE")}
          </p>
        </div>

        <div className="mx-auto pt-6 mt-28 max-w-2xl sm:mt-28 lg:mt-28 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (

              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div
                    className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>

    <section className=" relative z-[2]">
      <div className="absolute w-full top-[0] left-0 z-[-1] ">
        <img className='w-full' src="/lines-big.png" alt="" />
      </div>
      <Container>


        <div className="pt-5 text-center font-medium text-[80px] leading-[80px] font-[Stem]">
          <span className="bg-gradient-to-r from-[#2A86FF] via-[#003172] to-[#7D34D7] bg-clip-text text-transparent">Deflation Coin</span><br />
          криптовалютная<br />
          революция
        </div>

        <div
          className="flex items-center justify-center gap-5 mt-20 mx-auto w-[248px] h-[70px] rounded-full border-2 border-black cursor-pointer transition-all duration-500 hover:bg-black hover:text-white group">
          <div className="font-[Stem] font-medium text-[20px]">Видеообзор</div>
          <div
            className="w-[27.55px] h-[28.28px] bg-[url('/assets/img/arrow.png')] bg-no-repeat bg-[length:28.28px_27.55px] group-hover:bg-[url('/assets/img/arrow-white.png')] transition-all duration-500" />
        </div>

        <div id="videoModal"
             className="hidden fixed z-10 left-0 top-0 w-full h-full overflow-auto bg-black bg-opacity-40">
          <div
            className="bg-black p-0 flex flex-col justify-center items-end rounded-[30px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="hidden rutube-container w-[1024px] h-[576px]">
              <iframe
                id="video-player"
                width="100%"
                height="100%"
                className="rounded-[30px]"
                allow="clipboard-write; autoplay"
                src="https://rutube.ru/play/embed/4f1b51992200261042cd787cf7370520/"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
            <div className="hidden youtube-container w-[1024px] h-[576px]">
              <iframe
                id="youtube-player"
                width="100%"
                height="100%"
                className="rounded-[30px]"
                src="https://www.youtube.com/embed/ufgLfVn7re0?si=xLiFbr6NSUGheFpl&enablejsapi=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        <div
          className="w-full mt-40 mx-auto rounded-[30px] px-[120px] py-[60px] bg-gradient-to-r from-[#2A86FF] via-[#003172] to-[#7D34D7] shadow-[0_-4px_40px_0_rgba(224,224,224,0.5)] font-[Stem] font-normal text-[30px] leading-[50px] text-white z-[1000] max-w-[1520px]">
          <strong className="font-bold">Deflation Coin</strong> – первая валюта с алгоритмической обратной инфляцией,
          функционирующая в глобальной диверсифицированной экосистеме, способной заинтересовать миллионы пользователей
          за пределами крипто-индустрии
        </div>
      </Container>

    </section>

  </>;
}




