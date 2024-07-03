import db from "../db.server";
export async function createCustomer(customerData) {
  try {
    const data = {
      email: customerData.email,
      firstName: customerData.first_name,
      lastName:  customerData.last_name
    }

    const customer = await db.customer.create({
      data
    })

    return customer

  } catch (error) {
    console.log('CREATE CUSTOMER ERROR',  error)
  }
}

export async function upsertCustomer(customerData) {
  try {
    const data = {
      email: customerData.email,
      firstName: customerData.first_name,
      lastName:  customerData.last_name
    }

    const customer = await db.customer.upsert({
      where: {
        email: customerData.email
      },
      create: data,
      update: data
    })

    return customer

  } catch (error) {
    console.log('CREATE CUSTOMER ERROR',  error)
  }
}