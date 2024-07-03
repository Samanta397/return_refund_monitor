import type {LoaderFunctionArgs} from "@remix-run/node";
import {authenticate} from "~/shopify.server";
import {Layout, Page} from "@shopify/polaris";
import {Table} from "~/components/Table";
import {
  refundsResourceName,
  refundsSearchPlaceholder,
  refundsTableHeadings
} from "~/routes/app.dashboard/refundsTableConfig";
import {refundsRows} from "~/routes/app.dashboard/refundsRows";
import {getCustomerOrders} from "~/api/order.server";
import {processOrderData} from "~/routes/utils/processOrderData";
import {json} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
   const {session} = await authenticate.admin(request);

   if (!session) {
     console.log('ERROR SESSION NOT EXISTS')
   }

   const customerOrders = await getCustomerOrders(session.shop)
  const orders = processOrderData(customerOrders)

  return json({
    orders
  })
};

export default function DashboardPage() {
  const {orders} = useLoaderData<typeof loader>();

  const rowMarkup = refundsRows(orders, [])
  //TODO: add pagination, sorting, searching
  return (
    <Page title={'Products'}>

      <Layout>
        <Layout.Section>
          <Table items={orders}
                 rowMarkup={rowMarkup}
                 setSelectedItems={() => {}}
                 resourceName={refundsResourceName}
                 sortable={[false, false, false, false, false]}
                 bulkActions={[]}
                 headings={refundsTableHeadings}
                 pagination={{
                   // hasNext: paginationInfo.hasNextPage,
                   // hasPrevious: paginationInfo.hasPreviousPage,
                   // onPrevious: () => navigate(paginationInfo.previousLink),
                   // onNext: () => navigate(paginationInfo.nextLink)
                 }}
                 filterTabs={[]}
                 queryPlaceholder={refundsSearchPlaceholder}
                 onCancel={() => {}}
                 onSort={() => {}}
                 searchQuery={''}
                 setSearchQuery={() => {}}
                 disabled={false}
          />
        </Layout.Section>
      </Layout>

    </Page>
  )
}