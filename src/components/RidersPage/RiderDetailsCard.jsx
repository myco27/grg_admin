import React from 'react'
import {Card, CardBody, Typography, Rating} from '@material-tailwind/react'
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

                    <div className='ml-auto text-right'>
                        <Typography color="gray" className="text-md font-medium">
                            Rating:
                        </Typography>
                        <Rating value={5} readonly />
                    </div>

                </div>

            </CardBody>
        </Card>
    </div>
  )
}
