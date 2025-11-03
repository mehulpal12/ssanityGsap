import CardNav from '../components/CardNav'
import { type SanityDocument } from "next-sanity";
import Theme from "../components/theme-icon"
import { client } from "./client";
import LightRays from '../components/LightRays';
import Link from 'next/link';
import { urlFor } from './imageUrlBuilder';
import Image from 'next/image';
import MagicBento from '../components/MagicBento'

// const POSTS_QUERY = `*[
//   _type == "post"
//   && defined(slug.current)
// ]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;
const query = `*[_type == "post"] {
  title,
  "imageUrl": mainImage.asset->url,
  // ... other fields
}`;


const options = { next: { revalidate: 30 } };
const items = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Company", ariaLabel: "About Company" },
        { label: "Careers", ariaLabel: "About Careers" }
      ]
    },
    {
      label: "Projects", 
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Featured", ariaLabel: "Featured Projects" },
        { label: "Case Studies", ariaLabel: "Project Case Studies" }
      ]
    },
    {
      label: "Contact",
      bgColor: "#271E37", 
      textColor: "#fff",
      links: [
        { label: "Email", ariaLabel: "Email us" },
        { label: "Twitter", ariaLabel: "Twitter" },
        { label: "LinkedIn", ariaLabel: "LinkedIn" }
      ]
    }
  ];
 
export default async function Home() {
  const posts = await client.fetch<SanityDocument[]>(query);
  console.log(posts);
  

  return (
   <div>
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
  <LightRays
    raysOrigin="top-center"
    raysColor="#00ffff"
    raysSpeed={1.5}
    lightSpread={0.8}
    rayLength={1.2}
    followMouse={true}
    mouseInfluence={0.1}
    noiseAmount={0.1}
    distortion={0.05}
    className="custom-rays"
  />
</div>
     <main className="">
       <CardNav
      logoAlt="DevPilot Studio"
      items={items}
      logo=""
      baseColor="#fff"
      menuColor="#000"
      buttonBgColor="#111"
      buttonTextColor="#fff"
      ease="power3.out"
    />
      <div className="absolute top-4 right-12">
        <Theme />
      </div>
    </main>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-semibold '>
      <h1 className='font-semibold text-5xl'>{posts[0]?.title}</h1>
        {/* <Image
          src={urlFor(posts[0]?.imageUrl).url()} 
          alt={posts[0]?.title || 'Post Image'}
          width={500} 
          height={300} 
          layout="responsive" 
        /> */}
      </div>
      <MagicBento 
  textAutoHide={true}
  enableStars={true}
  enableSpotlight={true}
  enableBorderGlow={true}
  enableTilt={true}
  enableMagnetism={true}
  clickEffect={true}
  spotlightRadius={300}
  particleCount={12}
  glowColor="132, 0, 255"
/>
   </div>
  );
}