const DashboardCard = ({ title, value }) => {
  return (
    <div className="bg-white shadow rounded p-6">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl text-gray-500 font-bold mt-2">{value}</p>
    </div>
  );
};

export default DashboardCard;
