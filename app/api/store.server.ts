import db from "~/db.server";

export async function getStore(shop) {
  try {
    const store = await db.shopifyStore.findFirst({
      where: {
        url: shop
      }
    })

    return store
  } catch (error) {
    console.log('GET STORE ERROR', error)
  }
}