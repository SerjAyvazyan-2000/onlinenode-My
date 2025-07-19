"use client";

import React from "react";
import { useTranslations } from "use-intl";
import { Heading } from "../../components/heading";
import Block from "../../template/block";
import { Divider } from "../../components/divider";

export default function Privacy() {
  const t = useTranslations();
  return (
    <Block>
      <div className="flex items-end justify-between gap-4 px-8 pt-8">
        <Heading className="max-sm:text-xl">Official Company Licence</Heading>

      </div>
      <Divider className="mt-6 mb-4" soft />
      <div className="mt-4 px-8 pb-4 text-sm">
          <p><b>Legal name:</b> Deflationary Digital State, Inc.</p>

<p className="mt-4">Deflationary Digital State, Inc is building a Layer 1 blockchain powered by artificial intelligence and innovative deflationary mechanisms. The company is also developing market-making algorithms, high-frequency trading systems, and algorithmic bots. Upon completion, a hybrid centralized-decentralized exchange will be launched on this infrastructure.</p>

<p className="mt-4">Deflationary Digital State Inc. is not responsible for the creation or issuance of DeflationCoin. However, in the future, DeflationCoin may transition to a blockchain infrastructure developed and maintained by Deflationary Digital State Inc.</p>

<p className="mt-4"><b>Mailing address:</b></p>
<p className="mt-2">8 The Green, Ste A</p>
<p className="mt-2">Dover, DE 19901 USA</p>

<p className="mt-4"><b>Corporate e-mail:</b> deflationarydigitalstateinc@gmail.com</p>

<p className="mt-4"><b>Owner of the company:</b></p>
<p className="mt-2"><img src="/teams/founder.jpg" alt="Founder" width={200} height={200} className="rounded-lg" /></p>
<p className="mt-2">Eduard Anastasyan,</p>
<p className="mt-2">Founder.</p>
      </div>
    </Block>
  );
}
