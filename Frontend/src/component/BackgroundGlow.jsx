const BackgroundGlow = () => {
  return (
    <>
      <div className="absolute top-1/4 left-1/4 w-125 h-125 bg-purple-900/20 rounded-full blur-[120px] -z-10 overflow-x-hidden"></div>
      <div className="absolute bottom-1/4 right-1/4 w-100 h-100 bg-blue-900/20 rounded-full blur-[100px] -z-10 overflow-x-hidden"></div>
    </>
  );
};

export default BackgroundGlow;
