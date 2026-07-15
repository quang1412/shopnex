"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Clock, Loader2, Mail, Package, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function OrderPendingPage() {
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

    const metadata = order?.metadata as any
    const items: any[] = metadata?.items ?? []

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
                            <div className="mx-auto w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
                                <Clock className="h-8 w-8 text-yellow-500" />
                            </div>
                            <h1 className="text-3xl font-bold">Order Received!</h1>
                            <p className="text-muted-foreground">
                                Your order is awaiting payment. Please complete your bank transfer to confirm it.
                            </p>
                        </div>

                        {order && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Order Summary</span>
                                        <span className="text-sm font-normal text-muted-foreground">
                                            #{order.orderId}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {items.length > 0 && (
                                        <>
                                            <div className="space-y-3">
                                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                                    <Package className="h-4 w-4" />
                                                    Items Ordered
                                                </h3>
                                                {items.map((item: any, i: number) => (
                                                    <div key={i} className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">
                                                            {item.name}{" "}
                                                            <span className="text-xs">×{item.quantity}</span>
                                                        </span>
                                                        <span className="font-medium">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <Separator />
                                        </>
                                    )}

                                    {metadata && (
                                        <div className="space-y-1 text-sm">
                                            {metadata.subtotal != null && (
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>Subtotal</span>
                                                    <span>${metadata.subtotal.toFixed(2)}</span>
                                                </div>
                                            )}
                                            {metadata.shippingCost != null && (
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>Shipping</span>
                                                    <span>
                                                        {metadata.shippingCost === 0
                                                            ? "FREE"
                                                            : `$${metadata.shippingCost.toFixed(2)}`}
                                                    </span>
                                                </div>
                                            )}
                                            {metadata.taxAmount != null && (
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>Tax</span>
                                                    <span>${metadata.taxAmount.toFixed(2)}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <Separator />
                                    <div className="flex justify-between font-semibold">
                                        <span>Total Due</span>
                                        <span>${order.totalAmount?.toFixed(2)}</span>
                                    </div>

                                    {order.shippingAddress && (
                                        <>
                                            <Separator />
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
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Payment Instructions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-muted-foreground">
                                <p>
                                    Please complete your bank transfer using the order ID{" "}
                                    <span className="font-semibold text-foreground">
                                        {order?.orderId ?? "—"}
                                    </span>{" "}
                                    as the reference.
                                </p>
                                <p>
                                    Your order will be processed as soon as we confirm receipt of
                                    your payment.
                                </p>
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
