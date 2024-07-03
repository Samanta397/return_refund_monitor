import db from "../db.server";
import {getOrder} from "~/api/order.server";
export async function createRefund(refundData) {
  try {
    const order = await getOrder(`gid://shopify/Order/${refundData.order_id}`);

    if(!order) {
      throw  new Error('Order not exists')
    }

    const data = {
      refund_id: refundData.admin_graphql_api_id,
      cost: refundData.refund_line_items.reduce((acc, item) => acc += Number(item.subtotal), 0),
      order: {
        connect: order
      }
    }

    await db.refund.create({
      data
    })

  } catch (error) {
    console.log('CREATE REFUND ERROR', error)
  }
}