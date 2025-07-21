import React, { useEffect, useState } from "react";
import Container from "../shared/container";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";

type Section = {
  title: string;
  links: { label: string; href: string }[];
};

export default function Footer() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const sections: Section[] = [
    {
      title: "МЕНЮ",
      links: [
        { label: "Litepaper", href: "#" },
        { label: "Roadmap", href: "#" },
        { label: "Whitepaper", href: "#" },
        { label: "Онлайн-нода", href: "#" },
      ],
    },
    {
      title: "ПОДДЕРЖКА",
      links: [
        { label: "Github", href: "#" },
        { label: "Term of use", href: "#" },
        { label: "Private policy", href: "#" },
      ],
    },
    {
      title: "СОЦСЕТИ",
      links: [
        { label: "Telegram", href: "#" },
        { label: "Twitter", href: "#" },
        { label: "Youtube", href: "#" },
      ],
    },
  ];

  return (
    <footer className=" mt-[160px] pb-[30px]  md:pb-[60px] relative z-[3]">
      <Container>
        <div className="flex bg-[#EFF2FB] p-[30px] md:p-[80px] rounded-[30px] flex-col xl:flex-row gap-[0] md:gap-[30px]">
          <div className="hidden md:flex items-start max-w-[450px] ">
            <img src="/footerLogo.svg" alt="Deflation Coin" />
          </div>

          <div className="flex flex-col md:flex-row lg:gap-[209px] border border-b-[#D1DDE5] border-t-transparent border-r-transparent border-l-transparent  gap-[30px] md:gap-[30px] lg:flex-nowrap flex-wrap lg:justify-unset justify-between text-[16px] text-[#1E1E1E] font-[Stem]">
            <div className=" flex-col hidden md:flex gap-[30px]">
              <h4 className="text-[20px] text-black  font-[Stem] leading-[100%] font-medium">
                МЕНЮ
              </h4>
              <a
                href="#"
                className="text-[20px] text-gray  font-[Stem] leading-[100%] font-normal hover:underline"
              >
                Litepaper
              </a>
              <a
                href="#"
                className="text-[20px] text-gray  font-[Stem] leading-[100%] font-normal hover:underline"
              >
                Roadmap
              </a>
              <a
                href="#"
                className="text-[20px] text-gray  font-[Stem] leading-[100%] font-normal hover:underline"
              >
                Whitepaper
              </a>
              <a
                href="#"
                className="text-[20px] text-gray  font-[Stem] leading-[100%] font-normal hover:underline"
              >
                Онлайн-нода
              </a>
            </div>

            <div className=" flex-col hidden md:flex gap-[30px]">
              <h4 className="text-[20px] text-black  font-[Stem] leading-[100%] font-medium">
                ПОДДЕРЖКА
              </h4>
              <a
                href="#"
                className="text-[20px] text-gray  font-[Stem] leading-[100%] font-normal hover:underline"
              >
                Github
              </a>
              <a
                href="#"
                className="text-[20px] text-gray  font-[Stem] leading-[100%] font-normal hover:underline"
              >
                Term of use
              </a>
              <a
                href="#"
                className="text-[20px] text-gray  font-[Stem] leading-[100%] font-normal hover:underline"
              >
                Private policy
              </a>
            </div>

            <div className=" flex-col hidden md:flex gap-[30px]">
              <h4 className="text-[20px] text-black uppercase font-[Stem] leading-[100%] font-medium">
                СОЦСЕТИ
              </h4>
              <a
                href="#"
                className="text-[20px] text-gray  font-[Stem] leading-[100%] font-normal hover:underline"
              >
                Telegram
              </a>
              <a
                href="#"
                className="text-[20px] text-gray  font-[Stem] leading-[100%] font-normal hover:underline"
              >
                X (twitter)
              </a>
              <a
                href="#"
                className="text-[20px] text-gray  font-[Stem] leading-[100%] font-normal hover:underline"
              >
                Linkedin
              </a>
              <a
                href="#"
                className="text-[20px] text-gray  font-[Stem] leading-[100%] font-normal hover:underline"
              >
                Youtube
              </a>
            </div>

            <div className=" flex-col pb-[30px] flex md:hidden gap-[30px]">
              {sections.map((section, index) => (
                <div key={index}>
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggle(index)}
                  >
                    <h4 className="text-[20px] text-black  font-[Stem] leading-[100%] font-medium">
                      {section.title}
                    </h4>
                    <i
                      className={`icon icon-arrowDown transition-transform text-[10px] bg-black duration-300 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    ></i>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === index
                        ? "max-h-[500px] mt-[30px]"
                        : "max-h-0"
                    }`}
                  >
                    <div className="flex flex-col  gap-[20px] ">
                      {section.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.href}
                          className="text-[18px] text-gray  font-[Stem] leading-[100%] font-normal hover:underline"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

           <div className="flex md:hidden mt-[30px]  max-w-[280px] ">
            <img src="/footerLogo.svg" alt="Deflation Coin" />
          </div>
        </div>
      </Container>

      <Container>
        <div className=" px-[0] mt-[30px] md:mt-[60px] 2xl:px-[80px]  flex flex-col lg:flex-row justify-between items-center gap-[20px] 2xl:gap-[150px] ">
          <span className="text-[16px] md:text-[20px] text-gray  font-[Stem] leading-[100%] font-normal">
            © 2025, Copyright Deflation Coin
          </span>
          <span className="text-[16px] md:text-[20px] text-gray  font-[Stem] leading-[100%] font-normal">
            All rights reserved.
          </span>
          <a
            href="deflationcoin.com"
            target="blacnk"
            className="text-[16px] md:text-[20px] text-gray  font-[Stem] leading-[100%] font-normal  hover:underline"
          >
            deflationcoin.com
          </a>
          <a
            href="mailto:support@deflationcoin.com"
            className="text-[16px] md:text-[20px] text-gray  font-[Stem] leading-[100%] font-normal  hover:underline"
          >
            support@deflationcoin.com
          </a>
        </div>
      </Container>
    </footer>
  );
}
