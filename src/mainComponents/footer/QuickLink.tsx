import Link from "next/link";
import React from "react";
import {
  buyAndSell,
  citiesWeCover,
  company,
  contactUs,
  LinkListProps,
  marketTrends,
} from ".";

const LinkList: React.FC<LinkListProps> = ({ title, linkList }) => {
  return (
    <div className="flex flex-col gap-y-6">
      <span className="font-bold text-base">{title}</span>
      <ul className="list-none flex flex-col text-sm text-lightWhite space-y-4">
        {linkList.map((item, idx) => (
          <Link key={idx} href={item.href} title={item.label}>
            <li>{item.label}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

const QuickLink = () => {
  return (
    <div className="w-full flex flex-row flex-wrap md:flex-nowrap items-start justify-between gap-x-4 gap-y-6 xl:pt-2 xl:pb-7 md:pt-0 md:pb-5 pt-3 pb-6.5">
      <LinkList title={citiesWeCover.title} linkList={citiesWeCover.linkList} />
      <LinkList title={buyAndSell.title} linkList={buyAndSell.linkList} />
      <LinkList title={marketTrends.title} linkList={marketTrends.linkList} />
      <LinkList title={contactUs.title} linkList={contactUs.linkList} />
      <LinkList title={company.title} linkList={company.linkList} />
    </div>
  );
};

export default QuickLink;
