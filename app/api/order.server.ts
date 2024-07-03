import db from "../db.server";
import {getStore} from "~/api/store.server";
import { upsertCustomer} from "~/api/customer.server";
export async function getCustomerOrders(shop) {
  try {

    const store = await getStore(shop)

    if (!store) {
      throw new Error('Store not exists')
      // return null
    }

    const customers = await db.customer.findMany({
      include: {
        orders: {
          include: {
            refunds: true
          }
        },
      }
    })

    return customers
  } catch (error) {
    console.log('GET ORDERS ERROR', error)
  }
}

export async function orderCreate(shop, payload) {
  try {

    const store = await getStore(shop)

    if (!store) {
      throw new Error ('Store not exists')
    }

    const customer = await upsertCustomer(payload.customer)

    const data = {
      order_id: payload.admin_graphql_api_id,
      order_name: payload.name,
      cost: Number(payload.total_price),
      store: {
        connect: store
      },
      customer: {
        connect: customer
      }
    }

    const order = await db.shopifyOrder.create({
      data
    })
  } catch (error) {
    console.log('ORDER CREATE ERROR', error)
  }
}

export async function getOrder (orderId) {
  try {
    const order = await db.shopifyOrder.findFirst({
      where: {
        order_id: orderId
      }
    })

    return order
  } catch (error) {
    console.log('GET ORDER ERROR', error)
  }
}