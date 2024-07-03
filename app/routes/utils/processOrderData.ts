export const processOrderData = (customers) => {
  return customers.map((item, idx) => {
    const refunds = item.orders.reduce((acc, order) => acc += order.refunds.length, 0)
    const percentage = (refunds / item.orders.length) * 100

    const refundsCosts = item.orders.reduce((acc, order) => {
      const costs = order.refunds.reduce((refundAcc, refund) => refundAcc += refund.cost ,0)

      acc += costs;
      return acc
    }, 0)

    return {
      id: idx,
      customer: `${item.firstName} ${item.lastName}`,
      orders: item.orders.length,
      refunds: refunds,
      percentage: percentage,
      cost: refundsCosts,
      email: item.email
    }
  })
}