// pages/economy/index.js
import fs from "fs";
import path from "path";
import Link from "next/link";
import PostCard from "../../components/PostCard";
import { NextSeo } from "next-seo";

export default function Economy() {
  // This page is deprecated. Redirect handled in getServerSideProps
  return null;
}

export async function getServerSideProps() {
  // Redirect to the unified Market category
  return {
    redirect: {
      destination: "/market",
      permanent: false,
    },
  };
}

