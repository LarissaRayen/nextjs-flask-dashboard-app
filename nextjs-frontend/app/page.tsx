import KPICard from "@/components/KPICard";
import { Order } from "./_types/orders";
import { getData } from "@/utils/fetchData";

async function getSalesData() {
  const data = await getData();

  return {
    amount: data.reduce((amount: number, entry: Order) => {
      return amount + entry["amount"];
    }, 0),
    count: data.length,
  };
}

async function getUsersData() {
  const data = await getData();

  const users = data.reduce((customerIds: number[], entry: Order) => {
    if (entry == null) return customerIds;
    if (customerIds.includes(entry["customerId"])) return customerIds;

    // FIX: Push first, then return the array separately
    customerIds.push(entry["customerId"]);
    return customerIds;
  }, []);

  return {
    totalUsers: users.length,
    activeUsers: users.reduce((active: number, customerId: number) => {
      const entry: Order = data.find(
        (entry: Order) => entry["customerId"] === customerId,
      );

      // Get the date that is exactly a year before the current date
      const dateThreshold = new Date();
      dateThreshold.setFullYear(new Date().getFullYear() - 1);

      if (new Date(entry["createdAt"]) <= dateThreshold) return active + 1;
      return active + 0;
    }, 0),
  };
}

export default async function Home() {
  const [salesData, usersData] = await Promise.all([
    getSalesData(),
    getUsersData(),
  ]);

  const formattedCurrency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.round(salesData.amount));

  const averageFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.round(salesData.amount / 12));

  return (
    <>
      <div className="grid mt-5 gap-4 grid-cols-1 lg:grid-cols-3 md:grid-cols-2 mx-5">
        <KPICard
          title="Total Revenue"
          description={`Number Of Orders: ${salesData.count}`}
          body={`${formattedCurrency}`}
        />
        <KPICard
          title="Total Users"
          description={`Active Users : ${usersData.activeUsers}`}
          body={`${usersData.totalUsers} Users`}
        />
        <KPICard
          title="Average Revenue Per Month"
          description={`Number Of Orders Per Month : ${Math.round(salesData.count / 12)}`}
          body={`${averageFormatted}`}
        />
      </div>
    </>
  );
}
