import { Badge, IndexTable, Text } from '@shopify/polaris'
export function refundsRows(
  orders,
  selectedOrders,
  disabled = false,
) {

  const rowMarkup = orders.map(
    ({ id, customer, orders, refunds, percentage, cost, email }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedOrders.includes(id)}
        position={index}
        onClick={() => event.preventDefault()}
        disabled={disabled}
      >
        <IndexTable.Cell>
          {customer}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" numeric>
            {orders}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" numeric>
            {refunds}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone={percentage > 40 ? "critical" : 'new'}>{percentage}%</Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>
          ${cost}
        </IndexTable.Cell>
        <IndexTable.Cell>
          ${email}
        </IndexTable.Cell>

      </IndexTable.Row>
    ),
  )

  return rowMarkup
}
