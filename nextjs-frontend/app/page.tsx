import KPICard from "@/components/KPICard";
import { Order } from "./_types/orders";
import { getData } from "@/utils/fetchData";
import { getChartData } from "./charts/GetChartData";
import SalesByDay from "./charts/SalesByDay";
import UsersByDay from "./charts/UsersByDay";
import RevenueByCategory from "./charts/RevenueByCategory";

async function getSalesData(startDate: Date, endDate: Date) {
  const data = await getData();

  const { array, format } = getChartData(startDate, endDate);

  const dayArray = array.map((date) => {
    return {
      date: format(date),
      totalSales: 0,
    };
  });

  return {
    chartData: data.reduce(
      (acc: { date: string; totalSales: number }[], entry: Order) => {
        const formattedDate = format(new Date(entry.createdAt));
        const orderDay = acc.find((day) => day.date === formattedDate);

        if (orderDay != null) {
          orderDay.totalSales += entry.amount;
        }
        return acc;
      },
      dayArray,
    ),
    amount: data.reduce((amount: number, entry: Order) => {
      return amount + entry["amount"];
    }, 0),
    count: data.length,
  };
}

async function getUsersData(startDate: Date, endDate: Date) {
  const data = await getData();

  const users = data.reduce((customerIds: number[], entry: Order) => {
    if (entry == null) return customerIds;
    if (customerIds.includes(entry["customerId"])) return customerIds;

    // FIX: Push first, then return the array separately
    customerIds.push(entry["customerId"]);
    return customerIds;
  }, []);

  const { array, format } = getChartData(startDate, endDate);
  const dayArray = array.map((date) => {
    return {
      date: format(date),
      totalUsers: 0,
    };
  });

  return {
    chartData: data.reduce(
      (acc: { date: string; totalUsers: number }[], entry: Order) => {
        const formattedDate = format(new Date(entry.createdAt));
        const order = acc.find((user) => user.date === formattedDate);

        if (order != null) {
          order.totalUsers += 1;
        }

        return acc;
      },
      dayArray,
    ),
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

async function getCategoryData(startDate: Date, endDate: Date) {
  const data = await getData();

  const { array, format } = getChartData(startDate, endDate);

  const categoryArray = [
    { name: "Electronics", revenue: 0 },
    { name: "Fashion", revenue: 0 },
    { name: "Books", revenue: 0 },
    { name: "Accessories", revenue: 0 },
  ];

  return {
    chartData: array.reduce(
      (acc: { name: string; revenue: number }[], date: Date) => {
        const entry: Order = data.find(
          (order: Order) => format(new Date(order.createdAt)) === format(date),
        );

        if (entry != null) {
          const category = acc.find((value) => value.name === entry.category);
          if (category != null) category.revenue += entry.amount;
          return acc;
        }

        return acc;
      },
      categoryArray,
    ),
  };
}

interface PageProps {
  searchParams: Promise<{
    totalSalesRangeFrom?: string;
    totalSalesRangeTo?: string;
    usersRangeFrom?: string;
    usersRangeTo?: string;
    categoryRangeFrom?: string;
    categoryRangeTo?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  // Await the searchParams promise before destructuring its fields
  const params = await searchParams;
  const {
    totalSalesRangeFrom,
    totalSalesRangeTo,
    usersRangeFrom,
    usersRangeTo,
    categoryRangeFrom,
    categoryRangeTo,
  } = params;

  // Shift baseline default dates to 2025 since your python generator targets 2025
  const defaultStartDate = new Date("2025-01-01T00:00:00Z");
  const defaultEndDate = new Date("2025-12-31T23:59:59Z");

  const startDateSales = totalSalesRangeFrom
    ? new Date(totalSalesRangeFrom)
    : defaultStartDate;
  const endDateSales = totalSalesRangeTo
    ? new Date(totalSalesRangeTo)
    : defaultEndDate;

  const startDateUsers = usersRangeFrom
    ? new Date(usersRangeFrom)
    : defaultStartDate;
  const endDateUsers = usersRangeTo ? new Date(usersRangeTo) : defaultEndDate;

  const startDateCategory = categoryRangeFrom
    ? new Date(categoryRangeFrom)
    : defaultStartDate;
  const endDateCategory = categoryRangeTo
    ? new Date(categoryRangeTo)
    : defaultEndDate;

  const [salesData, usersData, categoryData] = await Promise.all([
    getSalesData(startDateSales, endDateSales),
    getUsersData(startDateUsers, endDateUsers),
    getCategoryData(startDateCategory, endDateCategory),
  ]);

  const formattedCurrency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.round(salesData.amount));

  const averageFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.round(salesData.amount / 12));

  categoryData.chartData = categoryData.chartData.filter(
    (entry) => entry.revenue > 0,
  );

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
      <div className="grid mt-5 gap-4 grid-cols-1 lg:grid-cols-2 mx-5">
        <KPICard
          title="Sales By Day"
          body={<SalesByDay data={salesData.chartData} />}
          queryKey="totalSalesRange"
          isChart
        />
        <KPICard
          title="Users By Day"
          body={<UsersByDay data={usersData.chartData} />}
          queryKey="usersRange"
          isChart
        />
        <KPICard
          title="Revenue By Category"
          body={<RevenueByCategory data={categoryData.chartData} />}
          queryKey="categoryRange"
          isChart
        />
      </div>
    </>
  );
}
