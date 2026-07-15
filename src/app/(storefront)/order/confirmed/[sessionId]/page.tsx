"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Loader2, Mail, Package, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function OrderConfirmedPage() {
    const { sessionId } = useParams<{ sessionId: string }>()
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await fetch(
                    `/api/orders?where[sessionId][equals]=${encodeURIComponent(sessionId)}&depth=0`
                )
                if (res.ok) {
                    const data = await res.json()
                    setOrder(data.docs?.[0] ?? null)
                }
            } finally {
                setLoading(false)
            }
        }
        if (sessionId) fetchOrder()
    }, [sessionId])

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-secondary" />
                            </div>
                            <h1 className="text-3xl font-bold">Payment Successful!</h1>
                            <p className="text-muted-foreground">
                                Your payment has been processed and your order is being prepared.
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Order Details</span>
                                    {order && (
                                        <span className="text-sm font-normal text-muted-foreground">
                                            #{order.orderId}
                                        </span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {order ? (
                                    <>
                                        {order.shippingAddress && (
                                            <div className="space-y-1">
                                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                                    <Truck className="h-4 w-4" />
                                                    Shipping Address
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.shippingAddress.firstName}{" "}
                                                    {order.shippingAddress.lastName}
                                                    <br />
                                                    {order.shippingAddress.address},{" "}
                                                    {order.shippingAddress.city},{" "}
                                                    {order.shippingAddress.state}{" "}
                                                    {order.shippingAddress.zipCode}
                                                </p>
                                            </div>
                                        )}
                                        <Separator />
                                        <div className="flex justify-between font-semibold">
                                            <span>Total Paid</span>
                                            <span>${order.totalAmount?.toFixed(2)}</span>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-2">
                                        Order details are being processed. Check your email for confirmation.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>What&apos;s Next?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="space-y-2">
                                        <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Mail className="h-5 w-5 text-primary" />
                                        </div>
                                        <p className="text-xs font-medium">Confirmation Email</p>
                                        <p className="text-xs text-muted-foreground">Sent to your inbox</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Package className="h-5 w-5 text-primary" />
                                        </div>
                                        <p className="text-xs font-medium">Processing</p>
                                        <p className="text-xs text-muted-foreground">1–2 business days</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Truck className="h-5 w-5 text-primary" />
                                        </div>
                                        <p className="text-xs font-medium">Shipping</p>
                                        <p className="text-xs text-muted-foreground">3–5 business days</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-center">
                            <Link href="/products">
                                <Button>Continue Shopping</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}
