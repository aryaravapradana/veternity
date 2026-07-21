 
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconChartBar,
  IconCloudRain,
  IconDroplet,
  IconHeartbeat,
  IconTractor,
} from "@tabler/icons-react";

export default function BentoGridDemo() {
  return (
    <BentoGrid className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={
            i === 0 ? "md:col-span-2" :
            i === 3 ? "md:col-span-2" : ""
          }
        />
      ))}
    </BentoGrid>
  );
}

const ImageHeader = ({ src, icon }: { src: string, icon: React.ReactNode }) => (
  <div className="flex flex-1 w-full h-full min-h-[12rem] rounded-[1.5rem] overflow-hidden relative group/image">
    <img src={src} alt="Feature" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110"  loading="lazy" decoding="async" />
    <div className="absolute inset-0 bg-gradient-to-t from-sky-900/80 via-sky-900/20 to-transparent pointer-events-none transition-opacity duration-500 opacity-60 group-hover/image:opacity-80" />
    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3 shadow-2xl transition-transform duration-500 group-hover/image:rotate-12 group-hover/image:scale-110">
      {icon}
    </div>
  </div>
);

const items = [
  {
    title: "Predictive AI Yields",
    description: "Our models analyze your historical data to predict exactly when your flock will reach optimal harvest weight.",
    header: <ImageHeader src="/illustrations/cartoon_ai_yield_1783958825674.png" icon={<IconChartBar className="h-6 w-6 text-white" />} />,
  },
  {
    title: "Climate Sync",
    description: "Integrate with coop sensors to prevent mortality rates from sudden temperature spikes.",
    header: <ImageHeader src="/illustrations/cartoon_climate_1783958835233.png" icon={<IconCloudRain className="h-6 w-6 text-white" />} />,
  },
  {
    title: "Automated Supply",
    description: "Never run out of feed again. Get alerted before critical inventory depletes.",
    header: <ImageHeader src="/illustrations/cartoon_supply_1783958847275.png" icon={<IconTractor className="h-6 w-6 text-white" />} />,
  },
  {
    title: "Flock Health Monitoring",
    description: "Monitor biosecurity and vaccination schedules in real-time. Keep your livestock safe and healthy with proactive insights.",
    header: <ImageHeader src="/illustrations/cartoon_health_1783958858487.png" icon={<IconHeartbeat className="h-6 w-6 text-white" />} />,
  },
  {
    title: "Resource Management",
    description: "Optimize your water and feed consumption to reduce waste.",
    header: <ImageHeader src="/illustrations/cartoon_resource_1783958868884.png" icon={<IconDroplet className="h-6 w-6 text-white" />} />,
  }
];
