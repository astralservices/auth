import Image from "next/image";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center h-full align-middle bg-black">
      <div className="grid items-center justify-center w-full max-w-lg grid-cols-4 gap-4 px-12 py-6 bg-gray-900 rounded-md max-h-max">
        <div className="flex items-center justify-center space-x-8 col-span-full">
          <img
            src="/assets/img/IconMeshed.png"
            alt="Astral Icon"
            className="w-16"
          />
          <div className="-space-y-2">
            <h1 className="text-2xl text-white font-display">astral</h1>
            <h2 className="text-lg text-white font-display">auth</h2>
          </div>
        </div>
        <div className="w-full space-y-4 px-7 col-span-full">{children}</div>
      </div>
    </div>
  );
}

export default Card;
