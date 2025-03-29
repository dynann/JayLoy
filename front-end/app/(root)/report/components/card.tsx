import React from "react";
import { Icon } from "@iconify/react";

interface cardProps {
  value: number | string;
}

const AccountCard: React.FC<cardProps> = ({ value }) => {
  return (
    <div className="relative w-full h-full min-h-[200px] overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/80">
      {/* animated particles */}
      <div className="absolute inset-0">
        {/* large particles */}
        <div className="absolute w-4 h-4 bg-white/20 rounded-full animate-float1 top-1/4 left-1/4"></div>
        <div className="absolute w-5 h-5 bg-white/20 rounded-full animate-float2 top-1/3 right-1/4"></div>
        <div className="absolute w-4 h-4 bg-white/20 rounded-full animate-float3 bottom-1/4 left-1/3"></div>
        <div className="absolute w-5 h-5 bg-white/20 rounded-full animate-float4 bottom-1/3 right-1/3"></div>
        
        {/* small particles */}
        <div className="absolute w-3 h-3 bg-white/15 rounded-full animate-float1 top-1/2 left-1/2"></div>
        <div className="absolute w-2 h-2 bg-white/15 rounded-full animate-float2 top-2/3 left-1/4"></div>
        <div className="absolute w-3 h-3 bg-white/15 rounded-full animate-float3 top-1/3 right-1/3"></div>
        <div className="absolute w-2 h-2 bg-white/15 rounded-full animate-float4 bottom-1/2 right-1/2"></div>
      </div>

      {/* contents */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
              <Icon icon="lucide:wallet" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Available Balance</p>
              <p className="text-3xl font-bold text-white">{value}</p>
            </div>
          </div>
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
            <Icon icon="lucide:trending-up" className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
