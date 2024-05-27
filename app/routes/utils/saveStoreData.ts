import db from "../../db.server";
export const saveStoreData = async (session) => {
  try {
    const existedShop = await db.shopifyStore.findFirst({
      where: {
        url: session.shop
      }
    })

    if (existedShop) {
      await db.shopifyStore.update({
        where: {
          id: existedShop.id
        },
        data: {
          token: session.accessToken
        }
      })
    } else {
      await db.shopifyStore.create({
        data: {
          url: session.shop,
          token: session.accessToken
        }
      })
    }
  } catch (error) {
    throw error;
  }
}