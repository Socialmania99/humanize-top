import data from '@/data/tools.json';
import { Workspace } from '@/components/product/humanize';
import { notFound } from 'next/navigation';
export function generateStaticParams() {
  return data.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params; const t=data.find(x=>x.slug===slug);return {title:t?`${t.title} · Humanize.top`:'Tool not found'};}
export default async function Tool({params}:{params:Promise<{slug:string}>}){const {slug}=await params; const t=data.find(x=>x.slug===slug);if(!t)notFound();return <Workspace tool={t}/>;}
