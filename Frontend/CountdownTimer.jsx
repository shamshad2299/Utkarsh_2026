const Box = ({ value }) => (
  <div className="bg-white text-[#050214] text-5xl font-bold w-24 h-24 flex items-center justify-center rounded-2xl shadow-xl">
    {value}
  </div>
);

const CountdownTimer = () => {
  return (
    <div className="flex items-center gap-2">
      <Box value="00" />
      <span className="text-4xl font-bold">:</span>
      <Box value="59" />
      <span className="text-4xl font-bold">:</span>
      <Box value="36" />
    </div>
  );
};

export default CountdownTimer;
