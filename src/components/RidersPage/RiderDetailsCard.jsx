import React from 'react'
import {Card, CardBody, Typography, Chip} from '@material-tailwind/react'
import { UserCircle, Info, CreditCard, DollarSign, Bike, Mail, Phone, SmartphoneIcon } from 'lucide-react'

export default function PaymentCard({order}) {
    const totalPrice = order.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  return (
    <div>
        <Card className="w-full mx-auto mb-3 shadow-none border border-gray-300">
            <CardBody className="px-6 py-4">

                <div className="flex flex-col xl:flex-row items-start xl:items-center gap-10">

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-xl">{order.riderName.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                        <Typography color="gray" className="flex items-center gap-1 text-md font-medium">
                            <UserCircle className="w-5 h-5" />
                            Rider
                        </Typography>
                        <Typography color="blue-gray" className="font-semibold text-md">
                            {order.riderData[0].name}
                        </Typography>
                        </div>
                    </div>

                    <div>
                        <Typography color="gray" className="flex items-center gap-1 text-md font-medium">
                        <Mail className="w-5 h-5" />
                        Email
                        </Typography>
                        <Typography color="blue-gray" className="font-semibold text-md">
                        {order.riderData[0].email}
                        </Typography>
                    </div>

                    <div>
                        <Typography color="gray" className="flex items-center text-md font-medium">
                        <SmartphoneIcon className="w-5 h-5" />
                        Phone #
                        </Typography>
                        <Typography color="blue-gray" className="font-semibold text-md">
                        {order.riderData[0].phoneNumber}
                        </Typography>
                    </div>

                    <div>
                        <Typography color="gray" className="flex items-center text-md font-medium">
                        <Bike className="w-5 h-5 mr-1" />
                        Motorcyle
                        </Typography>
                        <Typography color="blue-gray" className="font-semibold text-md">
                        {order.riderData[0].motorBrand}
                        </Typography>
                    </div>

                    <div>
                        <Typography color="gray" className="flex items-center gap-1 text-md font-medium">
                        <Info className="w-5 h-5" />
                        Plate #
                        </Typography>
                        <Typography color="blue-gray" className="font-semibold text-md">
                        {order.riderData[0].licensePlate}
                        </Typography>
                    </div>

                    <div className="flex-shrink-0 ml-auto">
                        <Chip
                        value={order.status}
                        className={`text-xs px-3 py-1 rounded-full ${
                            order.status === "Cancelled" ? "bg-red-100 text-red-600" :
                            order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                            order.status === "Delivered" ? "bg-green-100 text-green-600" :
                            order.status === "Processing" ? "bg-blue-100 text-blue-600" :
                            order.status === "Shipped" ? "bg-purple-100 text-purple-600" :
                            order.status === "Completed" ? "bg-purple-100 text-purple-600" :
                            "bg-gray-100 text-gray-900"
                        }`}
                        />
                    </div>

                </div>

            </CardBody>
        </Card>
    </div>
  )
}
