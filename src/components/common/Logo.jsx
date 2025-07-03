import React from 'react';
import { Plane } from 'lucide-react';

function Logo() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-gray-700 rounded-lg">
          <Plane className="w-5 h-5 text-blue-400" />
        </div>
        <h1 className="text-base font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent whitespace-nowrap overflow-hidden text-ellipsis">
          Flight CRM
        </h1>
      </div>
    </div>
  );
}

export default Logo;