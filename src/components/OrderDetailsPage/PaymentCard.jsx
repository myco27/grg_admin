import React from 'react'
import {Card, CardBody, Typography, Chip} from '@material-tailwind/react'
import { UserCircle, Info, CreditCard, DollarSign, Mail, Phone, BanknoteIcon } from 'lucide-react'

export default function PaymentCard({order}) {
      const InfoBlock = ({ icon: Icon, label, value }) => (
        <div className="flex-1 min-w-[200px] p-4 bg-gray-100 rounded-lg transition-all hover:bg-gray-100">
          <Typography color="gray" className="flex items-center gap-1 text-md font-medium mb-2">
            <Icon className="w-5 h-5" />
            {label}
          </Typography>
          <Typography color="blue-gray" className="font-semibold text-md break-words uppercase">
            {value || "None"}
          </Typography>
        </div>
      );
  return (
    <div>
    <Card className="w-full mx-auto mb-3 shadow-none border border-gray-300 break-all">
      <CardBody className="p-6">
        <div className="flex flex-col gap-4">
          {/* Header with Avatar and Rating */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-500 font-bold text-xl">
                  {/* {rider.first_name?.[0]} */}
                  {/* {rider.last_name?.[0]} */} NA
                </span>
              </div>
              <div>
                <Typography variant="h6" color="blue-gray" className="font-bold">
                  N/A
                </Typography>
                <Typography color="gray" className="flex items-center gap-1 text-md font-medium">
                  <UserCircle className="w-4 h-4" />
                  Customer Name
                </Typography>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoBlock
              icon={Info}
              label="Order ID"
              value={order.order_number}
            />
            <InfoBlock
              icon={CreditCard}
              label="Payment Method"
              value={order.payment_type}
            />
            <InfoBlock
              icon={BanknoteIcon}
              label="Total Price"
              value={`RM ${order.order_amount}`}
            />
          </div>
        </div>
      </CardBody>
    </Card>
    </div>
  )
}
