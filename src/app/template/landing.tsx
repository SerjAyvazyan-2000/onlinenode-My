"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
// Подключаем хук для переводов
import { useTranslations } from "use-intl";
import Container from "../shared/container";
import Title from "../shared/title";
import BorderButton from "../shared/borderButton";
import InfoGradientBlock from "../shared/infoGradientBlock";
import Link from "next/link";
import BlockTitle from "../shared/blockTitle";
import BlockText from "../shared/blockText";
import GradientCard from "../shared/gradientCard";
import { focusVisibleClasses } from "@heroui/theme";
import MafiaSlider from "../shared/mafiaSlider";
import LegalSlider from "../shared/legalSlider";
import GradientButton from "../shared/gradientButton";

export default function Landing() {
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const gradientCards = [
    { title: "Криптобиржа", iconClass: "icon-cryptoExchange" },
    { title: "Высокочастотный трейдинг", iconClass: "icon-chartArea" },
    {
      title: "Децентрализованная социальная сеть",
      iconClass: "icon-shareNodes",
    },
    { title: "Лицензированный гэмблинг", iconClass: "icon-diceFive" },
    { title: "Онлайн игры", iconClass: "icon-gamepadSolid" },
    { title: "Дэйтинг-сервис", iconClass: "icon-heartSolid" },
  ];

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 640);
    checkWidth();

    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return (
    <>
      <section className=" pt-[117px] md:pt-[275px] relative z-[2]">
        <div className="absolute w-full top-[230px] md:top-[360px]  left-0 z-background ">
          <img
            className="w-full  hidden md:block "
            src="/lines-big.png"
            alt=""
          />
          <img
            className="w-full h-[300px] block  md:hidden"
            src="/linesBigMobile.png"
            alt=""
          />
        </div>

        <div className="absolute w-full top-0 left-0 z-[-2] ">
          <img className="w-full hidden sm:flex" src="/heroDecor.webp" alt="" />
          <img className="w-full flex sm:hidden" src="/heroDecorMobile.png" alt="" />
        </div>

        <Container>
          <Title
            as="h1"
            fontSize="text-[36px] md:text-[80px]"
            lineHeight="leading-[40px] md:leading-[80px]"
            gradientText={t("HOME_HERO_TITLE_LINE1")}
            gradientStyle="linear-gradient(86.72deg, #2A86FF -4.4%, #003172 42.89%, #7D34D7 90.18%)"
            className="text-black"
          >
            {t("HOME_HERO_TITLE_LINE2")
              .split("\n")
              .map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
          </Title>

          <div className="flex items-center justify-center">
            <BorderButton
              onClick={() => setIsModalOpen(true)}
              iconClass="icon-arrow"
            >
              {t("BUTTON_REVIEW")}
            </BorderButton>
          </div>

          {isModalOpen && (
            <div
              onClick={() => setIsModalOpen(false)}
              className="fixed z-50 left-0 top-0 w-full  h-full overflow-auto bg-black bg-opacity-40"
            >
              <div className="bg-black p-0 max-w-[768px] w-full flex flex-col justify-center items-end rounded-[30px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className=" w-full h-[432px]">
                  <iframe
                    width="100%"
                    height="100%"
                    className="rounded-[30px]"
                    allow="clipboard-write; autoplay"
                    src="https://rutube.ru/play/embed/4f1b51992200261042cd787cf7370520/"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          )}

          <InfoGradientBlock>
            <span dangerouslySetInnerHTML={{ __html: t.raw("INFO_TEXT") }} />
          </InfoGradientBlock>
        </Container>
      </section>

      <section className=" mt-[60px] sm:mt-[160px]  relative z-[3]">
        <Container>
          <Title
            as="h2"
            fontSize="text-[30px] md:text-[60px]"
            lineHeight="leading-[34px] md:leading-[66px]"
            gradientText={" нового поколения"}
            gradientStyle="linear-gradient(321.94deg, #7D34D7 14.89%, #0054C2 55.74%, #001D42 96.6%)"
            className="text-black"
            reverse={true}
          >
            Инновационные механизмы
          </Title>

          <div className="flex flex-col-reverse lg:flex-row justify-center items-center gap-[20px] sm:gap-[30px] mt-[60px] md:mt-[120px]">
            <Link
              href="https://www.youtube.com/watch?v=ufgLfVn7re0&t=257s"
              target="_blank"
              className="w-full lg:w-1/2 max-w-[745px]   bg-wheat rounded-[30px] p-[30px] md:p-[80px]  no-underline"
            >
              <div className="flex">
                <img src="/arrow-in-block.png" alt="" />
              </div>

              <BlockTitle>
                <span className="block">Дефляционный халвинг</span> не как у
                Биткойна
              </BlockTitle>

              <BlockText>
                Халвинг Биткойна лишь снижает скорость добычи монет, но не
                уменьшает их количество в обращении. У него есть замедляющаяся
                инфляция, но нет дефляции. В DeflationCoin незастейканные монеты
                ежедневно сжигаются, причём объём сжигания удваивается с каждым
                днём.
              </BlockText>
            </Link>

            <div className="w-full lg:w-1/2  max-w-[745px] flex justify-center items-center">
              <img
                src="/innowise-first.png"
                alt="Дефляционный халвинг не как у Биткойна"
                className=" w-full max-w-[260px] h-[260px] sm:h-[470px] sm:max-w-[470px]"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse lg:flex-row-reverse justify-center items-center gap-[20px] sm:gap-[30px] mt-[10px] sm:mt-[120px]">
            <Link
              href="https://www.youtube.com/watch?v=ufgLfVn7re0&t=257s"
              target="_blank"
              className="w-full lg:w-1/2 max-w-[745px] bg-wheat rounded-[30px] p-[30px] md:p-[80px]  no-underline"
            >
              <div className="flex">
                <img src="/arrow-in-block.png" alt="" />
              </div>

              <BlockTitle>
                Смарт-стейкинг <span className="block">не как у Эфириума</span>
              </BlockTitle>

              <BlockText>
                В Ethereum и Solana награды стейкерам распределяются путём
                выпуска новых монет, что ведёт к инфляции и обесцениванию. В
                DeflationCoin выплаты стейкерам осуществляются за счёт доходов
                экосистемы и байбеков, а эмиссия монет строго ограничена, как у
                Биткойна.
              </BlockText>
            </Link>

            <div className="w-full lg:w-1/2  max-w-[745px] flex justify-center items-center">
              <img
                src="/innowise-second.png"
                alt="Смарт-стейкинг не как у Эфириума"
                className=" w-full max-w-[260px] h-[260px] sm:h-[470px] sm:max-w-[470px]"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="mt-[60px] sm:mt-[160px] relative z-[3]">
        <Container>
          <Title
            as="h2"
            fontSize="text-[30px] sm:text-[60px]"
            lineHeight="leading-[34px] sm:leading-[66px]"
            gradientText={isMobile ? "DeflationCoin" : "на базе DeflationCoin"}
            gradientStyle="linear-gradient(321.94deg, #7D34D7 14.89%, #0054C2 55.74%, #001D42 96.6%)"
            className="text-black max-w-[335px] sm:max-w-[100%] m-auto"
            reverse={true}
          >
            {isMobile ? (
              <>
                Цифровое государство
                <span className="block">на базе</span>
              </>
            ) : (
              "Цифровое государство"
            )}
          </Title>

          <div className="mt-[60px] sm:mt-[160px]  relative z-[3]">
            <div className="w-full min-h-[220px] sm:min-h-[500px] flex flex-col rounded-[30px] overflow-hidden relative z-[3] md:min-h-[1000px]">
              <video
                id="deflationVideo"
                className="w-full absolute left-0 top-0 h-full z-[-1] object-cover"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/video/video1.mp4" type="video/mp4" />
              </video>

              <div className="flex hidden md:flex flex-wrap p-[15px] justify-center items-center gap-[10px] relative z-[1] mt-auto">
                {gradientCards.map((item, index) => (
                  <GradientCard
                    key={index}
                    title={item.title}
                    iconClass={item.iconClass}
                  />
                ))}
              </div>
            </div>

            <div className="flex block md:hidden flex-wrap mt-[20px] items-center gap-[10px] relative z-[1] ">
              {gradientCards.map((item, index) => (
                <GradientCard
                  key={index}
                  title={item.title}
                  iconClass={item.iconClass}
                />
              ))}
            </div>
          </div>
        </Container>

        <div className="absolute w-full right-0 bottom-[-600px] sm:bottom-[unset] top-[unset] sm:top-[200px] max-w-[800px]  z-[-1]">
          <img className="w-full" src="/sectionDecor2.png" alt="" />
        </div>
      </section>

      <section className=" mt-[60px] sm:mt-[160px]  relative z-[3]">
        <Container>
          <Title
            as="h2"
            fontSize="text-[30px] sm:text-[60px]"
            lineHeight="leading-[34px] sm:leading-[66px]"
            gradientText={" в период падения"}
            gradientStyle="linear-gradient(321.94deg, #7D34D7 14.89%, #0054C2 55.74%, #001D42 96.6%)"
            className="text-black max-w-[335px] sm:max-w-[100%] m-auto"
            reverse={true}
          >
            <span className="block"> Отсутствие корреляции</span> с
            крипто-рынком
          </Title>

          <div className="flex gap-[10px] md:gap-[30px] mt-[40px]  sm:mt-[120px] flex-wrap items-start justify-center">
            <div className="flex w-full max-w-[845px]">
              <img className="hidden md:block" src="/post.png" alt="" />
              <img
                className="block md:hidden w-full"
                src="/postMobile.png"
                alt=""
              />
            </div>
            <div className="p-[30px]  md:p-[80px] min-h-[512px] md:min-h-[700px] max-w-[645px] rounded-[30px]  bg-[linear-gradient(344.69deg,_#000000_22.16%,_#293651_78.78%)]">
              <div className="w-[60px]  cursor-pointer ml-unset mb-[10px] md:mb-[0] md:ml-auto h-[60px] rounded-[100px] bg-blue flex items-center justify-center">
                <i className="icon icon-arrow text-[32px] bg-gray2"></i>
              </div>
              <BlockTitle className="text-white">
                Пока цена BTC падает, а ALTCOIN следуют за ним, DEF
                демонстрирует уникальность.
              </BlockTitle>
              <BlockText className="text-white mt-[40px]">
                При медвежьем рынке DeflationCoin не скоррелирован со всем
                рынком благодаря механизмам плавного разлока, смарт-стейкинга, а
                также байбэкам, которые увеличиваются с 20% до 80%,
              </BlockText>
            </div>

            <InfoGradientBlock>
              <strong>Миссия</strong> – обеспечить максимальный уровень
              безопасности инвесторам за счет инновационных механизмов,
              исключающих резкие падения цены, и создать «Цифровое государство»
              на базе DeflationCoin с диверсифицированной экосистемой,
              открывающей безграничный потенциал для роста инвестиций.
            </InfoGradientBlock>
          </div>
        </Container>
      </section>

      <section className=" mt-[60px] sm:mt-[160px]  relative z-[3]">
        <Container>
          <Title
            as="h2"
            fontSize="text-[30px] sm:text-[60px]"
            lineHeight="leading-[34px] sm:leading-[66px]"
            gradientText={"Громкий маркетинг"}
            gradientStyle="linear-gradient(321.94deg, #7D34D7 14.89%, #0054C2 55.74%, #001D42 96.6%)"
            className="text-black"
            reverse={false}
          >
            IQ команды выше, чем у крипто-экспертов
          </Title>

          <div className="flex items-start gap-[30px] sm:gap-[10px]  mt-[60px] md:mt-[120px]">
            <MafiaSlider />
          </div>
        </Container>

        <div className="absolute right-0 w-full bottom-[-600px] sm:bottom-[unset] top-[unset] sm:top-[200px] max-w-[800px] z-[-1]">
          <img className="w-full h-full" src="/sectionDecor3.png" alt="" />
        </div>
      </section>

      <section className=" mt-[60px] sm:mt-[160px] relative z-[3]">
        <Container>
          <Title
            as="h2"
            fontSize="text-[30px] sm:text-[60px]"
            lineHeight="leading-[34px] sm:leading-[66px]"
            gradientText={"Мировые СМИ"}
            gradientStyle="linear-gradient(321.94deg, #7D34D7 14.89%, #0054C2 55.74%, #001D42 96.6%)"
            className="text-black"
            reverse={false}
          >
            говорят о нас
          </Title>

          <div className=" mt-[40px] md:mt-[120px] flex gap-[10px] lg:gap-[25px] justify-center flex-wrap">
            <Link
              target="_blank"
              href={
                "https://markets.businessinsider.com/news/stocks/deflationcoin-launches-to-fix-bitcoin-s-flaws-with-burn-based-model-and-smart-staking-1034554978#:~:text=Dubai,%20UAE,%20April%2007,%202025%20%28GLOBE%20NEWSWIRE%29%20--,economic%20and%20technological%20shortcomings%20of%20Bitcoin%20and%20Ethereum"
              }
              className="flex max-w-[160px] lg:max-w-[360px] w-full min-h-[100px] lg:min-h-[260px] justify-center flex items-center  p-[0] sm:p-[10px]   cursor-pointer rounded-[30px] transition-all duration-300 justify-center items-center hover:bg-[#eff2fb] "
            >
              <img
                className="max-w-[80px] lg:max-w-[100%]"
                src="/businessLogo.png"
                alt=""
              />
            </Link>
            <Link
              target="_blank"
              href={
                "https://www.nbc4i.com/business/press-releases/globenewswire/9417941/deflationcoin-launches-to-fix-bitcoins-flaws-with-burn-based-model-and-smart-staking/"
              }
              className="flex max-w-[160px] lg:max-w-[360px] w-full min-h-[100px] lg:min-h-[260px] justify-center flex items-center p-[0] sm:p-[10px] cursor-pointer rounded-[30px] transition-all duration-300 justify-center items-center hover:bg-[#eff2fb] "
            >
              <img
                className="max-w-[60px] lg:max-w-[100%]"
                src="/mainstreamMedia.png"
                alt=""
              />
            </Link>
            <Link
              target="_blank"
              href={
                "https://apnews.com/press-release/globenewswire-mobile/bitcoin-8a2468debc9951f6d892c5759815e2c4"
              }
              className="flex max-w-[160px] lg:max-w-[360px] w-full min-h-[100px] lg:min-h-[260px] justify-center flex items-center  p-[0] sm:p-[10px] cursor-pointer rounded-[30px] transition-all duration-300 justify-center items-center hover:bg-[#eff2fb] "
            >
              <img
                className="max-w-[120px] lg:max-w-[100%]"
                src="/associatedPress.png"
                alt=""
              />
            </Link>

            <Link
              target="_blank"
              href={
                "https://www.benzinga.com/pressreleases/25/04/g44664944/deflationcoin-launches-to-fix-bitcoins-flaws-with-burn-based-model-and-smart-staking"
              }
              className="flex max-w-[160px] lg:max-w-[360px] w-full min-h-[100px] lg:min-h-[260px] justify-center flex items-center  p-[0] sm:p-[10px] cursor-pointer rounded-[30px] transition-all duration-300 justify-center items-center hover:bg-[#eff2fb] "
            >
              <img
                className="max-w-[120px] lg:max-w-[100%]"
                src="/benzinga.png"
                alt=""
              />
            </Link>

            <Link
              target="_blank"
              href={
                "https://www.marketwatch.com/press-release/deflationcoin-launches-to-fix-bitcoin-s-flaws-with-burn-based-model-and-smart-staking-f149f7ad?mod=search_headline"
              }
              className="flex max-w-[160px] lg:max-w-[360px] w-full min-h-[100px] lg:min-h-[260px] justify-center flex items-center  p-[0] sm:p-[10px] cursor-pointer rounded-[30px] transition-all duration-300 justify-center items-center hover:bg-[#eff2fb] "
            >
              <img
                className="max-w-[140px] lg:max-w-[100%]"
                src="/marketWatch.png"
                alt=""
              />
            </Link>

            <Link
              target="_blank"
              href={
                "https://www.benzinga.com/pressreleases/25/04/g44664944/deflationcoin-launches-to-fix-bitcoins-flaws-with-burn-based-model-and-smart-staking"
              }
              className="flex max-w-[160px] lg:max-w-[360px] w-full min-h-[100px] lg:min-h-[260px] justify-center flex items-center  p-[0] sm:p-[10px] cursor-pointer rounded-[30px] transition-all duration-300 justify-center items-center hover:bg-[#eff2fb] "
            >
              <img
                className="max-w-[120px] lg:max-w-[100%]"
                src="/ldmPress.png"
                alt=""
              />
            </Link>

            <Link
              target="_blank"
              href={
                "https://www.tradingview.com/news/reuters.com,2025-04-07:newsml_GNX23RrKC:0-deflationcoin-launches-to-fix-bitcoin-s-flaws-with-burn-based-model-and-smart-staking/"
              }
              className="flex max-w-[160px] lg:max-w-[360px] w-full min-h-[100px] lg:min-h-[260px] justify-center flex items-center  p-[0] sm:p-[10px] cursor-pointer rounded-[30px] transition-all duration-300 justify-center items-center hover:bg-[#eff2fb] "
            >
              <img
                className="max-w-[120px] lg:max-w-[100%]"
                src="/tradingViewLogo.png"
                alt=""
              />
            </Link>

            <Link
              target="_blank"
              href={
                "https://coinmarketcap.com/community/articles/67f38dd645f3cc00ddb1152b/"
              }
              className="flex max-w-[160px] lg:max-w-[360px] w-full min-h-[100px] lg:min-h-[260px] justify-center flex items-center  p-[0] sm:p-[10px] cursor-pointer rounded-[30px] transition-all duration-300 justify-center items-center hover:bg-[#eff2fb] "
            >
              <img
                className="max-w-[120px] lg:max-w-[100%]"
                src="/coinmarketcap.png"
                alt=""
              />
            </Link>

            <Link
              target="_blank"
              href={""}
              className="flex max-w-[160px] lg:max-w-[360px] w-full min-h-[100px] lg:min-h-[260px] justify-center flex items-center  p-[0] sm:p-[10px] cursor-pointer rounded-[30px] transition-all duration-300 justify-center items-center hover:bg-[#eff2fb] "
            >
              <img
                className="max-w-[120px] lg:max-w-[100%]"
                src="/reutersLogo.png"
                alt=""
              />
            </Link>

            <Link
              target="_blank"
              href={
                "https://www.digitaljournal.com/pr/news/binary-news-network/deflationcoin-launches-fix-bitcoin-s-flaws-1775163384.html#google_vignette"
              }
              className="flex max-w-[160px] lg:max-w-[360px] w-full min-h-[100px] lg:min-h-[260px] justify-center flex items-center  p-[0] sm:p-[10px] cursor-pointer rounded-[30px] transition-all duration-300 justify-center items-center hover:bg-[#eff2fb] "
            >
              <img
                className="max-w-[100px] lg:max-w-[100%]"
                src="/digitalLogo.png"
                alt=""
              />
            </Link>

            <Link
              target="_blank"
              href={""}
              className="flex max-w-[160px] lg:max-w-[360px] w-full min-h-[100px] lg:min-h-[260px] justify-center flex items-center  p-[0] sm:p-[10px] cursor-pointer rounded-[30px] transition-all duration-300 justify-center items-center hover:bg-[#eff2fb] "
            >
              <img
                className="max-w-[100px] lg:max-w-[100%]"
                src="/cryptoadventureLogo.png"
                alt=""
              />
            </Link>

            <Link
              target="_blank"
              href={""}
              className="flex max-w-[160px] lg:max-w-[360px] w-full min-h-[100px] lg:min-h-[260px] justify-center flex items-center  p-[0] sm:p-[10px] cursor-pointer rounded-[30px] transition-all duration-300 justify-center items-center hover:bg-[#eff2fb] "
            >
              <img
                className="max-w-[100px] lg:max-w-[100%]"
                src="/morningstar.png"
                alt=""
              />
            </Link>
          </div>
        </Container>
      </section>

      <section className=" mt-[60px] sm:mt-[160px] relative z-[3]">
        <Container>
          <Title
            as="h2"
            fontSize="text-[30px] sm:text-[60px]"
            lineHeight="leading-[34px] sm:leading-[66px]"
            gradientText={"надёжность"}
            gradientStyle="linear-gradient(321.94deg, #7D34D7 14.89%, #0054C2 55.74%, #001D42 96.6%)"
            className="text-black"
            reverse={true}
          >
            Юридическая и техническая
          </Title>
        </Container>

        <div className="mt-[40px] sm:mt-[120px] max-w-[1920px] m-auto pl-[20px] 2xl:pl-[200px] flex gap-[30px]">
          <LegalSlider />
        </div>
      </section>

      <section className=" mt-[60px] sm:mt-[160px] relative z-[2]">
        <Container>
          <Title
            as="h2"
            fontSize="text-[30px] sm:text-[60px]"
            lineHeight="leading-[34px] sm:leading-[66px]"
            gradientText={"Наши приложения"}
            gradientStyle="linear-gradient(88.56deg, #2A86FF 14.89%, #003172 34.37%, #7D34D7 61.41%)"
            className="text-black"
            reverse={false}
          >
            для популярных платформ
          </Title>

          <div className="flex flex-wrap  gap-[30px] mt-[40px] sm:mt-[120px]">
            <div className="bg-wheat  overflow-hidden  flex flex-col rounded-[30px] min-h-[500px] md:min-h-[745px] flex-[48.5%] relative z-[2] p-[30px] md:p-[60px]">
              <div className="w-[60px] absolute right-[30px] top-[30px] md:top-[60px]  md:right-[60px] cursor-pointer ml-auto h-[60px] rounded-[100px] bg-wheat2 flex items-center justify-center">
                <i className="icon icon-arrow text-[32px] bg-white"></i>
              </div>

              <div
                className="w-[140px] md:w-[200px] rounded-[30px] h-[140px] md:h-[200px] bg-white flex 
              items-center justify-center"
              >
                <img
                  className="max-w-[100px]  md:max-w-[140px]"
                  src="/QR.png"
                  alt=""
                />
              </div>

              <BlockTitle>
                Приложение <span className="block">Apple MacOS</span>
              </BlockTitle>
              <p className="mt-[30px] md:mt-[40px] text-[16px] md:text-[24px]  leading-[26px] md:leading-[40px] font-[Stem] font-normal  text-black">
                Архив 32.11 Мбайт{" "}
                <span className="block">ёверсия 1.01 / 23.10.2024</span>
              </p>

              <div className="flex items-start mt-[95px] justify-start">
                <BorderButton className="block mt-auto" iconClass="icon-arrow">
                  Скачать для MacOS
                </BorderButton>
              </div>
              <img
                className="absolute hidden md:flex bottom-0 right-0 z-[-1]"
                src="/apple.png"
                alt=""
              />
              <img
                className="absolute flex md:hidden bottom-0 right-0 z-[-1]"
                src="/appleMobile.png"
                alt=""
              />
            </div>

            <div className="bg-wheat overflow-hidden flex flex-col rounded-[30px] min-h-[500px] md:min-h-[745px] flex-[48.5%] relative z-[2] p-[30px] md:p-[60px]">
              <div className="w-[60px]  absolute right-[30px] top-[30px] md:top-[60px]   md:right-[60px] cursor-pointer ml-auto h-[60px] rounded-[100px] bg-wheat2 flex items-center justify-center">
                <i className="icon icon-arrow text-[32px] bg-white"></i>
              </div>

              <div
                className="w-[140px] md:w-[200px] rounded-[30px] h-[140px] md:h-[200px]  bg-white flex 
              items-center justify-center"
              >
                <img
                  className="max-w-[100px]  md:max-w-[140px]"
                  src="/QR2.png"
                  alt=""
                />
              </div>

              <BlockTitle>
                Приложение <span className="block">Google Android</span>
              </BlockTitle>
              <p className="mt-[30px] md:mt-[40px] text-[16px] md:text-[24px]  leading-[26px] md:leading-[40px] font-[Stem] font-normal   text-black">
                Архив 32.11 Мбайт{" "}
                <span className="block">ёверсия 1.01 / 23.10.2024</span>
              </p>

              <div className="flex items-start mt-[95px] justify-start">
                <BorderButton className="block mt-auto" iconClass="icon-arrow">
                  Скачать для Android
                </BorderButton>
              </div>
              <img
                className="absolute hidden md:flex bottom-0 right-0 z-[-1]"
                src="/android.png"
                alt=""
              />
              <img
                className="absolute flex md:hidden bottom-0 right-0 z-[-1]"
                src="/androidMobile.png"
                alt=""
              />
            </div>
          </div>
        </Container>

        <div className="absolute right-0 w-full  bottom-[-400px] sm:bottom-[unset] top-[unset] sm:top-[320px] max-w-[800px] z-[-1]">
          <img className="w-full" src="/sectionDecor.png" alt="" />
        </div>
      </section>

      <section className="  mt-[60px] md:mt-[125px]  min-h-[200px] md:min-h-[600px] relative z-[3]">
        <div className="absolute w-full top-[-] left-0 z-[-1] ">
          <img
            className="w-full hidden md:flex h-[200px] md:h-[600px]"
            src="/lines2.png"
            alt=""
          />
         <img
          src="/logo2Mobile.png"
          alt=""
            className="w-full flex md:hidden h-[200px] md:h-[600px]"
        />
        </div>

        <img
          src="/logo2.svg"
          alt=""
          className="absolute  left-1/2 top-[100px] max-w-[120px] md:max-w-[unset]  md:top-[300px] -translate-x-1/2 -translate-y-1/2 z-[1]"
        />
       
      </section>

      <section className=" mt-[55px]  relative z-[3]">
        <Container>
          <div className="w-full min-h-[400px]   px-[23px] md:px-[unset] py-[30px] md:py-[unset] flex flex-col rounded-[30px] overflow-hidden relative z-[2] sm:min-h-[800px]">
            <video
              id="deflationVideo"
              className="w-full absolute left-0 top-0 h-full z-[-1] object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/video/video2.mp4" type="video/mp4" />
            </video>

            <div className="mt-[unset] flex flex-col h-full md:mt-[120px] realtve z-[2] ml-auto mr-auto max-w-[1048px] w-full">
              <Title
                as="h2"
                fontSize="text-[30px] sm:text-[60px]"
                lineHeight="leading-[34px] sm:leading-[66px]"
                gradientStyle="linear-gradient(88.56deg, #2A86FF 14.89%, #003172 34.37%, #7D34D7 61.41%)"
                className="text-white"
                reverse={false}
              >
                Действуй. Инвестируй. Приумножай
              </Title>

              <div className="hidden md:flex mt-auto md:mt-[60px] flex items-center justify-center">
                <GradientButton>Инвестировать в DEF</GradientButton>
              </div>
            </div>

             <div className="flex md:hidden mt-auto md:mt-[60px] flex items-center justify-center">
                <GradientButton>Инвестировать в DEF</GradientButton>
              </div>
          </div>
        </Container>
      </section>
    </>
  );
}
