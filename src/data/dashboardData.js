export const dashboardData = {
  orderDetails: {
    rider: {
      initials: "FA",
      name: "Frank Alexander",
      role: "Rider",
      codeNumber: "B35265"
    },
    product: {
      orderId: "DX6837M921",
      image: "/src/assets/product-placeholder.svg",
      shipmentAddress: "91 Elgin St, Celina, Delaware, UK",
      shippedDate: {
        date: "05/09/2023",
        time: "12:30 PM"
      },
      deliveredDate: {
        date: "06/09/2023",
        time: "02:30 PM"
      }
    },
    mainInfo: {
      customerName: {
        label: "Customer Name",
        value: "Mr. Justin Calzoni"
      },
      orderDate: {
        label: "Order Date",
        value: "2 September, 2023"
      },
      destination: {
        label: "Destination",
        value: "4517 Washington Ave."
      }
    }
  },
  recentPayment: {
    customer: {
      initials: "JC",
      name: "Justin Calzoni"
    },
    orderId: "DX6837M921",
    amount: "125.00",
    status: "Completed"
  }
};
